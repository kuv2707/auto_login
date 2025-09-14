execute();
function execute() {
	if (window.location.pathname === "/keepalive") {
		chrome.storage.local.set({
			last_login: Date.now(),
			logout_id: window.location.search,
			signin_url: "",
		});
		render_success();
		return;
	}
	const rollnofield = document.querySelector("#ft_un");
	const pwdfield = document.querySelector("#ft_pd");
	const form = document.querySelector("form");
	const auth_stage = document.querySelector(".logo");
	if (auth_stage.innerHTML.includes("Failed")) {
		return askCorrectCredentials();
	}
	chrome.storage.local.get(
		["iitbhu_rollno", "iitbhu_pwd"],
		function (items) {
			if (!items.iitbhu_rollno || !items.iitbhu_pwd) {
				askCorrectCredentials();
				return console.log("No credentials found");
			}
			rollnofield.value = items.iitbhu_rollno;
			pwdfield.value = items.iitbhu_pwd;
			form.submit();
		}
	);
	function askCorrectCredentials() {
		auth_stage.innerText =
			"Please add correct credentials to the IIT(BHU) login extension.";
	}
}

function render_success() {
	const timeout = 300;
	chrome.runtime.sendMessage(
		{ message: "close_tab", params: { timeout } },
		console.log
	);
	document.body.innerHTML = `Logged in!`;
	document.body.style = `
		background-color: green;
		color: white;
		filter: drop-shadow(0 0 10px white);
		font-size: 8em;
		text-align: center;
		margin-top: 20%;
	`;
}
