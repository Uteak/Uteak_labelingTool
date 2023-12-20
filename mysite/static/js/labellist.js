
var colorPicker = document.getElementById('colorPicker')
var createButton = document.getElementById('createButton')
var submitButton = document.getElementById('submitButton')
const deletelabel = document.querySelectorAll('.delete-btn')
const submitLabelList = document.querySelectorAll('.labelButtonList')

let labelList = [];
let labeldelete = [];

//const labelindex = document.querySelector('.labelButtonList').dataset.imageCount;


submitLabelList.forEach((buttons, index) => {
    //const labelbutton = buttons.querySelector('button');
    const labelbutton = buttons.querySelector('button');
    const labelName = labelbutton.getAttribute('data-name');
    labelList.push(labelName);
    updateHiddenField();
});

deletelabel.forEach(function(btn) {

    btn.addEventListener('click', function(e) {
        // 삭제할 버튼의 data-name 속성 값 가져오기
        const nameToDelete = e.target.getAttribute('data-name');
        labeldelete.push(nameToDelete);
        labelList = labelList.filter(item => item !==  nameToDelete); 
        // 해당 data-name을 가진 버튼 찾아서 삭제
        document.querySelectorAll(`button[data-name="${nameToDelete}"]`).forEach(function(btn) {
            btn.parentNode.removeChild(btn);
        });

        updateHiddenField();
    });

});


function updateHiddenField() {
    document.getElementById('labelData').value = JSON.stringify(labelList);
  }


createButton.addEventListener('click', function() {
    var labelName = document.getElementById('labelInput').value;

    if (labelName.trim() !== '' && !labelList.includes(labelName)) {
        // 라벨 버튼 생성
        var newButton = document.createElement('button');
        newButton.textContent = labelName;
        newButton.classList.add('btn', 'btn-outline-primary', 'mr-1');
        newButton.setAttribute('data-name', labelName);
        newButton.style.marginRight = '5px'
        
        // 삭제 버튼 생성
        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete'; // Font Awesome 아이콘 사용
        deleteButton.classList.add('btn', 'btn-outline-danger', 'delete-btn');
        deleteButton.setAttribute('data-name', labelName);

        // 삭제 이벤트 핸들러 추가
        deleteButton.addEventListener('click', function() {
            // 버튼과 삭제 버튼을 DOM에서 제거합니다.
            container.remove();
            labelList = labelList.filter(item => item !== labelName); 
            updateHiddenField();
        });

        // 버튼을 담을 컨테이너 생성
        var container = document.createElement('div');
        container.classList.add('labelButtonList', 'mb-1');
        container.appendChild(newButton);
        container.appendChild(deleteButton);

        // 컨테이너를 buttonContainer에 추가
        document.getElementById('buttonContainer').appendChild(container);

        // 라벨 목록 업데이트 및 숨겨진 필드 업데이트
        labelList.push(labelName);
        updateHiddenField();
    }
});

function rgbToHex(rgb) {
    // RGB 값에서 숫자를 추출합니다.
    var rgbValues = rgb.match(/\d+/g);

    // 각 RGB 값을 16진수로 변환하고, 필요한 경우 앞에 0을 붙입니다.
    var hex = rgbValues.map(function(val) {
        var hexVal = parseInt(val).toString(16);
        return hexVal.length == 1 ? "0" + hexVal : hexVal;
    }).join('');

    return "#" + hex;
}