var myLocal = {
    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    get: function (key) {
        var json = localStorage.getItem(key)
        return json ? JSON.parse(json) : null
    }
}