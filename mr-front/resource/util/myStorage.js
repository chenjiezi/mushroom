var _ms = {
  set: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get: function (key) {
    var json = localStorage.getItem(key);
    return JSON.parse(json);
  }
}