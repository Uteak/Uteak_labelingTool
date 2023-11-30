const result = document.getElementById('result');

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let boundingBox = null;

const imagepageX = imageContainer.getBoundingClientRect().left;
const imagepageY = imageContainer.getBoundingClientRect().top;

let currentWidth = 0;
let currentHeight = 0;
let currentleft = 0;
let currenttop = 0;

let boundingBoxInfo = { left: 0, top: 0, width: 0, height: 0 }; 
let boundingBoxebuffer = {}; 
let boxId = 0; 

for (let i = 0; i < imageCount; i++) {
  boundingBoxebuffer[i] = {}; // someValue는 해당 키에 할당하고 싶은 값입니다.
}

//drawingInit(currentSlide);

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
      displayAllBoundingBoxesInfo(); 

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

  document.getElementById('mouseRight').textContent = `X: ${currentX}, Y: ${currentY}`;
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

function saveBoundingBox(saveSlide){
  
    let leftValue = parseFloat(boundingBox.style.left);
    let topValue = parseFloat(boundingBox.style.top);
    let widthValue = parseFloat(boundingBox.style.width);
    let heightValue = parseFloat(boundingBox.style.height);

    fetch('/fileupload/image_slider/', {
      method: 'POST',
      headers: {
          'X-CSRFToken': getCookie('csrftoken'), // CSRF 토큰
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        boxinfo : boundingBoxebuffer[saveSlide],
        imageName : imagenameList[saveSlide],
        currentSlide : saveSlide
      })
  });


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

function drawingInit(currentSlide){
  const infoText = "";
  const text = boxInfoList[currentSlide];
  document.getElementById('BoxesInfo').textContent = text;
  // for(let textContent of boxInfoList[currentSlide]){
  //   infoText += textContent + "\n";
  // }

  const lines = text.split('\n').map(line => {
    return line.split(' ').map(Number);
  });

  // 각 숫자 배열을 좌표 객체로 변환
  const formattedData = lines.map(coords => ({
    x1: coords[0],
    y1: coords[1],
    x2: coords[2],
    y2: coords[3]
  }));

  for(let textContent of formattedData){
    infoText += textContent + "\n";
  }
  document.getElementById('BoxesInfo').textContent = infoText;
}