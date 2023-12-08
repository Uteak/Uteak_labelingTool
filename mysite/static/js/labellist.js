
var colorPicker = document.getElementById('colorPicker')
var createButton = document.getElementById('createButton')
var submitButton = document.getElementById('submitButton')
const submitLabelList = document.querySelectorAll('.labelButtonList')

let labelList = [];
let labelListbuffer = {};
let labelindex = 0;

submitLabelList.forEach((buttons, index) => {
    //const labelbutton = buttons.querySelector('button');
    console.log(buttons);
    const labelbutton = buttons.querySelector('button');
    const labelName = labelbutton.getAttribute('data-name');
    console.log(labelName);
    labelListbuffer[labelName] = index;
    labelindex = index;
    updateHiddenField();
});

function updateHiddenField() {
    document.getElementById('labelData').value = JSON.stringify(labelListbuffer);
  }
  
// colorPicker.addEventListener('input', function(event) {
//   document.getElementById('labelButton').style.backgroundColor = event.target.value;
//   currentColor = event.target.value;
// });


createButton.addEventListener('click', function() {
  var labelName = document.getElementById('labelInput').value;
  

  if (labelName.trim() !== '') {
    
    var buttonColor = "";
    // Create the button
    var newButton = document.createElement('button');
    newButton.textContent = labelName;
    
    newButton.classList.add('label-button');
    buttonColor = document.getElementById('colorPicker').value;
    newButton.style.backgroundColor = buttonColor;

    labelindex ++;
    labelListbuffer[labelName] = labelindex;

    // Add styles to the button
    newButton.style.padding = '10px 15px';
    newButton.style.border = 'none';
    newButton.style.borderRadius = '5px';
    newButton.style.cursor = 'pointer';
    console.log("Clicked button color:123123123123123" + labelListbuffer);
    newButton.addEventListener('click', function() {
      // Access and use the button's color
      var buttonColor = newButton.style.backgroundColor;
      const nameoflabel = newButton.textContent;

      labelListbuffer[nameoflabel] = buttonColor;
      // You can use the buttonColor variable as needed        
      //console.log("Clicked button color: " + buttonColor);
      //document.getElementById('ButtonColor').textContent = `CurrentColor: ${buttonColor}, labelName: ${nameoflabel}, labelindex: ${labelListbuffer[nameoflabel]}`;
      // Additional logic can be added here
    });
    // Create a color picker for the button
    var buttonColorPicker = document.createElement('input');
    buttonColorPicker.type = 'color';
    buttonColorPicker.value = document.getElementById('colorPicker').value;
    // Event listener to update the button color
    buttonColorPicker.addEventListener('input', function() {
      newButton.style.backgroundColor = buttonColorPicker.value;
      var buttonColor = newButton.style.backgroundColor;

      // RGB를 16진수로 변환
      var hexColor = rgbToHex(buttonColor);
      const nameoflabel = newButton.textContent;

      labelListbuffer[nameoflabel][1] = hexColor;
      // You can use the buttonColor variable as needed        
      console.log("Clicked button color: " + hexColor);
      console.log("labelListbuffer: " + labelListbuffer[nameoflabel][0] + " " + labelListbuffer[nameoflabel][1]);
    });
    // Append the button and its color picker to the container
    var container = document.createElement('div');
    container.appendChild(newButton);
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