const func_map = {
	close_tab: close_tab,
	login: login,
	logout: logout,
};
chrome.runtime.onMessage.addListener(
	async (message, sender, sendResponse) => {
		console.log(sender, message);
		if (!func_map[message.message]) {
			return sendResponse("invalid message");
		}
		func_map[message.message](message.params);
	}
);

function close_tab({ timeout }) {
	setTimeout(async () => {
		const tabs = await chrome.tabs.query({
			url: "http://192.168.249.1:1000/*",
		});
		chrome.tabs.remove(tabs.map((k) => k.id));
	}, timeout ?? 0);
}

function login({ url_id }) {
	chrome.tabs.create({
		url: "http://192.168.249.1:1000/fgtauth" + url_id,
	});
}

async function logout() {
	return chrome.storage.local
		.get(["logout_id"])
		.then(async (items) => {
			if (!items.logout_id) {
				return console.log("no last logout");
			}
			let logout_text = await execute_logout(
				items.logout_id
			).then(() => execute_logout(items.logout_id));
			console.log(logout_text);
			await chrome.storage.local.set({
				signin_url_id: logout_text,
				logout_id: "",
			});
		});

	async function execute_logout(logout_id) {
		return await fetch(
			"http://192.168.249.1:1000/logout" + logout_id
		)
			.then((k) => {
				return k.text();
			})
			.catch(console.error);
	}
}

chrome.runtime.onStartup.addListener(() => {
	console.log("Auto login initiated");
	chrome.storage.local.get(
		["last_login"],
		(items) => {
			console.log(items);
			const interval = Date.now() - items.last_login || 0;
			if (interval < 10 * 60 * 60 * 1000) {
				return;
			}
			if(!items.signin_url_id) {
				return;
			}
			//if interval is greater than 10 hours, login
			logout().then(() => {
				chrome.tabs.create({
					url:
						"http://192.168.249.1:1000/fgtauth" +
						items.signin_url_id,
				});
			});
		}
	);
});
