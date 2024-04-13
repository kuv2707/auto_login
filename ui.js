const container = document.querySelector(
	"#saved_password_container"
);
const rollinput = document.querySelector("#rollno_enter");
const pwdinput = document.querySelector("#password_enter");
const setbtn = document.querySelector("#setbtn");
const status = document.querySelector("#status");
const showbtn = document.querySelector("#showbtn");

setbtn.addEventListener("click", () => {
	chrome.storage.sync.set({
		iitbhu_rollno: rollinput.value,
		iitbhu_pwd: pwdinput.value,
	}).then(()=>{
		status.innerText = "Credentials set!"
	})
});
chrome.storage.sync.get(
	["iitbhu_rollno", "iitbhu_pwd"],
	function (items) {
		rollinput.value = items.iitbhu_rollno;
		pwdinput.value = items.iitbhu_pwd;
	}
);
showbtn.addEventListener("click",()=>{
	console.log("togg")
	let shown = showbtn.getAttribute("shown");
	let type;
	if(shown==="0"){
		shown="1";
		type = "text";
	}else{
		shown="0";
		type="password";
	}
	showbtn.setAttribute("shown", shown);
	pwdinput.setAttribute("type", type);
})