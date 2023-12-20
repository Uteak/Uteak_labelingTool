


document.addEventListener('keydown', (event) => {
    
    if (event.key === 'a') {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
      }

    if (event.key === 'd') {
        if (currentSlide < imageCount - 1) { 
            showSlide(currentSlide + 1);
        }
      }
    
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
      }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (currentSlide < imageCount - 1) { 
            showSlide(currentSlide + 1);
        }
      }
    
    if (event.ctrlKey && event.key === 'z') {
        if (!actionStack){
            return;
        }

        const action = actionStack.pop();
        const command = action[0];

        if (command === 'create'){
            const _boxid = action[1];
            delete boundingBoxebuffer[currentSlide][_boxid];
        }

        if (command === 'remove'){
            const _boxid = action[1];
            const _labelindex = action[2];
            const _left = action[3];
            const _top = action[4];
            const _width = action[5];
            const _height = action[6];

            boundingBoxebuffer[currentSlide][_boxid] = {
                labelindex : _labelindex,
                left: _left,
                top: _top,
                width: _width,
                height: _height
              }
        }

        removeSpecificBoundingBoxes();
        drawingBoundingBox(currentSlide);
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        currentButtonIndex = Math.max(0, currentButtonIndex - 1);
        triggerClickEvent();
      } 

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        currentButtonIndex = Math.min(labelButtons.length - 1, currentButtonIndex + 1);
        triggerClickEvent();
    }

    if (event.key === 'w') {
        currentButtonIndex = Math.max(0, currentButtonIndex - 1);
        triggerClickEvent();
      } 

    if (event.key === 's') {
        currentButtonIndex = Math.min(labelButtons.length - 1, currentButtonIndex + 1);
        triggerClickEvent();
    }


    if (event.ctrlKey && event.key === 's'){
        event.preventDefault();
        saveBoundingBox(currentSlide);
    }
});
