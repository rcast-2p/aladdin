function clamp256(val, max, min) {
  if (val > max) {
    return 255;
  }
  if (val < min) {
    return 0;
  }
  return Math.floor(((val - min) * 255) / (max - min));
}
const socket = new WebSocket("ws://0.0.0.0:8072");
socket.binaryType = "arraybuffer";
// 接続が開いたときのイベント
let canvas = {};
let ctx = {};
let width = 20;
let height = 20;
let minimum = 0;
let maximum = 65535;
let count = 0;
let pos = [0, 0, 1, 1];
let imgBuffer;
let voltageBuffer;
let volMin = 65537;
let volMax = 0;
socket.addEventListener("open", () => {
  socket.send("Hello Server!");
});
let plusImageData = new ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1);
let colormap = [];
// メッセージの待ち受け
socket.addEventListener("message", (event) => {
  const view = new DataView(event.data, 0, 8);
  const yBegin1 = view.getInt16(0, true);
  const yEnd1 = view.getInt16(2, true);
  const yBegin2 = view.getInt16(4, true);
  const yEnd2 = view.getInt16(6, true);
  const sentDataSize1 = width * (yEnd1 - yBegin1);
  const sentDataSize2 = width * (yEnd2 - yBegin2);
  const vpView1 = new Uint16Array(event.data, 8, sentDataSize1);
  const vpView2 = new Uint16Array(event.data, sentDataSize1 + 8, sentDataSize2);
  const voltageView = new Uint16Array(voltageBuffer);
  const rgba = new Uint32Array(imgBuffer);
  if (yBegin1 === 0) {
    volMin = 65537;
    volMax = 0;
  }
  if (yBegin1 === 19) {
    console.log(19, new Uint16Array(event.data));
  }
  for (let pI = 0; pI < sentDataSize1; pI += 1) {
    voltageView[pI + width * yBegin1] = vpView1[pI];
    rgba[pI + width * yBegin1] =
      colormap[clamp256(vpView1[pI], maximum, minimum)];
    if (vpView1[pI] < volMin) {
      volMin = vpView1[pI];
    }
    if (vpView1[pI] > volMax) {
      volMax = vpView1[pI];
    }
  }
  if (yBegin2 !== -1) {
    volMin = 65537;
    volMax = 0;
    for (let pI = 0; pI < sentDataSize2; pI += 1) {
      voltageView[pI + width * yBegin2] = vpView2[pI];
      rgba[pI + width * yBegin2] =
        colormap[clamp256(vpView2[pI], maximum, minimum)];
      if (vpView1[pI] < volMin) {
        volMin = vpView1[pI];
      }
      if (vpView1[pI] > volMax) {
        volMax = vpView1[pI];
      }
    }
  }
  const arr = new Uint8ClampedArray(imgBuffer, 0, 4 * height * width);
  plusImageData = new ImageData(arr, width);
  let sum = 0;
  const [sx, sy, sw, sh] = pos;
  for (let y = sy; y < sy + sh; y += 1) {
    for (let x = sx; x < sx + sw; x += 1) {
      sum += voltageView[y * width + x];
    }
  }
  const average = sum / (sw * sh);
  postMessage({ volMax, volMin, average });
});

function step() {
  // TODO こんなに全部貼らなくていいような。
  ctx.putImageData(plusImageData, 0, 0);
  requestAnimationFrame(step);
}

// eslint-disable-next-line
self.addEventListener("message", (event) => {
  if (count === 0) {
    canvas = event.data.canvas;
    width = event.data.width;
    height = event.data.height;
    colormap = new Uint32Array(new Uint8Array(event.data.colormap).buffer);
    minimum = event.data.minimum * 64;
    maximum = event.data.maximum * 64;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    requestAnimationFrame(step);
    voltageBuffer = new ArrayBuffer(width * height * 2);
    imgBuffer = new ArrayBuffer(width * height * 4);
  } else if (event.data.maximum) {
    console.log("reflect?");
    maximum = event.data.maximum * 64;
    minimum = event.data.minimum * 64;
    const imageArea = height * width;
    const voltageView = new Uint16Array(voltageBuffer);
    const rgba = new Uint32Array(imgBuffer);
    for (let pI = 0; pI < imageArea; pI += 1) {
      rgba[pI] = colormap[clamp256(voltageView[pI], maximum, minimum)];
    }
    const arr = new Uint8ClampedArray(imgBuffer, 0, 4 * height * width);
    plusImageData = new ImageData(arr, width);
  } else {
    pos = event.data;
  }
  count += 1;
});
