let currentIndex = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function nextSlide() {
  if (currentIndex === totalSlides - 1) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }
  updateSlidePosition();
}

function updateSlidePosition() {
  for (let slide of slides) {
    slide.style.transform = `translateX(-${currentIndex * 100}%)`;
  }
}

setInterval(nextSlide, 3000); // 3초마다 슬라이드 자동 전환