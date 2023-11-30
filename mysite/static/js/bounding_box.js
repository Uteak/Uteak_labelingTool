let imageContainer = document.getElementById('image');
const result = document.getElementById('result');

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let boundingBox = null;
const imagepageX = imageContainer.getBoundingClientRect().left;
const imagepageY = imageContainer.getBoundingClientRect().top;

let boundingBoxInfo = { left: 0, top: 0, width: 0, height: 0 }; 
let boundingBoxes = []; // 모든 바운딩 박스 정보를 저장할 리스트

imageContainer.addEventListener('mousedown', (event) => {
  isDragging = true;
  dragStartX = event.pageX - imagepageX;
  dragStartY = event.pageY - imagepageY;
  boundingBox = document.createElement('div');
  boundingBox.style.position = 'absolute';
  boundingBox.style.border = '1px dashed red';
  imageContainer.appendChild(boundingBox);
});

imageContainer.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const currentX = event.pageX - imagepageX
    const currentY = event.pageY - imagepageY


    boundingBox.style.left = Math.min(dragStartX, currentX)  +'px';
    boundingBox.style.top = Math.min(dragStartY, currentY) + 'px';
    boundingBox.style.width = Math.abs(currentX - dragStartX) + 'px';
    boundingBox.style.height = Math.abs(currentY - dragStartY) + 'px';

    document.getElementById('mouseCoordinates').textContent = `X: ${currentX}, Y: ${currentY}`;
    document.getElementById('mouseCoordinatesXY').textContent = `X: ${dragStartX}, Y: ${dragStartY}`;
    document.getElementById('mouseCoordinatesPage').textContent = `X: ${imagepageX}, Y: ${imagepageY}`;
    document.getElementById('Page').textContent = `X: ${imagepageX}, Y: ${imagepageY}`;
  }
});

imageContainer.addEventListener('mouseup', (event) => {
  if (isDragging) {
    isDragging = false;
    // 여기에서 바운딩 박스에 대한 추가 처리를 할 수 있습니다.

    boundingBoxInfo = {
      left: boundingBox.style.left,
      top: boundingBox.style.top,
      width: boundingBox.style.width,
      height: boundingBox.style.height
    };

    // 저장된 바운딩 박스 정보 출력
    displayBoundingBoxInfo(boundingBoxInfo);

    // 현재 바운딩 박스의 정보를 리스트에 추가
    boundingBoxes.push({
      left: boundingBox.style.left,
      top: boundingBox.style.top,
      width: boundingBox.style.width,
      height: boundingBox.style.height
    });

    // 저장된 모든 바운딩 박스 정보 출력
    displayAllBoundingBoxesInfo();
  }
});

// 모든 바운딩 박스 정보를 화면에 표시하는 함수
function displayAllBoundingBoxesInfo() {
  let infoText = boundingBoxes.map((box, index) => 
    `Box ${index + 1}: Left: ${box.left}, Top: ${box.top}, Width: ${box.width}, Height: ${box.height}`).join('\n');
  document.getElementById('boundingBoxesInfo').textContent = infoText;
}
// 바운딩 박스 정보를 화면에 표시하는 함수
function displayBoundingBoxInfo(info) {
  document.getElementById('boundingBoxInfo').textContent = `Left: ${info.left}, Top: ${info.top}, Width: ${info.width}, Height: ${info.height}`;
}
// document.addEventListener('DOMContentLoaded', function () {
//     var imageContainer = document.getElementById('myprofileFormDiv');
//     var startX, startY, endX, endY;
//     var rect;

//     imageContainer.onmousedown = function (e) {
//         startX = e.offsetX;
//         startY = e.offsetY;
//         rect = document.createElement('div');
//         rect.style.position = 'absolute';
//         rect.style.border = '2px solid red';
//         imageContainer.appendChild(rect);
//     };

//     imageContainer.onmousemove = function (e) {
//         if (!rect) return;
//         endX = e.offsetX;
//         endY = e.offsetY;
//         var width = Math.abs(endX - startX);
//         var height = Math.abs(endY - startY);
//         rect.style.left = (endX > startX ? startX : endX) + 'px';
//         rect.style.top = (endY > startY ? startY : endY) + 'px';
//         rect.style.width = width + 'px';
//         rect.style.height = height + 'px';
//     };

//     imageContainer.onmouseup = function () {
//         rect = null;
//     };
// });