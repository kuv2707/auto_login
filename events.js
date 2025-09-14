const func_map = {
	close_tab,
	login,
	logout,
	relogin
};
const GAP_MS = 11.9 * 60 * 60 * 1000; // A little before 12 hours
chrome.runtime.onMessage.addListener(
	async (message, sender, sendResponse) => {
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

async function login({ url_id }) {
	chrome.tabs.create({
		url: url_id,
	});
	const cleared = await chrome.alarms.clearAll();
	console.log("Cleared all alarms:", cleared);

	await chrome.alarms.create("Re-login IIT(BHU)", {
		when: Date.now() + GAP_MS,
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
				// logging out the second time gives the token
				// for the next login
			).then(() => execute_logout(items.logout_id));
			await chrome.storage.local.set({
				signin_url: logout_text.substring(
					logout_text.indexOf("http"),
					logout_text.indexOf('";')
				),
				logout_id: "",
			});
		});

	async function execute_logout(logout_id) {
		console.log("logout");
		return await fetch(
			"http://192.168.249.1:1000/logout" + logout_id
		)
			.then(async (k) => {
				let ret = await k.text();
				return ret;
			})
			.catch(console.error);
	}
}

async function relogin() {
	return logout().then(() => {
		chrome.storage.local.get(["signin_url"]).then((items) => {
			login({ url_id: items.signin_url });
		});
	});
}

chrome.alarms.onAlarm.addListener((alarm) => {
	console.log("Auto login alarm", alarm);
	return relogin();
});
