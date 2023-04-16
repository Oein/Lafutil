// ==UserScript==
// @name        Lafutil
// @description Make better laftel
// @match       *://*.laftel.net/*
// ==/UserScript==

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

function createLoader() {
  if (document.getElementById("lafutil_loader") != null) return;
  let div = document.createElement("div");
  div.id = "lafutil_loader";
  div.style.left = "0";
  div.style.top = "0";
  div.style.opacity = "0";
  div.style.position = "fixed";
  div.style.width = "100vw";
  div.style.height = "100vh";
  div.style.background = "rgba(0,0,0,0.9)";
  div.style.zIndex = "123456";
  div.style.transition = ".1s ease";
  div.style.pointerEvents = "none";

  let subdiv = document.createElement("div");
  subdiv.id = "lafutil_loader_sub";
  subdiv.style.position = "fixed";
  subdiv.style.left = "50%";
  subdiv.style.top = "50%";
  subdiv.style.transform = "translate(-50%, -50%)";
  subdiv.style.color = "white";
  subdiv.style.fontSize = "2em";
  subdiv.innerText = "로그인중...";

  div.appendChild(subdiv);
  document.body.appendChild(div);
}

function setLoader(str) {
  if (document.getElementById("lafutil_loader") == null) return;
  let div = document.getElementById("lafutil_loader");
  if (str == "") {
    div.style.pointerEvents = "none";
    div.style.opacity = "0";
    return;
  }
  div.style.pointerEvents = "initial";
  div.style.opacity = "1";
  document.getElementById("lafutil_loader_sub").innerText = str;
}

function trySignin() {
  let xURL = localStorage.getItem(`Lafutil::API URL`);
  let autoSignin = localStorage.getItem(`Lafutil::Use auto signin`) == "true";
  if (!xURL) return;
  if (!autoSignin) return;
  setLoader("로그인중...");
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  tryingSignin = true;
  fetch(xURL, requestOptions)
    .then((response) => response.text())
    .then((res) => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: `Token ${res}`,
        })
      );
      setTimeout(() => {
        location.reload();
      }, 100);
    })
    .catch((error) => console.log("error", error));
}

function fullscreenButtonMaker() {
  return;
  let oldFullscreenButton = document.querySelector(
    selectors["fullscreenButton"] + "#lafutiled"
  );
  if (oldFullscreenButton != null) return;

  oldFullscreenButton = document.querySelector(selectors["fullscreenButton"]);
  if (oldFullscreenButton == null) return;
  console.log("Replace button");
  let newFullscreenButton = oldFullscreenButton.cloneNode(true);

  newFullscreenButton.id = "lafutiled";
  let vid = document.querySelector(selectors["video"]);

  let subs = document.querySelectorAll(`${selectors["video"]} > *`);
  let subvid = subs[subs.length - 1];

  newFullscreenButton.addEventListener("click", () => {
    videoFullSized = !videoFullSized;

    if (videoFullSized) {
      try {
        vidoldStyle = vid.style || {};
      } catch (e) {
        vidoldStyle = {};
      }
      try {
        vidsuboldStyle = subvid.style || {};
      } catch (e) {
        vidsuboldStyle = {};
      }
      vid.style.zIndex = "123";
      vid.style.position = "fixed";
      vid.style.top = "0px";
      vid.style.left = "0px";
      vid.style.transform = "rotate(90deg) translateY(-50%)";
      vid.style.transformOrigin = "bottom left";
      vid.style.width = "100vh";
      vid.style.height = "100vw";
      vid.style.marginTop = "-100vw";
      vid.style.objectFit = "cover";
      vid.style.background = "black";

      subvid.style.top = "50%";
      subvid.style.transform = "translateY(-50%)";

      return;
    }
    vid.style = vidoldStyle;
    subvid.style = vidsuboldStyle;
  });

  oldFullscreenButton.parentElement.replaceChild(
    newFullscreenButton,
    oldFullscreenButton
  );
}

const observer = new MutationObserver((mutationList, observer) => {
  if (mutationList[0].target.classList.length == 0) {
    if (mutationList[0].addedNodes.length) fullscreenButtonMaker();
  }
});

function startFullscreenObserve() {
  var videoTools = document.querySelector(
    ".App > div:nth-child(2) > div:first-child > div:first-child > div:first-child > div:first-child > div:first-child"
  );

  observer.observe(videoTools, {
    childList: true,
    subtree: true,
  });
}

function closeFullscreenObserve() {
  observer.disconnect();
}

function __al(msg) {
  let div = document.createElement("div");
  div.style.position = "fixed";
  div.style.bottom = "-48px";
  div.style.transition = "all 0.3s";
  div.style.left = "50%";
  div.style.transform = "translateX(-50%)";
  div.style.height = "48px";
  div.style.lineHeight = "48px";
  div.style.textAlign = "center";
  div.style.width = "fit-content";
  div.style.minWidth = "min(50vw,300px)";
  div.style.background = "rgba(4, 170, 109,0.8)";
  div.style.borderRadius = "8px 8px 0px 0px";

  div.innerText = msg.msg;

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.bottom = "0px";

    setTimeout(() => {
      div.style.bottom = "-48px";
      setTimeout(() => {
        div.remove();
        messageQueue.shift();
        if (messageQueue.length > 0) __al(messageQueue[0]);
      }, 500);
    }, msg.ms || 2000);
  }, 10);
}

function alertToTheBottom(message = "test message", ms = 2000) {
  messageQueue.push({
    msg: message,
    ms: ms,
  });
  if (messageQueue.length == 1) __al(messageQueue[0]);
}

function createLafutilConfigPage() {
  let root = document.createElement("main");

  root.innerHTML = "<h1>Lafutil 설정</h1>";

  let style = document.createElement("style");
  style.innerHTML = `
      main {
        margin: 0px auto;
        width: 1184px;
        min-height: 100%;
        margin-top: 6.5rem;
        margin-bottom: 3rem;
      }

      @media (max-width: 1280px) {
        main {
          width: 100%;
          padding-left: 3.125rem;
          padding-right: 3.125rem;
        }
      }

      @media (max-width: 1024px) {
        main {
            padding-left: 1rem;
            padding-right: 1rem;
        }
      }

      main > h1 {
        margin-top: 0px;
        font-size: 1.5rem;
        font-weight: 700;
      }

      main > h2 {
        margin-bottom: 1.5rem;
        font-size: 1.125rem;
        font-weight: 700;
      }

      input {
        padding: 8px;
        border: none;
        border-radius: 4px;
        outline: none;
        flex-grow:1;
        height: 40px;
        color: black;
      }
      
      .input-container {
        display: flex;
        width: 100%;
        height: fit-content;
        flex-direction:row;
      }

      .input-container > * {
        margin: 5px;
      }

      .input-label {
        line-height: 40px;
        user-select: none;
      }

      .all-container {
        -webkit-user-select: none;
        user-select: none;
        cursor: pointer;
      }

      .svg-container > svg {
        width: 1.5rem;
        height: 1.5rem;
        transition: all 0.2s;
        position: relative;
        top: 0px;
        left: 0px;
      }

      .svg-container > svg:nth-child(2) {
        margin-top: -1.5rem;
      }
      `;
  root.appendChild(style);

  function createInpEle(type) {
    let xData = localStorage.getItem(`Lafutil::${type}`);
    if (!xData) {
      localStorage.setItem(`Lafutil::${type}`, "");
      xData = "";
    }

    let inpContainer = document.createElement("div");
    inpContainer.className = "input-container";

    let inpName = document.createElement("label");
    inpName.textContent = type;
    inpName.className = "input-label";

    let inp = document.createElement("input");
    inp.placeholder = type;
    inp.id = "inp";
    inp.value = xData;
    inp.addEventListener("change", (e) => {
      alertToTheBottom(type + " has been updated", 750);
      localStorage.setItem("Lafutil::" + type, e.target.value);
    });

    inpContainer.appendChild(inpName);
    inpContainer.appendChild(inp);

    return inpContainer;
  }

  function createOnOffEle(type) {
    let onSvg = `<svg style="color: rgb(129, 107, 255);" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 5H5v14h14V5ZM5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M17.625 7.95c.431.356.5 1.004.156 1.449l-6 7.725a.991.991 0 0 1-.726.385.984.984 0 0 1-.762-.3l-3.5-3.605a1.052 1.052 0 0 1 0-1.457.98.98 0 0 1 1.414 0l2.71 2.791 5.302-6.826a.98.98 0 0 1 1.406-.161Z" fill="currentColor"></path></svg>`;
    let offSvg = `<svg style="color: rgb(255, 255, 255);" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 5H5v14h14V5ZM5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Z" fill="currentColor"></path></svg>`;

    let xLocal = localStorage.getItem(`Lafutil::${type}`);

    if (xLocal == null) {
      localStorage.setItem(`Lafutil::${type}`, "true");
      xLocal = "true";
    }

    let isOn = xLocal == "true";

    let svgContainer = document.createElement("span");
    svgContainer.className = "svg-container";

    svgContainer.innerHTML = `${onSvg}${offSvg}`;

    const setSVG = (isOn) => {
      svgContainer.children[0].style.opacity = isOn ? 1 : 0;
      svgContainer.children[1].style.opacity = !isOn ? 1 : 0;
    };

    setSVG(isOn);

    let label = document.createElement("span");
    label.textContent = type;
    label.style.fontSize = "1.125rem";

    let allContainer = document.createElement("div");
    allContainer.appendChild(svgContainer);
    allContainer.appendChild(label);
    allContainer.className = "all-container";
    allContainer.style.display = "flex";

    allContainer.addEventListener("click", () => {
      isOn = !isOn;
      setSVG(isOn);
      localStorage.setItem(`Lafutil::${type}`, isOn ? "true" : "false");
      alertToTheBottom(type + " has been updated", 750);
    });

    return allContainer;
  }

  let configs = ["API URL"];
  let onOffConfigs = ["Use auto signin", "Use lafutil video controller"];

  let h2x = document.createElement("h2");
  h2x.innerText = "String settings";
  root.appendChild(h2x);

  configs.forEach((configName) => {
    root.appendChild(createInpEle(configName));
  });

  let h2y = document.createElement("h2");
  h2y.innerText = "Boolean settings";
  root.appendChild(h2y);

  onOffConfigs.forEach((configName) => {
    root.appendChild(createOnOffEle(configName));
  });

  alertToTheBottom("Lafutil config page created");

  let rro = document.querySelector(".App > div:nth-child(2)");
  rro.innerHTML = "";
  rro.appendChild(root);
  rro.style.alignItems = "unset";
  rro.style.display = "unset";
  rro.style.webkitBoxAlign = "unset";
  rro.style.webkitBoxPack = "unset";
  rro.style.justifyContent = "unset";
  rro.style.height = "unset";
}

function addButtonToSettings() {
  let exBtn = document.querySelector(
    "main > section:nth-child(2) > div:nth-child(4)"
  );

  let newBtn = exBtn.cloneNode(true);
  newBtn.children[0].textContent = "Lafutil 설정으로 이동";
  newBtn.children[1].textContent = "이동";
  newBtn.children[1].addEventListener("click", () => {
    location.href = "/lafutil";
  });

  document.querySelector("main > section:nth-child(2)").appendChild(newBtn);
}

function lafutil() {
  let v;
  let p = 1;
  const getUseLafutil = () =>
    localStorage.getItem(`Lafutil::Use lafutil video controller`) == "true";

  const eventListener = (e) => {
    if (!getUseLafutil()) return;
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
      alertToTheBottom(
        "Now video speed is " + v.playbackRate.toString() + ".",
        750
      );
    }
    if (e.code == "Comma" && e.shiftKey) {
      v.playbackRate = Math.max(v.playbackRate - 0.25, 0.25);
      alertToTheBottom(
        "Now video speed is " + v.playbackRate.toString() + ".",
        750
      );
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
  const check = () => {
    // Enable Lafutil
    if (
      getUseLafutil &&
      document.getElementsByTagName("video").length > 0 &&
      detected == false
    ) {
      main();
      detected = true;
      alertToTheBottom("Lafutil detected video.");
    }

    // Disable Lafutil
    if (
      document.getElementsByTagName("video").length == 0 &&
      detected == true
    ) {
      alertToTheBottom("Lafutil lost video.");
      document.removeEventListener("keydown", eventListener);
      detected = false;
    }

    // Get logger
    if (detected && !getUseLafutil()) {
      alertToTheBottom("Lafutil disabled.");
      document.removeEventListener("keydown", eventListener);
      detected = false;
    }
  };
  interval = setInterval(check, 200);
}

function intervaler() {
  createLoader();
  let pname = location.pathname;

  if (
    tryingSignin == false &&
    (pname == "/auth/login" || pname == "/auth/email")
  ) {
    trySignin();
    tryingSignin = true;
  }

  if (!configPageCreated && pname == "/lafutil") {
    configPageCreated = true;
    createLafutilConfigPage();
  }
  if (configPageCreated && pname != "/lafutil") configPageCreated = false;

  if (!settingsAdded && pname == "/setting") {
    addButtonToSettings();
    settingsAdded = true;
  }
  if (settingsAdded && pname != "/setting") {
    settingsAdded = false;
  }
}

const createInt = () => {
  if (document.readyState != "complete") return;
  if (intervalAdded) return;

  intervalAdded = true;
  alertToTheBottom("Lafutil is now ready!");
  lafutil();

  intervaler();
  setInterval(intervaler, 500);
};

window.addEventListener("DOMContentLoaded", createInt);
document.addEventListener("readystatechange", createInt);
createInt();
