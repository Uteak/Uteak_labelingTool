let imageContainer = document.getElementById('image');
const swiper = document.querySelector('.carousel_wrapper');
const prevButtons = document.querySelectorAll('.carousel_prev');
const nextButtons = document.querySelectorAll('.carousel_next');
const bullets = document.querySelectorAll('.carousel_circle');
const imageCount = document.querySelector('.carousel_slide').dataset.imageCount;
const slides = document.querySelectorAll('.carousel_slide');
const labelButtons = document.querySelectorAll('.labelButtonList');
const BoxsizeControl = document.getElementById('boxsize');
const boxsizeValueSpan = document.getElementById("boxsizeValue");
const PageControl = document.getElementById('pageindex');

const imagepageWidth = imageContainer.getBoundingClientRect().width;
const imagepageHeight = imageContainer.getBoundingClientRect().height;
const imagepageX = imageContainer.getBoundingClientRect().left;
const imagepageY = imageContainer.getBoundingClientRect().top;

let currentSlide = 0; // 현재 선택된 이미지 인덱스
let beforeSlide = 0; // 이전 선택된 이미지 인덱스
let currentButtonIndex = 0; // 현재 선택된 라벨 버튼의 인덱스

let imagenameList = [];
let boxInfoList = [];

let boundingBoxebuffer = {}; 
let labelListbuffer = {};
let actionStack = [];

for (let i = 0; i < imageCount; i++) {
  boundingBoxebuffer[i] = {};
}

slides.forEach(slide => {
    const img = slide.querySelector('img'); // 각 슬라이드 내의 이미지 태그 찾기
    const src = img.getAttribute('src'); // 이미지의 src 속성 값 가져오기
    const description = slide.dataset.description;

    // URL에서 파일 이름 추출
    const imageName = src.split('/').pop(); // URL을 '/'로 분리하고 마지막 부분을 가져옴
    imagenameList.push(imageName);
    boxInfoList.push(description);
});

// 버튼의 상태를 초기화하고 현재 선택된 버튼 강조
function updateButtonState() {
  labelButtons.forEach((button, index) => {
    const btn = button.querySelector('button');
    btn.style.color = index === currentButtonIndex ? 'black' : 'white';
    const labelname = labelButtons[currentButtonIndex].textContent;
    document.getElementById('labellistinfo').textContent = `label index : ${currentButtonIndex}, label name : ${labelname}`;
  });
}

// 클릭 이벤트를 트리거하는 함수
function triggerClickEvent() {
  const currentButton = labelButtons[currentButtonIndex].querySelector('button');
  currentButton.click();
}

labelButtons.forEach((buttons, index) => {
    const labelcolor = buttons.querySelector('input');
    const labelbutton = buttons.querySelector('button');
    labelListbuffer[index] = labelcolor.value;

    labelbutton.addEventListener('click', function() {
      const labelname = labelbutton.textContent;
      // 버튼 클릭시 박스 드로잉 색상 변경
      currentColor = labelcolor.value;
      currentButtonIndex = index;
        
      // 버튼 클릭시 버튼 택스트 색상 변경.
      updateButtonState();
      document.getElementById('labellistinfo').textContent = `label index : ${currentButtonIndex}, label name : ${labelname}`;

    });
    
    labelcolor.addEventListener('input', function() {
      labelbutton.style.backgroundColor = labelcolor.value;
      currentColor = labelcolor.value;
      currentButtonIndex = index;
      labelListbuffer[currentButtonIndex] = currentColor;

      removeSpecificBoundingBoxes();
      drawingBoundingBox(currentSlide);
    });
})


function showSlide(slideIndex) {
    swiper.style.transform = `translateX(-${slideIndex * imagepageWidth}px)`;
    beforeSlide = currentSlide
    currentSlide = slideIndex;

    if (PageControl.value !== currentSlide){
        PageControl.value = currentSlide;
    }

    document.getElementById('Page').textContent = `imageName: ${imagenameList[currentSlide]}, CurrentSlideIndex: ${currentSlide},`;
    actionStack = []; 
    saveBoundingBox(beforeSlide);
    removeSpecificBoundingBoxes();
    drawingBoundingBox(currentSlide);

}

prevButtons.forEach((prevButton) => {
    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    });
});

nextButtons.forEach((nextButton) => {
    nextButton.addEventListener('click', () => {
        if (currentSlide < imageCount - 1) { 
            showSlide(currentSlide + 1);
        }
    });
});

bullets.forEach((bullet, index) => {
    bullet.addEventListener('click', () => {
        showSlide(index);
    });
});

PageControl.addEventListener('input', function() {
    currentSlide = parseInt(PageControl.value, 10);
    showSlide(currentSlide);
});


function drawingBoundingBox(currentSlide){

    let boundingBox_ = null;
    
    for(let boxid in boundingBoxebuffer[currentSlide]){
        boundingBox_ = document.createElement('div');
        boundingBox_.className = 'bounding-box';
        boundingBox_.style.position = 'absolute';
        const idx = boundingBoxebuffer[currentSlide][boxid].labelindex;
        color = labelListbuffer[idx];
        const boxsize = BoxsizeControl.value + 'px';
        boundingBox_.style.border = `${boxsize} solid ` + color;
        boundingBox_.setAttribute('data-box-id', boxid);
        boundingBox_.style.left = boundingBoxebuffer[currentSlide][boxid].left
        boundingBox_.style.top  = boundingBoxebuffer[currentSlide][boxid].top
        boundingBox_.style.width = boundingBoxebuffer[currentSlide][boxid].width
        boundingBox_.style.height = boundingBoxebuffer[currentSlide][boxid].height
        imageContainer.appendChild(boundingBox_);
    };

}

function removeSpecificBoundingBoxes() {
    const boxes = imageContainer.querySelectorAll('.bounding-box');
    boxes.forEach(box => box.remove());
}

function saveBoundingBox(saveSlide){

    fetch('/labeling_tool/image_slider/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'), // CSRF 토큰
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boxinfo : boundingBoxebuffer[saveSlide],
          imageName : imagenameList[saveSlide],
          imagepageWidth : imagepageWidth,
          imagepageHeight : imagepageHeight
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
