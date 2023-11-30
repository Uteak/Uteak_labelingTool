const myprofileFormDiv = document.getElementById('myprofileFormDiv');
const scrollButtongo = document.getElementById('scrollButtongo');
const scrollButtonback = document.getElementById('scrollButtonback');

const Buttongo = document.getElementById('Buttongo');
const Buttonback = document.getElementById('Buttonback');

// document.getElementById('scrollButtongo').addEventListener('click', () => {
//     document.querySelector('.img_scroll').scrollLeft -= 100;
//   });
  
// document.getElementById('scrollButtonback').addEventListener('click', () => {
//     document.querySelector('.img_scroll').scrollLeft += 100;
//   });

// function scrollImages(pageCount) {
//   document.getElementById('imageGallery').scrollByPages(pageCount);
// }
// Buttongo.addEventListener('click', () => {
//   myprofileFormDiv.scrollByPages(1);

// });

// Buttonback.addEventListener('click', () => {
//   myprofileFormDiv.scrollByPages(-1);

// });
// myprofileFormDiv.addEventListener('click', () => {
//   let leftValue = 600;
  
//   let currentScrollPosition = myprofileFormDiv.scrollLeft;

//     // 가장 가까운 600의 배수 위치를 계산합니다.
//   if (currentScrollPosition % 600 != 0){
//       let nearestMultiple = Math.round(currentScrollPosition / 600) * 600;

//     // 스크롤해야 할 거리를 계산합니다.
//       leftValue = nearestMultiple - currentScrollPosition;
//   }

//   myprofileFormDiv.scrollBy({
//     top: 0,
//     left: leftValue,
//     behavior:'instant'
//   });
// });

scrollButtongo.addEventListener('click', () => {
    let Frame_width = 800;
    let leftValue = Frame_width;
  
    let currentScrollPosition = myprofileFormDiv.scrollLeft;

    // 가장 가까운 600의 배수 위치를 계산합니다.
    if (currentScrollPosition % Frame_width != 0){
      let nearestMultiple = Math.round(currentScrollPosition / Frame_width) * Frame_width;

    // 스크롤해야 할 거리를 계산합니다.
      leftValue = nearestMultiple - currentScrollPosition;
    }

    myprofileFormDiv.scrollBy({
      top: 0,
      left: leftValue,
      behavior:'instant'
    });
  });

scrollButtonback.addEventListener('click', () => {
    let Frame_width = -800;
    let leftValue = Frame_width;

    let currentScrollPosition = myprofileFormDiv.scrollLeft;

    // 가장 가까운 600의 배수 위치를 계산합니다.
    if (currentScrollPosition % Frame_width != 0){
      let nearestMultiple = Math.round(currentScrollPosition / Frame_width) * Frame_width;

    // 스크롤해야 할 거리를 계산합니다.
      leftValue = nearestMultiple - currentScrollPosition;
    }


    myprofileFormDiv.scrollBy({
      top: 0,
      left: leftValue,
      behavior: 'instant'
    });
  });


