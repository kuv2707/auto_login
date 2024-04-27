chrome.runtime.onMessage.addListener(
	async (message, sender, sendResponse) => {
		if (message.message === "closetab") {
			sendResponse("Closing tab")
			const tabs = await chrome.tabs.query({
				active: true,
				currentWindow: true,
			});
			if (tabs.length > 0) {
				setTimeout(
					() =>
						chrome.tabs.remove(tabs[0].id, console.log),
					5000
				);
			}
		}else{
			sendResponse({message:"Unknown message "+message.message})
		}
	}
);
