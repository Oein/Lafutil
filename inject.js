let v;
let p = 1;

const eventListener = (e) => {
  if (document.getElementsByTagName("video").length < 0) {
    document.removeEventListener("keydown", eventListener);
    detected = false;
    return;
  }
  console.log(e);
  if (e.code == "KeyL") v.currentTime += 5;
  if (e.code == "KeyK") {
    if (v.playbackRate == 0) {
      v.playbackRate = p;
      v.play();
    } else {
      p = v.playbackRate;
      v.playbackRate = 0;
      v.pause();
    }
  }
  if (e.code == "KeyJ") v.currentTime -= 5;
  if (e.code == "KeyI") v.requestPictureInPicture();
  if (e.code == "Period" && !e.shiftKey) v.currentTime += 1 / 60;
  if (e.code == "Comma" && !e.shiftKey) v.currentTime -= 1 / 60;
  if (e.code == "Period" && e.shiftKey) {
    v.playbackRate = Math.min(v.playbackRate + 0.25, 10);
    toastr.info("Now video speed is " + v.playbackRate.toString() + "."); 
  }
  if (e.code == "Comma" && e.shiftKey) {
    v.playbackRate = Math.max(v.playbackRate - 0.25, 0.25);
    toastr.info("Now video speed is " + v.playbackRate.toString() + "."); 
  }
  if (e.code == "Digit1") v.currentTime = (v.duration * 1) / 10;
  if (e.code == "Digit2") v.currentTime = (v.duration * 2) / 10;
  if (e.code == "Digit3") v.currentTime = (v.duration * 3) / 10;
  if (e.code == "Digit4") v.currentTime = (v.duration * 4) / 10;
  if (e.code == "Digit5") v.currentTime = (v.duration * 5) / 10;
  if (e.code == "Digit6") v.currentTime = (v.duration * 6) / 10;
  if (e.code == "Digit7") v.currentTime = (v.duration * 7) / 10;
  if (e.code == "Digit8") v.currentTime = (v.duration * 8) / 10;
  if (e.code == "Digit9") v.currentTime = (v.duration * 9) / 10;
  if (e.code == "Digit0") v.currentTime = 0;
};

let detected = false;
function main() {
  v = document.getElementsByTagName("video")[0];
  p = v.playbackRate;
  document.addEventListener("keydown", eventListener);
}

let interval;
let toastChecked = false;
const check = () => {
  if (typeof toastr !== "undefined" && toastChecked == false) {
    toastr.success("Lafutil is ready!");
    toastChecked = true;
  }
  if (document.getElementsByTagName("video").length > 0 && detected == false) {
    main();
    detected = true;
    toastr.info("Lafutil detected video.");
  }
  if (document.getElementsByTagName("video").length == 0 && detected == true) {
    toastr.warning("Lafutil lost video.");
    document.removeEventListener("keydown", eventListener);
    detected = false;
  }
};
interval = setInterval(check, 100);
