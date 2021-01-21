import axios from "axios";

const url = "http://localhost:9090/stage/aom";
const dataArray = new Int32Array([0, 1, 2, 3, 4]);
// const data = Buffer.from(dataArray);
axios.post(url, dataArray.buffer, {
  header: "application/x-www-form-urlencoded",
});
