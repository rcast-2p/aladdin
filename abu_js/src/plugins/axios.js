import axios from "axios";

export default axios.create({
  timeout: 10000,
  method: "post",
  headers: { "content-type": "application/json" },
});
