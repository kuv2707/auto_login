chrome.runtime.onMessage.addListener(
	async (message, sender, sendResponse) => {
		if (message.message === "closetab") {
			sendResponse("Closing tab");
			const tabs = await chrome.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (tabs.length > 0) {
				setTimeout(
					() =>
						chrome.tabs.remove(tabs[0].id, console.log),
					message.timeout ?? 0
				);
			}
		} else {
			sendResponse({
				message: "Unknown message " + message.message,
			});
		}
	}
);

chrome.runtime.onStartup.addListener(() => {
	console.log("Auto login initiated")
	chrome.storage.sync.get(
		["last_login", "signin_url_id"],
		(items) => {
			const interval = Date.now() - items.last_login || 0;
			//if interval is greater than 10 hours
			if (interval > 10*60*60*1000) {
				chrome.tabs.create({
					url:
						"http://192.168.249.1:1000/fgtauth" +
						items.signin_url_id,
				});
			}
		}
	);
});
