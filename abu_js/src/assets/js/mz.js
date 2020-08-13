export default class mz {
  static ur(path) {
    if (document.domain === "localhost" && location.port != 8101) {
      return `http:/` + `/localhost:8101/tms/${path}`;
    } else {
      return `../${path}`;
    }
  }
  static copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  static diff(obj0, obj1) {
    let diff = [];
    let larger_index = 0;
    if (obj0.length < obj1.length) {
      diff = obj1.filter(
        (itemA) =>
          // 配列Bに存在しない要素が返る
          obj0.indexOf(itemA) == -1
      );
      larger_index = 1;
    } else {
      diff = obj0.filter(
        (itemA) =>
          // 配列Bに存在しない要素が返る
          obj1.indexOf(itemA) == -1
      );
    }
    return { index: larger_index, diff: diff };
  }

  static getSplitter(str) {
    let splitter = ",";
    if (str.indexOf("\t") > -1) {
      splitter = "\t";
    } else if (str.indexOf(", ") > -1) {
      splitter = ", ";
    }
    return splitter;
  }
}
