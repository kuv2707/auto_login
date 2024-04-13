window.onload = () => {
	if (window.location.pathname.includes("keepalive")) {
		return console.log("Logged in");
	}
	const rollnofield = document.querySelector("#ft_un");
	const pwdfield = document.querySelector("#ft_pd");
	const form = document.querySelector("form");

	chrome.storage.sync.get(
		["iitbhu_rollno", "iitbhu_pwd"],
		function (items) {
			rollnofield.value = items.iitbhu_rollno;
			pwdfield.value = items.iitbhu_pwd;
			form.submit();
		}
	);
};
