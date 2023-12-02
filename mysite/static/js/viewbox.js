const result = document.getElementById('result');

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let boundingBox = null;

const imagepageWidth = imageContainer.getBoundingClientRect().width;
const imagepageHeight = imageContainer.getBoundingClientRect().height;
const imagepageX = imageContainer.getBoundingClientRect().left;
const imagepageY = imageContainer.getBoundingClientRect().top;

let currentWidth = 0;
let currentHeight = 0;
let currentleft = 0;
let currenttop = 0;

let boundingBoxInfo = { left: 0, top: 0, width: 0, height: 0 }; 
let boxId = 0; 
let isDrawingInitCalled = false;
// let boundingBoxebuffer = {}; 

// for (let i = 0; i < imageCount; i++) {
//   boundingBoxebuffer[i] = {}; // someValue는 해당 키에 할당하고 싶은 값입니다.
// }

drawingInit();
//drawingBoundingBox(0);

imageContainer.addEventListener('mousedown', (event) => {

  if (event.button === 0){
    isDragging = true;
    dragStartX = event.pageX - imagepageX;
    dragStartY = event.pageY - imagepageY;
    boundingBox = document.createElement('div');
    boundingBox.className = 'bounding-box';
    boundingBox.style.position = 'absolute';
    boundingBox.style.border = '1px solid red';
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

    document.getElementById('mouseCoordinates').textContent = `X: ${currentleft}, Y: ${currentWtop}`;
    document.getElementById('mouseCoordinatesXY').textContent = `X: ${currentWidth}, Y: ${currentHeight}`;

  }
});

imageContainer.addEventListener('mouseup', (event) => {
  if (isDragging) {
    isDragging = false;
    // 여기에서 바운딩 박스에 대한 추가 처리를 할 수 있습니다.
    
    document.getElementById('mouseCoordinatesPage').textContent = `X * Y: ${currentWidth * currentHeight}`;
    if (event.button === 0 && currentWidth * currentHeight < 112){
      boundingBox.remove();     
    }

    if (!boundingBox.style.left){
      document.getElementById('mouseCoordinatesPage').textContent = `error: error`;
      boundingBox.remove();
    }

    else if (event.button === 0 && currentWidth * currentHeight > 112){

      boundingBoxInfo = {
        left: boundingBox.style.left,
        top: boundingBox.style.top,
        width: boundingBox.style.width,
        height: boundingBox.style.height
      };
  
      // 저장된 바운딩 박스 정보 출력
      displayBoundingBoxInfo(boundingBoxInfo);
      //displayAllBoundingBoxesInfo(); 
      //drawingInit(); 

      boundingBoxebuffer[currentSlide][boxId] = {
        left: boundingBox.style.left,
        top: boundingBox.style.top,
        width: boundingBox.style.width,
        height: boundingBox.style.height
      }
      // boundingBoxebuffer[currentSlide][boxId].push({
      //   left: boundingBox.style.left,
      //   top: boundingBox.style.top,
      //   width: boundingBox.style.width,
      //   height: boundingBox.style.height
      // });
      
      boundingBox.setAttribute('data-box-id', boxId);      
      boxId++;      
      
    }
    
  }
});

imageContainer.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  // 저장된 모든 바운딩 박스 정보 출력
  displayAllBoundingBoxesInfo();
  const currentX = event.pageX - imagepageX;
  const currentY = event.pageY - imagepageY;

  //document.getElementById('mouseRight').textContent = `X: ${currentX}, Y: ${currentY}`;
  const boxes = imageContainer.querySelectorAll('.bounding-box');
  boxes.forEach(box => {
    const boxLeft = parseInt(box.style.left, 10);
    const boxTop = parseInt(box.style.top, 10);
    const boxRight = boxLeft + parseInt(box.style.width, 10);
    const boxBottom = boxTop + parseInt(box.style.height, 10);

    // 현재 마우스 위치가 박스 내부인지 확인
    if (boxLeft <= currentX && currentX <= boxRight && boxTop <= currentY && currentY <= boxBottom) {
      const boxIdToRemove = parseInt(box.getAttribute('data-box-id'));
      delete boundingBoxebuffer[currentSlide][boxIdToRemove];
      //boundingBoxes[currentSlide] = boundingBoxes[currentSlide].filter(b => b.id !== boxIdToRemove);
      document.getElementById('mouseCoordinatesPage').textContent = `currentSlide: ${currentSlide}, boxidtoRemove: ${boxIdToRemove}`;
      box.remove();
    }
  });

});

// 모든 바운딩 박스 정보를 화면에 표시하는 함수
function displayAllBoundingBoxesInfo() {
  let infoText = ""
  for(let boxid in boundingBoxebuffer[currentSlide]){
      const left = boundingBoxebuffer[currentSlide][boxid].left
      const top  = boundingBoxebuffer[currentSlide][boxid].top
      const width = boundingBoxebuffer[currentSlide][boxid].width
      const height = boundingBoxebuffer[currentSlide][boxid].height
      infoText += "boxid : " + boxid + "  width : " + width +  "  height : " + height + "  left : " + left + "  top : " + top + "\n";
  }

  // let infoText = boundingBoxebuffer[currentSlide].map((boxid, index) => 
  //   `Box ${index + 1}: id: ${boxid}, Left: ${boundingBoxebuffer[currentSlide][boxid].left}, Top: ${boundingBoxebuffer[currentSlide][boxid].top}, 
  //   Width: ${boundingBoxebuffer[currentSlide][boxid].width}, Height: ${boundingBoxebuffer[currentSlide][boxid].height}`).join('\n');

  document.getElementById('boundingBoxesInfo').textContent = infoText;
}
// 바운딩 박스 정보를 화면에 표시하는 함수
function displayBoundingBoxInfo(info) {
  document.getElementById('boundingBoxInfo').textContent = `Left: ${info.left}, Top: ${info.top}, Width: ${info.width}, Height: ${info.height}`;
}



function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function drawingInit(){

  if (isDrawingInitCalled) {
    return; // 이미 호출되었으면 함수 실행을 중단
  }

  let drawingtext = "";
  let boxinfoText = "";
  for (let index in boxInfoList) {

    // drawingtext += index + '\n';
    // if (!boxInfoList[index]){
    //   drawingtext += "none" + '\n';
    // }
    // else{
    //   drawingtext += boxInfoList[index];
    // }

    boxinfoText += index + " : "  +  '\n';
    boxinfoText += boxInfoList[index] +  '\n';
    drawingtext = boxInfoList[index];

    const lines = drawingtext.split('\n').map(line => {
      return line.split(' ').map(Number);
    });

    const formattedData = lines.slice(0, -1).map(coords => ({
      x1: coords[0],
      y1: coords[1],
      x2: coords[2],
      y2: coords[3]
    }));

    let infoText = ""; // infoText 변수 초기화
    for (let textContent of formattedData) {
      
      console.log(textContent);
      if (!textContent){
        console.log("None None None");
        continue;
      }
      const width = Math.round(textContent["x2"] * imagepageWidth);
      const height = Math.round(textContent["y2"] * imagepageHeight);
      const left = Math.round(imagepageWidth * textContent["x1"]) - Math.round(width * 0.5);
      const top = Math.round(imagepageHeight * textContent["y1"]) - Math.round(height * 0.5);
      infoText += `left: ${left}, top: ${top}, width: ${width}, height: ${height}\n`; // 각 객체의 데이터를 문자열로 변환하고 줄 바꿈 추가

      boundingBoxebuffer[index][boxId] = {
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
  //document.getElementById('BoxesInfo').textContent = boxinfoText;
  // const text = boxInfoList[currentSlide];

  // const lines = text.split('\n').map(line => {
  //   return line.split(' ').map(Number);
  // });

  // 각 숫자 배열을 좌표 객체로 변환
  // const formattedData = lines.slice(0, -1).map(coords => ({
  //   x1: coords[0],
  //   y1: coords[1],
  //   x2: coords[2],
  //   y2: coords[3]
  // }));

  // let infoText = ""; // infoText 변수 초기화
  // for (let textContent of formattedData) {
  //   const width = Math.round(textContent["x2"] * imagepageWidth);
  //   const height = Math.round(textContent["y2"] * imagepageHeight);
  //   const left = Math.round(imagepageWidth * textContent["x1"]) - Math.round(width * 0.5);
  //   const top = Math.round(imagepageHeight * textContent["y1"]) - Math.round(height * 0.5);
  //   infoText += `left: ${left}, top: ${top}, width: ${width}, height: ${height}\n`; // 각 객체의 데이터를 문자열로 변환하고 줄 바꿈 추가
  // }

  // document.getElementById('BoxesInfo').textContent = infoText;
}