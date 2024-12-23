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
	toast("Saving...", TOAST_INFO);
	chrome.storage.local
		.set({
			iitbhu_rollno: rollinput.value,
			iitbhu_pwd: pwdinput.value,
		})
		.then(() => {
			toast("Credentials saved!", TOAST_SUCCESS);
		})
		.catch(() => toast("Error in saving!", TOAST_ERROR));
});
chrome.storage.local.get(
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
	chrome.runtime.sendMessage({
		message: "login",
		params: { url_id },
	});
});

logout.addEventListener("click", () => {
	chrome.runtime.sendMessage(
		{ message: "logout", params: {} },
		window.close
	);
});

github.addEventListener("click", () => {
	chrome.tabs.create({
		url: "https://github.com/kuv2707/auto_login",
	});
});

const TOAST_ERROR = "red",
	TOAST_INFO = "blue",
	TOAST_SUCCESS = "green";
let timeout_id;
function toast(text, type) {
	clearTimeout(timeout_id);
	status.style.color = type;
	status.innerText = text;
	timeout_id = setTimeout(() => {
		status.innerText = "";
	}, 3000);
}
