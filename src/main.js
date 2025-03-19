import {
  connectJoyCon,
  connectedJoyCons,
  JoyConLeft,
  JoyConRight,
  GeneralController,
} from 'joy-con-webhid';

const connectButton = document.querySelector('#connect-joy-cons');
const connectButtonRingCon = document.querySelector('#connect-ring-con');

document.addEventListener('DOMContentLoaded', () => {
  connectButton.addEventListener('click', connectJoyCon);
});

const visualize = (joyCon, packet) => {
  if (!packet || !packet.actualOrientation) {
    return;
  }
  const {
    ringCon: ringCon,
  } = packet;
  if (joyCon instanceof JoyConRight || joyCon instanceof GeneralController) {
    document.querySelector('#rc-st').value = ringCon.strain;
    //console.log(ringCon.strain);
    window.postMessage({ message: ringCon.strain }, "*");
  }
}

setInterval(async () => {
  for (const joyCon of connectedJoyCons.values()) {
    await joyCon.enableVibration();
    if (joyCon.eventListenerAttached) {
      continue;
    }
    joyCon.eventListenerAttached = true;
    joyCon.addEventListener('hidinput', (event) => {
      visualize(joyCon, event.detail);
    });

    await joyCon.enableRingCon();
  }
}, 2000);

window.addEventListener('message', (event) => {
  //console.log(event);
  if (event.data.message != null) {
    //console.log(event.data.message);
  }
})
