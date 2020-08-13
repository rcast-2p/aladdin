const w = self;
w.addEventListener("message", async (e) => {
  console.log(e);
  w.postMessage("hello I am a sample");
});

onmessage = (e) => {
  console.log("onmessage");
  console.log(e.data);
};
export default w;
