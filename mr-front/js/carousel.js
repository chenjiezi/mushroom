var items = document.getElementsByClassName('carousel-item');
var points = document.getElementsByClassName('point');
var goPreBtn = document.getElementById('goPre');
var goNextBtn = document.getElementById('goNext');

var timeId = null;

var index = 0;

var clearActive = function () {
    for (i = 0; i < items.length; i++) {
        items[i].className = 'carousel-item';
        points[i].className = 'point';
    }
}

var goIndex = function () {
    clearActive();
    autoCarousel();
    points[index].className = 'point active';
    items[index].className = 'carousel-item active';
}

var goNext = function () {
    if (index < 4) {
        index++;
    } else {
        index = 0;
    }
    goIndex();
}

var goPre = function () {
    if (index == 0) {
        index = 4;
    } else {
        index--;
    }
    goIndex();
}

var autoCarousel = function () {
    clearInterval(timeId);
    timeId = setInterval(function () {
        goNext();
    }, 2500)
}

goNextBtn.addEventListener('click', function () {
    goNext();
})

goPreBtn.addEventListener('click', function () {
    goPre();
})

for (var i = 0; i < points.length; i++) {
    points[i].addEventListener('click', function () {
        var pointIndex = this.getAttribute('data-index');
        index = pointIndex;
        goIndex();
    })
}

autoCarousel();