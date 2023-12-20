const chechboxall = document.getElementById('checkAll');
const unchechboxall = document.getElementById('uncheckAll');


chechboxall.addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('.image-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = true;
    });
  
});

unchechboxall.addEventListener('click', function() {
    var checkboxes = document.querySelectorAll('.image-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
  
});

function checkAll() {
    var checkboxes = document.querySelectorAll('.image-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = true;
    });
}

function uncheckAll() {
    var checkboxes = document.querySelectorAll('.image-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.checked = false;
    });
}