//const result = document.getElementById('result');

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let boundingBox = null;



let currentIndex = 0;
let currentColor = labelListbuffer[currentIndex];
//let labelListbuffer = {};

let currentWidth = 0;
let currentHeight = 0;
let currentleft = 0;
let currenttop = 0;


let boundingBoxInfo = { left: 0, top: 0, width: 0, height: 0 }; 
let boxId = 0; 
let labelindex = 0;
let isDrawingInitCalled = false;



drawingInit();

imageContainer.addEventListener('mousedown', (event) => {

  if (event.button === 0){
    isDragging = true;
    dragStartX = event.pageX - imagepageX;
    dragStartY = event.pageY - imagepageY;
    boundingBox = document.createElement('div');
    boundingBox.className = 'bounding-box';
    boundingBox.style.position = 'absolute';
    const boxsize = BoxsizeControl.value + 'px';
    boundingBox.style.border = `${boxsize} solid` + currentColor;
    imageContainer.appendChild(boundingBox);
  }
});

imageContainer.addEventListener('mousemove', (event) => {
  if (isDragging && event.button === 0) {
    const currentX = event.pageX - imagepageX;
    const currentY = event.pageY - imagepageY;

    currentleft = Math.min(dragStartX, currentX).toFixed(2)
    currentWtop = Math.min(dragStartY, currentY).toFixed(2)
    currentWidth = Math.abs(currentX - dragStartX);
    currentHeight = Math.abs(currentY - dragStartY);

    // toFixed() 메소드를 사용하여 소수점 두 자리까지 표시
    boundingBox.style.left = currentleft + 'px';
    boundingBox.style.top = currentWtop + 'px';
    boundingBox.style.width = currentWidth + 'px';
    boundingBox.style.height = currentHeight + 'px';

  }
});

imageContainer.addEventListener('mouseup', (event) => {
  if (isDragging) {
    isDragging = false;
    // 여기에서 바운딩 박스에 대한 추가 처리를 할 수 있습니다.

    if (event.button === 0 && currentWidth * currentHeight < 112){
      boundingBox.remove();     
    }

    if (!boundingBox.style.left){
      boundingBox.remove();
    }

    else if (event.button === 0 && currentWidth * currentHeight > 112){

      boundingBoxInfo = {
        left: boundingBox.style.left,
        top: boundingBox.style.top,
        width: boundingBox.style.width,
        height: boundingBox.style.height
      };
  

      boundingBoxebuffer[currentSlide][boxId] = {
        labelindex : currentIndex,
        left: boundingBox.style.left,
        top: boundingBox.style.top,
        width: boundingBox.style.width,
        height: boundingBox.style.height
      }
      
      actionStack.push(
        [
          "create", 
          boxId
        ])
      boundingBox.setAttribute('data-box-id', boxId);      
      boxId++;      
      
    }
    
  }
});

imageContainer.addEventListener('contextmenu', (event) => {
  event.preventDefault();

  const currentX = event.pageX - imagepageX;
  const currentY = event.pageY - imagepageY;
  const boxes = imageContainer.querySelectorAll('.bounding-box');

  let smallestBox = null;
  let smallestArea = Number.MAX_VALUE; // 초기 값은 가장 큰값으로

  boxes.forEach(box => {
    const boxLeft = parseInt(box.style.left, 10);
    const boxTop = parseInt(box.style.top, 10);
    const boxWidth = parseInt(box.style.width, 10);
    const boxHeight = parseInt(box.style.height, 10);
    const boxArea = boxWidth * boxHeight;
    const boxRight = boxLeft + boxWidth;
    const boxBottom = boxTop + boxHeight;

    if (boxLeft <= currentX && currentX <= boxRight && boxTop <= currentY && currentY <= boxBottom) {
      if (boxArea < smallestArea) {
        smallestBox = box;
        smallestArea = boxArea;
      }
    }
  });

  if (smallestBox) {
    const boxIdToRemove = parseInt(smallestBox.getAttribute('data-box-id'));
    
    // 삭제시 박스 인포 저장
    actionStack.push(
      [
        'remove', 
        boxIdToRemove, 
        boundingBoxebuffer[currentSlide][boxIdToRemove].labelindex,
        boundingBoxebuffer[currentSlide][boxIdToRemove].left,
        boundingBoxebuffer[currentSlide][boxIdToRemove].top,
        boundingBoxebuffer[currentSlide][boxIdToRemove].width,
        boundingBoxebuffer[currentSlide][boxIdToRemove].height,
    ])

    delete boundingBoxebuffer[currentSlide][boxIdToRemove];
    smallestBox.remove();
  }
});

BoxsizeControl.addEventListener("input", function() {
    removeSpecificBoundingBoxes();
    drawingBoundingBox(currentSlide);
    boxsizeValueSpan.textContent = BoxsizeControl.value;
})


// 박스 정보를 데이터 베이스에서 불러와 초기화해주는 함수 

function drawingInit(){

  if (isDrawingInitCalled) {
    return; // 이미 호출되었으면 함수 실행을 중단
  }

  let drawingtext = "";
  let boxinfoText = "";
  for (let index in boxInfoList) {

    boxinfoText += index + " : "  +  '\n';
    boxinfoText += boxInfoList[index] +  '\n';
    drawingtext = boxInfoList[index];

    const lines = drawingtext.split('\n').map(line => {
      return line.split(' ').map(Number);
    });

    const formattedData = lines.slice(0, -1).map(coords => ({
      index : coords[0],
      x1: coords[1],
      y1: coords[2],
      x2: coords[3],
      y2: coords[4]
    }));

    let infoText = ""; // infoText 변수 초기화
    for (let textContent of formattedData) {
      
      if (!textContent){
        continue;
      }
      const labelnum = textContent["index"];
      const width = Math.round(textContent["x2"] * imagepageWidth);
      const height = Math.round(textContent["y2"] * imagepageHeight);
      const left = Math.round(imagepageWidth * textContent["x1"]) - Math.round(width * 0.5);
      const top = Math.round(imagepageHeight * textContent["y1"]) - Math.round(height * 0.5);
      infoText += `left: ${left}, top: ${top}, width: ${width}, height: ${height}\n`; // 각 객체의 데이터를 문자열로 변환하고 줄 바꿈 추가

      boundingBoxebuffer[index][boxId] = {
        labelindex : labelnum,
        left: left + 'px',
        top: top + 'px',
        width: width + 'px',
        height: height + 'px',
      }
      boxId ++;
    }
  }

  drawingBoundingBox(0);
  isDrawingInitCalled = true;
}