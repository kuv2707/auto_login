const container = document.querySelector(
	"#saved_password_container"
);
const rollinput = document.querySelector("#rollno_in");
const pwdinput = document.querySelector("#pwd_in");
const setbtn = document.querySelector("#setbtn");
const status = document.querySelector("#status");
const show_pwd = document.querySelector("#show_pwd");
const force_login = document.querySelector("#force_login");
const last_login = document.querySelector("#last_login");
const github = document.querySelector("#github");
const logout = document.querySelector("#logout");

setbtn.addEventListener("click", () => {
	status.innerText = "Setting...";
	chrome.storage.sync
		.set({
			iitbhu_rollno: rollinput.value,
			iitbhu_pwd: pwdinput.value,
		})
		.then(() => {
			setTimeout(() => {
				status.innerText = "Credentials set!";
				setTimeout(() => {
					status.innerText = "";
				}, 3000);
			}, 200);
		});
});
chrome.storage.sync.get(
	[
		"iitbhu_rollno",
		"iitbhu_pwd",
		"last_login",
		"logout_id",
		"signin_url_id",
	],
	function (items) {
		rollinput.value = items.iitbhu_rollno ?? "";
		pwdinput.value = items.iitbhu_pwd ?? "";
		last_login.innerText =
			"Last login: " +
			(items.last_login
				? new Date(items.last_login).toLocaleString("en-IN")
				: "never");
		if (items.logout_id) {
			logout.setAttribute("logout_id", items.logout_id);
		} else {
			logout.setAttribute("disabled", true);
		}
		if (items.signin_url_id) {
			force_login.setAttribute(
				"signin_url_id",
				items.signin_url_id
			);
		} else {
			force_login.setAttribute("disabled", true);
		}
		document.body.style.display = "block";
	}
);
show_pwd.addEventListener("click", () => {
	let shown = pwdinput.getAttribute("type") === "text";
	pwdinput.setAttribute("type", shown ? "password" : "text");
});

force_login.addEventListener("click", () => {
	const url_id = force_login.getAttribute("signin_url_id");
	if (!url_id) {
		return;
	}
	chrome.tabs.create({
		url: "http://192.168.249.1:1000/fgtauth" + url_id,
	});
});

logout.addEventListener("click", () => {
	chrome.storage.sync.get(["logout_id"], async (items) => {
		if (!items.logout_id) {
			return console.log("no last logout");
		}
		let logout_text = await execute_logout(
			items.logout_id
		).then(() => execute_logout(items.logout_id));
		console.log(logout_text);
		await chrome.storage.sync.set({
			signin_url_id: logout_text,
			logout_id: "",
		});
		window.close();
	});
});

async function execute_logout(logout_id) {
	return await fetch(
		"http://192.168.249.1:1000/logout" + logout_id
	)
		.then((k) => k.text())
		.catch(console.error);
}

github.addEventListener("click", () => {
	chrome.tabs.create({
		url: "https://github.com/kuv2707/auto_login",
	});
});
