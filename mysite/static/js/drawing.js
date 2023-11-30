let canvas = document.getElementById('myprofileFormDiv');
let ctx = canvas.getContext('2d');
let rect = {};
let drag = false;

function init() {
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);
}

function mouseDown(e) {
    rect.startX = e.pageX - this.offsetLeft;
    rect.startY = e.pageY - this.offsetTop;
    drag = true;
}

function mouseUp() { drag = false; }

function mouseMove(e) {
    if (drag) {
        rect.w = (e.pageX - this.offsetLeft) - rect.startX;
        rect.h = (e.pageY - this.offsetTop) - rect.startY ;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
    }
}

function draw() {
    ctx.strokeStyle = 'red';
    ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
}

//이미지가 로드되면 캔버스 초기화
window.onload = function() {
    let img = document.getElementById('image');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.style.top = img.offsetTop + 'px';
    canvas.style.left = img.offsetLeft + 'px';
    
    init();
};


// var canvas = document.getElementById('myCanvas');
// var ctx = canvas.getContext('2d');
// var painting = document.getElementById('myCanvas');
// var paintStyle = getComputedStyle(painting);
// canvas.width = parseInt(paintStyle.getPropertyValue('width'));
// canvas.height = parseInt(paintStyle.getPropertyValue('height'));

// var mouse = {x: 0, y: 0};

// canvas.addEventListener('mousemove', function(e) {
//     mouse.x = e.pageX - this.offsetLeft;
//     mouse.y = e.pageY - this.offsetTop;
// }, false);

// ctx.lineWidth = 3;
// ctx.lineJoin = 'round';
// ctx.lineCap = 'round';
// ctx.strokeStyle = '#00CC99';

// canvas.addEventListener('mousedown', function(e) {
//     ctx.beginPath();
//     ctx.moveTo(mouse.x, mouse.y);

//     canvas.addEventListener('mousemove', onPaint, false);
// }, false);

// canvas.addEventListener('mouseup', function() {
//     canvas.removeEventListener('mousemove', onPaint, false);
// }, false);

// var onPaint = function() {
//     ctx.lineTo(mouse.x, mouse.y);
//     ctx.stroke();
// };


// var rectBBox = document.querySelector("rect_1");
// var rectBoundingClientRect = document.querySelector("rect_2");
// var groupElement = document.querySelector("group_text_1");

// var bboxGroup = groupElement.getBBox();
// rectBBox.setAttribute("x", bboxGroup.x);
// rectBBox.setAttribute("y", bboxGroup.y);
// rectBBox.setAttribute("width", bboxGroup.width);
// rectBBox.setAttribute("height", bboxGroup.height);

// var boundingClientRectGroup = groupElement.getBoundingClientRect();
// rectBoundingClientRect.setAttribute("x", boundingClientRectGroup.x);
// rectBoundingClientRect.setAttribute("y", boundingClientRectGroup.y);
// rectBoundingClientRect.setAttribute("width", boundingClientRectGroup.width);
// rectBoundingClientRect.setAttribute("height", boundingClientRectGroup.height);