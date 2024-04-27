window.onload = () => {
	if (window.location.pathname === "/keepalive") {
		chrome.storage.sync.set({
			last_login: Date.now(),
			logout_id: window.location.search,
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
	chrome.storage.sync.get(
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
};

function render_success() {
	console.log("rendering success message");
	chrome.runtime.sendMessage(
		{ message: "closetab" },
		console.log
	);
	let n = 5;
	let close_interval = setInterval(() => {
		n--;
		if (n === 0) {
			clearInterval(close_interval);
		}
		document.body.innerHTML = `<h1>Logged in successfully!</h1>
		<p> This tab will close in ${n} seconds</p>`;
	}, 1000);
}
