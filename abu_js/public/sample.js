const socket = new WebSocket("ws://0.0.0.0:8072");
socket.binaryType = "arraybuffer";
// 接続が開いたときのイベント
let canvas = {};
let ctx = {};
let width = 20;
socket.addEventListener("open", () => {
  socket.send("Hello Server!");
});
let plusImageData = new ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1);

// メッセージの待ち受け
socket.addEventListener("message", (event) => {
  const arr = new Uint8ClampedArray(event.data);
  plusImageData = new ImageData(arr, width);
});

function step() {
  ctx.putImageData(plusImageData, 0, 0);
  requestAnimationFrame(step);
}

self.addEventListener("message", (event) => {
  console.log(event);
  canvas = event.data.canvas;
  width = event.data.width;
  console.log(width);
  ctx = canvas.getContext("2d");
  requestAnimationFrame(step);
});
