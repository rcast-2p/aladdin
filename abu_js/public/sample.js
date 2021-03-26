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
let yBegin1 = 0;
let yBegin2 = 0;
let terminated = false;
socket.addEventListener("open", () => {
  socket.send("Hello Server!");
});
// why this initialization?
let plusImageData1 = new ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1);
let plusImageData2 = new ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1);
let colormap = [];
let zIndex = 0;
const headerSize = 12;
// メッセージの待ち受け
socket.addEventListener("message", (event) => {
  const view = new DataView(event.data, 0, headerSize);
  yBegin1 = view.getInt16(0, true); // 0 offset (byte)
  const yEnd1 = view.getInt16(2, true);
  yBegin2 = view.getInt16(4, true);
  const yEnd2 = view.getInt16(6, true);
  zIndex = view.getInt32(8, true);
  if (zIndex === -1) {
    postMessage("end");
    terminated = true;
    return;
  }
  const sentDataSize1 = width * (yEnd1 - yBegin1);
  const sentDataSize2 = width * (yEnd2 - yBegin2);
  if (sentDataSize1 === 0 && sentDataSize2 === 0) {
    return;
  }
  const vpView1 = new Uint16Array(event.data, headerSize, sentDataSize1);
  const vpView2 = new Uint16Array(
    event.data,
    2 * sentDataSize1 + headerSize,
    sentDataSize2
  );
  const voltageView = new Uint16Array(voltageBuffer);
  const rgba = new Uint32Array(imgBuffer);
  if (yBegin1 === 0 && sentDataSize1 > 0) {
    volMin = 65537;
    volMax = 0;
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
  const arr1 = new Uint8ClampedArray(
    imgBuffer,
    4 * width * yBegin1,
    4 * sentDataSize1
  );
  plusImageData1 = new ImageData(arr1, width);
  if (yBegin2 !== -1 && sentDataSize2 > 0) {
    volMin = 65537;
    volMax = 0;
    for (let pI = 0; pI < sentDataSize2; pI += 1) {
      voltageView[pI + width * yBegin2] = vpView2[pI];
      rgba[pI + width * yBegin2] =
        colormap[clamp256(vpView2[pI], maximum, minimum)];
      if (vpView2[pI] < volMin) {
        volMin = vpView2[pI];
      }
      if (vpView2[pI] > volMax) {
        volMax = vpView2[pI];
      }
    }

    const arr2 = new Uint8ClampedArray(
      imgBuffer,
      4 * width * yBegin2,
      4 * sentDataSize2
    );
    plusImageData2 = new ImageData(arr2, width);
  }

  let sum = 0;
  const [sx, sy, sw, sh] = pos;
  for (let y = sy; y < sy + sh; y += 1) {
    for (let x = sx; x < sx + sw; x += 1) {
      sum += voltageView[y * width + x];
    }
  }
  const average = sum / (sw * sh);
  postMessage({ volMax, volMin, average, zIndex });
});

function step() {
  if (terminated) {
    return;
  }
  if (plusImageData1.height === height) {
    ctx.putImageData(plusImageData1, 0, 0);
  } else {
    ctx.putImageData(plusImageData1, 0, yBegin1);
  }
  if (yBegin2 > -1) {
    ctx.putImageData(plusImageData2, 0, yBegin2);
  }
  requestAnimationFrame(step);
}

// eslint-disable-next-line
self.addEventListener("message", (event) => {
  if (count === 0) {
    canvas = event.data.canvas;
    width = event.data.width;
    height = event.data.height;
    colormap = new Uint32Array(new Uint8Array(event.data.colormap).buffer);
    minimum = event.data.minimum;
    maximum = event.data.maximum;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    requestAnimationFrame(step);
    voltageBuffer = new ArrayBuffer(width * height * 2);
    imgBuffer = new ArrayBuffer(width * height * 4);
  } else if (event.data.maximum) {
    maximum = event.data.maximum;
    minimum = event.data.minimum;
    const imageArea = height * width;
    const voltageView = new Uint16Array(voltageBuffer);
    const rgba = new Uint32Array(imgBuffer);
    for (let pI = 0; pI < imageArea; pI += 1) {
      rgba[pI] = colormap[clamp256(voltageView[pI], maximum, minimum)];
    }
    const arr = new Uint8ClampedArray(imgBuffer, 0, 4 * height * width);
    plusImageData1 = new ImageData(arr, width);
    if (terminated) {
      ctx.putImageData(plusImageData1, 0, yBegin1);
    }
  } else {
    pos = event.data;
  }
  count += 1;
});
