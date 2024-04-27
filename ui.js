const container = document.querySelector(
	"#saved_password_container"
);
const rollinput = document.querySelector("#rollno_enter");
const pwdinput = document.querySelector("#password_enter");
const setbtn = document.querySelector("#setbtn");
const status = document.querySelector("#status");
const showbtn = document.querySelector("#showbtn");
const force_login = document.querySelector("#force_login");
const last_login = document.querySelector("#last_login");
const github = document.querySelector("#github");
const logout = document.querySelector("#logout");

setbtn.addEventListener("click", () => {
	chrome.storage.sync
		.set({
			iitbhu_rollno: rollinput.value,
			iitbhu_pwd: pwdinput.value,
		})
		.then(() => {
			status.innerText = "Setting...";
			setTimeout(() => {
				status.innerText = "Credentials set!";
			}, 200);
			setTimeout(() => {
				status.innerText = "";
			}, 3000);
		});
});
chrome.storage.sync.get(
	["iitbhu_rollno", "iitbhu_pwd", "last_login", "logout_id"],
	function (items) {
		rollinput.value = items.iitbhu_rollno ?? "";
		pwdinput.value = items.iitbhu_pwd ?? "";
		last_login.innerText =
			"Last login: " +
			(items.last_login
				? new Date(items.last_login).toLocaleString("en-IN")
				: "never");
		if (!items.logout_id) {
			logout.setAttribute("disabled", true);
		}
	}
);
showbtn.addEventListener("click", () => {
	let shown = showbtn.getAttribute("shown");
	let type;
	if (shown === "0") {
		shown = "1";
		type = "text";
		showbtn.innerText = "Hide";
	} else {
		shown = "0";
		type = "password";
		showbtn.innerText = "Show";
	}
	showbtn.setAttribute("shown", shown);
	pwdinput.setAttribute("type", type);
});

force_login.addEventListener("click", () => {
	chrome.tabs.create({
		url: "http://192.168.249.1:1000/login?26be012a3d54c15e",
	});
});

logout.addEventListener("click", () => {
	chrome.storage.sync.get(["logout_id"], (items) => {
		if (!items.logout_id) {
			return console.log("no last logout");
		}
		fetch("http://192.168.249.1:1000/logout" + items.logout_id)
			.then((k) => k.text())
			.then((text) => {
				console.log(text);
				// const dom = new DOMParser();
				// let doc = dom.parseFromString(text);
			});
	});
	logout.setAttribute("disabled", true);
	chrome.storage.sync.set({ logout_id: "" });
});

github.addEventListener("click", () => {
	chrome.tabs.create({
		url: "https://github.com/kuv2707/auto_login",
	});
});
