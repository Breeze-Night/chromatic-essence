document.addEventListener("DOMContentLoaded", () => {
  const savedColors = JSON.parse(localStorage.getItem("savedColors")) || [];
  const pickerBtn = document.querySelector("#pickerBtn");
  const clearAll = document.querySelector(".clear-all");
  const colorList = document.querySelector(".color-list");
  const pickedWrapper = document.querySelector(".picked-wrapper");

  showColors();

  pickerBtn.addEventListener("click", getColor);
  clearAll.addEventListener("click", clearSavedColors);

  async function getColor() {
    try {
      // open eyedropper and copy value to clipboard
      const eyeDropper = await new EyeDropper();
      const { sRGBHex } = await eyeDropper.open();
      colorChangeEffect(sRGBHex);
      // no duplicate
      if (!savedColors.includes(sRGBHex)) {
        navigator.clipboard.writeText(sRGBHex);
        savedColors.push(sRGBHex);
        localStorage.setItem("savedColors", JSON.stringify(savedColors));
      }
      showColors();
    } catch (error) {
      console.log(error);
    }
  }

  function showColors() {
    colorList.innerHTML = "";
    savedColors.forEach((color) => {
      // create elements
      const li = document.createElement("li");
      const rect = document.createElement("div");
      const val = document.createElement("div");
      // add attributes and values
      li.classList.add("color");
      rect.classList.add("rect");
      val.classList.add("value");
      rect.style.backgroundColor = color;
      val.textContent = color;
      val.setAttribute("data-color", color);
      // append per DOM hierarchy
      li.appendChild(rect);
      li.appendChild(val);
      colorList.appendChild(li);

      // Add click event for each color panel
      const colorPanels = document.querySelectorAll(".color");
      colorPanels.forEach((colorPanel) => {
        colorPanel.addEventListener("click", (e) => {
          // caching reference for setTimeout
          const targetValueElement = e.currentTarget.lastElementChild;
          const hexValue = targetValueElement.dataset.color;
          navigator.clipboard.writeText(hexValue);
          // change to COPIED once clicked, then revert back
          targetValueElement.textContent = "COPIED";
          setTimeout(() => {
            targetValueElement.textContent = hexValue;
          }, 1000);
        });
      });
    });
    // UI feature, if no saved color, hide title and clear all
    if (savedColors.length) {
      pickedWrapper.classList.remove("hide");
    }
  }

  function clearSavedColors() {
    // clear the data in the array
    savedColors.length = 0;
    localStorage.removeItem("savedColors");
    pickedWrapper.classList.add("hide"); // ui feature
    showColors();
  }

  function colorChangeEffect(color) {
    const wrapper = document.querySelector(".picker-wrapper");

    // Save the original background color
    const originalBackgroundColor = getComputedStyle(wrapper).background;
    const originalBtnValue = pickerBtn.textContent;

    // Change the background color to the picked color
    wrapper.style.background = color;
    pickerBtn.textContent = color;

    // After 1 second, revert the background color to the original color
    setTimeout(() => {
      wrapper.style.background = originalBackgroundColor;
      pickerBtn.textContent = originalBtnValue;
    }, 1500);
  }
});
