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
