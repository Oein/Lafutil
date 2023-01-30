var s = document.createElement("script");
s.src = chrome.runtime.getURL("inject.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);

var s2 = document.createElement("script");
s2.src = chrome.runtime.getURL("toastr.min.js");
s2.onload = function () {
  this.remove();
};
s2.async = true;
(document.head || document.documentElement).appendChild(s2);
var l = document.createElement("link");
l.href = chrome.runtime.getURL("toastr.min.css");
l.rel = "stylesheet";
(document.head || document.documentElement).appendChild(l);
let inta;
const che = () => {
  if (typeof toastr != "undefined") {
    toastr.options = {
      positionClass: "toastr-bottom-right",
    };
    clearInterval(inta);
  }
};
inta = setInterval(che, 100);
