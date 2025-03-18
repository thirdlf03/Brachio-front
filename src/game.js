import axios from 'axios';
import init, { convgray, is_green } from './image_process.js';
const changebutton = document.getElementById("change");
let count = 0;
let lists = [];
let flag = true;
let gameflag = false;
let green = false;
let collect_num = 0;

const sleep = (time) => new Promise((r) => setTimeout(r, time));

async function start() {
  await init();
  console.log("WASM initialized!");
}

start();

changebutton.addEventListener("click", async () => {
  lists = await axios.get("https://test.naokimiura15.workers.dev/").then(response => {
    return response.data
  });

  gameflag = true;
  const app = document.getElementById("app");
  app.innerHTML = `
    <span>横がみどりになればok→</span><meter id="rc-st" min="0" max="5000"></meter>
    <img id="baseimg" crossorigin="annonymous" src=${lists[count]} hidden></img>
    <img style="height: 600px; width: 600px" id="output" src=""></img>
    <script>
    </script>
  `
  setimage();
});

function alert() {
  let alertBox = document.createElement("div");
  alertBox.id = "alertBox";
  alertBox.style.cssText = ' font-size: 46px; color: black; width: 100%; padding: 20px 0; text-align: center; position: fixed; top: 0px; left: 0px; ';
  alertBox.textContent = 'PUSH or PULL!';
  document.body.appendChild(alertBox);
  function removeMsg() {
    let alertBox = document.getElementById("alertBox");
    let body = document.getElementsByTagName("body")[0];
    body.removeChild(alertBox);
  }
  setTimeout(() => removeMsg(), 1000);
}

function setimage() {
  const img = document.getElementById("baseimg");
  img.onload = function () {
    var canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    const base64 = dataURL.match(/base64,(.*)/)?.[1];

    const tmp = convgray(base64);
    green = is_green(base64);
    const output_image = "data:image/png;base64," + tmp;
    document.getElementById("output").setAttribute("src", output_image);
  };
};

let a = setInterval(() => {
  if (flag == true || gameflag != true) {
    return
  } else {
    alert()
    flag = true
  }
}, 3500)

let b = setInterval(() => {
  if (count >= 10) {
    document.getElementById("output").remove();
    const app = document.getElementById("app");
    app.innerHTML += `
    <h1>ゲーム終了</h1>
    <p>${collect_num}問正解!!</p>
    `
    clearInterval(a);
    clearInterval(b);
    gameflag = false;
  }
  let strain = document.querySelector('#rc-st').value;
  if (strain > 3200 && flag === true) {
    if (green == true) {
      console.log("collect");
      collect();
      showimage();
    } else {
      console.log("mistatke");
      mistake();
      showimage();
    }
  } else if (10 < strain && strain < 600 && flag == true) {
    if (green == false) {
      console.log("colelct");
      collect();
      showimage();
    } else {
      console.log("mistake");
      mistake();
      showimage();
    }
  }
}, 100)

function showimage() {
  document.getElementById("output").setAttribute("src", lists[count]);
}

async function collect() {
  await sleep(5);
  count += 1;
  collect_num += 1;
  flag = false;
  document.getElementById("baseimg").setAttribute("src", lists[count]);
  setimage();
  console.log("collect num ", collect_num);
  9
}

async function mistake() {
  await sleep(5);
  count += 1;
  flag = false;
  document.getElementById("baseimg").setAttribute("src", lists[count]);
  setimage()
}
