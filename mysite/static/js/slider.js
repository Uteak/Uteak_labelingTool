let imageContainer = document.getElementById('image');
const swiper = document.querySelector('.carousel_wrapper');
const prevButtons = document.querySelectorAll('.carousel_prev');
const nextButtons = document.querySelectorAll('.carousel_next');
const bullets = document.querySelectorAll('.carousel_circle');
const imageCount = document.querySelector('.carousel_slide').dataset.imageCount;
const slides = document.querySelectorAll('.carousel_slide');

let currentSlide = 0;
let beforeSlide = 0;
let imagenameList = [];
let boxInfoList = [];
let boundingBoxebuffer = {}; 

for (let i = 0; i < imageCount; i++) {
  boundingBoxebuffer[i] = {}; // someValue는 해당 키에 할당하고 싶은 값입니다.
}

slides.forEach(slide => {
    const img = slide.querySelector('img'); // 각 슬라이드 내의 이미지 태그 찾기
    const src = img.getAttribute('src'); // 이미지의 src 속성 값 가져오기
    const description = slide.dataset.description;

    // URL에서 파일 이름 추출
    const imageName = src.split('/').pop(); // URL을 '/'로 분리하고 마지막 부분을 가져옴
    imagenameList.push(imageName);
    boxInfoList.push(description);

    //console.log(boxInfoList);

});



function showSlide(slideIndex) {
    swiper.style.transform = `translateX(-${slideIndex * 800}px)`;
    beforeSlide = currentSlide
    currentSlide = slideIndex;


    bullets.forEach((bullet, index) => {
        if (index === currentSlide) {
            bullet.classList.add('active');
        } else {
            bullet.classList.remove('active');
        }
    }); 
    document.getElementById('Page').textContent = `imagenameList: ${imagenameList[currentSlide]}`;

    displayImageInfo(currentSlide, beforeSlide);
    console.log(beforeSlide);
    saveBoundingBox(beforeSlide);

    removeSpecificBoundingBoxes();

    
    drawingBoundingBox(currentSlide)

    // let boundingBox_ = null;
    // for (let Box of boundingBoxes[currentSlide]) {
    //     boundingBox_ = document.createElement('div');
    //     boundingBox_.className = 'bounding-box';
    //     boundingBox_.style.position = 'absolute';
    //     boundingBox_.style.border = '1px solid red';
    //     boundingBox_.style.id = Box.id;
    //     //boundingBox.setAttribute('data-box-id', Box.id);
    //     boundingBox_.style.width = Box.width;
    //     boundingBox_.style.height = Box.height;
    //     boundingBox_.style.top = Box.top; // 상단으로부터의 거리
    //     boundingBox_.style.left = Box.left; // 왼쪽으로부터의 거리

    //     imageContainer.appendChild(boundingBox_);
    // }

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
        if (currentSlide < imageCount - 1) { // Adjust this number based on the number of slides
            showSlide(currentSlide + 1);
        }
    });

});

bullets.forEach((bullet, index) => {
    bullet.addEventListener('click', () => {
        showSlide(index);
    });
});

showSlide(0);

function drawingBoundingBox(currentSlide){

    let boundingBox_ = null;
    
    for(let boxid in boundingBoxebuffer[currentSlide]){
        boundingBox_ = document.createElement('div');
        boundingBox_.className = 'bounding-box';
        boundingBox_.style.position = 'absolute';
        boundingBox_.style.border = '1px solid red';
        boundingBox_.setAttribute('data-box-id', boxid);
        boundingBox_.style.left = boundingBoxebuffer[currentSlide][boxid].left
        boundingBox_.style.top  = boundingBoxebuffer[currentSlide][boxid].top
        boundingBox_.style.width = boundingBoxebuffer[currentSlide][boxid].width
        boundingBox_.style.height = boundingBoxebuffer[currentSlide][boxid].height
        imageContainer.appendChild(boundingBox_);
    };

}
function displayImageInfo(current, before) {
    document.getElementById('index').textContent = `CurrentslideIndex: ${current}, BeforeslideIndex: ${before},`;
}

function removeSpecificBoundingBoxes() {
    const boxes = imageContainer.querySelectorAll('.bounding-box');
    boxes.forEach(box => box.remove());
}

function saveBoundingBox(saveSlide){

    // console.log(saveSlide);
    // if (!boundingBoxebuffer){
    //     return;
    // }

    fetch('/labeling_tool/image_slider/', {
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