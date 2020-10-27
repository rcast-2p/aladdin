const socket = new WebSocket("ws://0.0.0.0:8072");
socket.binaryType = "arraybuffer";
// 接続が開いたときのイベント
let canvas = {};
let ctx = {};
let width = 20;
let height = 20;
let count = 0;
let pos = [0, 0, 1, 1];
socket.addEventListener("open", () => {
  socket.send("Hello Server!");
});
let plusImageData = new ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1);

// メッセージの待ち受け
socket.addEventListener("message", (event) => {
  const view = new DataView(event.data, 4 * height * width, 4);
  const maximum = view.getUint16(0);
  const minimum = view.getUint16(1);
  const arr = new Uint8ClampedArray(event.data, 0, 4 * height * width);
  plusImageData = new ImageData(arr, width);

  const imgData = ctx.getImageData(...pos);
  const imgDataSize = imgData.data.length;
  let sum = 0;
  for (let iI = 0; iI < imgDataSize; iI += 4) {
    sum += imgData.data[iI];
  }
  const average = (4 * sum) / imgDataSize;
  postMessage({ maximum, minimum, average });
});

function step() {
  ctx.putImageData(plusImageData, 0, 0);
  requestAnimationFrame(step);
}

// eslint-disable-next-line
self.addEventListener("message", (event) => {
  if (count === 0) {
    canvas = event.data.canvas;
    width = event.data.width;
    height = event.data.height;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    requestAnimationFrame(step);
  } else {
    pos = event.data;
  }
  count += 1;
});
