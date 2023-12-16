
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
  
// colorPicker.addEventListener('input', function(event) {
//   document.getElementById('labelButton').style.backgroundColor = event.target.value;
//   currentColor = event.target.value;
// });


createButton.addEventListener('click', function() {
  var labelName = document.getElementById('labelInput').value;
  

  if (labelName.trim() !== '' && !labelList.includes(labelName) ) {
    
    var buttonColor = "";
    // Create the button
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.style.marginLeft = '10px';
    deleteButton.style.padding = '10px 15px';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '5px';
    deleteButton.style.cursor = 'pointer';

    var newButton = document.createElement('button');
    newButton.textContent = labelName;
    newButton.classList.add('label-button');
    buttonColor = document.getElementById('colorPicker').value;
    newButton.style.backgroundColor = buttonColor;

    labelList.push(labelName);

    // Add styles to the button
    newButton.style.padding = '10px 15px';
    newButton.style.border = 'none';
    newButton.style.borderRadius = '5px';
    newButton.style.cursor = 'pointer';

    deleteButton.addEventListener('click', function() {
        // 버튼과 삭제 버튼을 DOM에서 제거합니다.
        container.remove();
        labelList = labelList.filter(item => item !==  labelName); 
        updateHiddenField();
    });
    // Create a color picker for the button
    var buttonColorPicker = document.createElement('input');
    buttonColorPicker.type = 'color';
    buttonColorPicker.value = document.getElementById('colorPicker').value;
    // Event listener to update the button color

    // Append the button and its color picker to the container
    var container = document.createElement('div');
    container.appendChild(newButton);
    container.appendChild(deleteButton);
    //container.appendChild(buttonColorPicker);
    document.getElementById('buttonContainer').appendChild(container);
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