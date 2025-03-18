import axios from 'axios';
const changebutton = document.getElementById("change");
let count = 0;
let lists = [];
let flag = true;
let gameflag = false;

changebutton.addEventListener("click", async () => {
  lists = await axios.get("https://test.naokimiura15.workers.dev/").then(response => {
    return response.data
  });

  gameflag = true;
  const app = document.getElementById("app");
  app.innerHTML = `
    <span>横がみどりになればok→</span><meter id="rc-st" min="0" max="5000"></meter>
    <img style="height: 600px; width: 600px" id="img" src=${lists[count]}></img>
    <script>
    </script>
  `
});

function alert() {
  var alertBox = document.createElement("div");
  alertBox.id = "alertBox";
  alertBox.style.cssText = ' font-size: 46px; color: black; width: 100%; padding: 20px 0; text-align: center; position: fixed; top: 0px; left: 0px; ';
  alertBox.textContent = 'PUSH or PULL!';
  document.body.appendChild(alertBox);
  function removeMsg() {
    var alertBox = document.getElementById("alertBox");
    var body = document.getElementsByTagName("body")[0];
    body.removeChild(alertBox);
  }
  setTimeout(() => removeMsg(), 1000);
}

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
    document.getElementById("img").remove();
    const app = document.getElementById("app");
    app.innerHTML += `
    <h1>ゲーム終了</h1>
    `
    clearInterval(a);
    clearInterval(b);
    gameflag = false;
  }
  let strain = document.querySelector('#rc-st').value;
  if (strain > 3200 && flag === true) {
    count += 1
    flag = false;
    document.getElementById("img").setAttribute("src", lists[count]);
    console.log("Push!");
  } else if (10 < strain && strain < 600 && flag == true) {
    count += 1
    flag = false;
    document.getElementById("img").setAttribute("src", lists[count]);
    console.log("Pull!");
  }
}, 100)
