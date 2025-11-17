document.addEventListener('DOMContentLoaded', () => {
  const colorDisplay = document.querySelector('#colorDisplay');
  const messageDisplay = document.querySelector('#message');
  const currentStreakDisplay = document.querySelector('#currentStreak');
  const bestStreakDisplay = document.querySelector('#bestStreak');

  const colorBoxes = document.querySelectorAll('.color-box');
  const newRoundBtn = document.querySelector('#newRoundBtn');
  const easyBtn = document.querySelector('#easyBtn');
  const hardBtn = document.querySelector('#hardBtn');
  const resetStreakBtn = document.querySelector('#resetStreakBtn');
  const header = document.querySelector('header');

  let colors = [];
  let correctColor = '';
  let currentStreak = 0;
  let bestStreak = 0;
  let numColors = 6;

  function init() {
    loadBestStreak();
    hardBtn.classList.add('selected');
    setupGame();
    updateStreakDisplay();
  }

  function loadBestStreak() {
    const saved = localStorage.getItem('colorGameBestStreak');
    bestStreak = saved !== null ? parseInt(saved, 10) || 0 : 0;
  }

  function saveBestStreak() {
    localStorage.setItem('colorGameBestStreak', bestStreak);
  }

  function resetBestStreak() {
    const confirmed = confirm('Are you sure you want to reset your best streak?');

    if (confirmed) {
      bestStreak = 0;
      currentStreak = 0;
      localStorage.removeItem('colorGameBestStreak');
      updateStreakDisplay();
      messageDisplay.innerText = 'Streak reset! Start fresh!';
      messageDisplay.style.color = 'white';
    }
  }

  function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r}, ${g}, ${b})`;
  }

  function generateColors(num) {
    const colorArray = [];
    for (let i = 0; i < num; i++) {
      colorArray.push(generateRandomColor());
    }
    return colorArray;
  }

  function pickCorrectColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  function setupGame() {
    colors = generateColors(numColors);
    correctColor = pickCorrectColor();
    colorDisplay.innerText = correctColor.toUpperCase();

    messageDisplay.innerText = 'Pick a color!';
    messageDisplay.style.color = 'white';

    colorBoxes.forEach(function (box, index) {
      if (index < numColors) {
        box.style.display = 'block';
        box.style.backgroundColor = colors[index];
        box.classList.remove('fade');
        box.classList.remove('wrong');
        box.style.border = 'none';
        box.style.pointerEvents = 'auto';
      } else {
        box.style.display = 'none';
      }
    });

    if (header) header.style.backgroundColor = '';
    newRoundBtn.innerText = 'New Round';
  }

  function handleColorClick(event) {
    const clickedBox = event.currentTarget;
    const clickedColor = getComputedStyle(clickedBox).backgroundColor;
    const normalizedCorrect = correctColor;

    if (clickedColor === normalizedCorrect) {
      handleCorrectGuess(clickedBox);
    } else {
      handleWrongGuess(clickedBox);
    }
  }

  function handleCorrectGuess(clickedBox) {
    currentStreak++;

    let message = '';
    let messageColor = '';
// TASK-2  "Streak!" Message When Streak ≥ 3

    if (currentStreak >= 3) {
      message = 'Streak!';
      messageColor = 'green';
    }
// TASK-4 = Show "First Win!" on First Correct Answer
    if (currentStreak === 1) {
      message = 'First Win!';
      messageColor = 'lightgreen';
    }

    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
      // TASK - 5 = Header Text Becomes Bold on New Best Streak
      colorDisplay.style.fontWeight = 'bold';
      saveBestStreak();
      message = '🎉 NEW BEST STREAK! 🎉';
      messageColor = '#4ECDC4';
    } else if (message === '') {
      message = 'Correct! 🎯';
      messageColor = '#4ECDC4';
    }

    messageDisplay.innerText = message;
    messageDisplay.style.color = messageColor;
// TASK-1 = Correct Color Glows When Clicked
    colorBoxes.forEach(function (box) {
      if (box.style.display !== 'none') {
        box.style.backgroundColor = correctColor;
        box.classList.remove('fade');
        box.style.border = 'none';
        box.style.pointerEvents = 'none';
      }
    });

    clickedBox.style.border = '2px solid gold';

    if (header) header.style.backgroundColor = correctColor;

    updateStreakDisplay();

    newRoundBtn.innerText = 'Next Round';
  }

  function handleWrongGuess(clickedBox) {
    currentStreak = 0;
    updateStreakDisplay();
    // TASK - 6 = Wrong Box Shakes When Clicked
    clickedBox.classList.remove("wrong");
    void clickedBox.offsetWidth; 
    clickedBox.classList.add("wrong");

    clickedBox.classList.add('fade');
    clickedBox.style.pointerEvents = 'none';

    messageDisplay.innerText = 'Try Again!';
    messageDisplay.style.color = '#FF6B6B';
  }

  function updateStreakDisplay() {
    currentStreakDisplay.innerText = currentStreak;
    bestStreakDisplay.innerText = bestStreak;
  }

  function setEasyMode() {
    // TASK - 3 = Easy Mode Button Turns Green When Selected
    
    easyBtn.style.color = 'white';
    easyBtn.style.backgroundColor = 'green';
    hardBtn.style.color = "black";
    hardBtn.style.backgroundColor = "white";
    numColors = 3;
    easyBtn.classList.add('selected');
    hardBtn.classList.remove('selected');
    setupGame();
  }

  function setHardMode() {
    easyBtn.style.color = "white";
    easyBtn.style.backgroundColor = "gray";
    hardBtn.style.color = "white";
    hardBtn.style.backgroundColor = "red";
    numColors = 6;
    hardBtn.classList.add('selected');
    easyBtn.classList.remove('selected');
    
    setupGame();
  }

  colorBoxes.forEach(function (box) {
    box.addEventListener('click', handleColorClick);
  });

  newRoundBtn.addEventListener('click', function () {
    setupGame();
  });

  easyBtn.addEventListener('click', setEasyMode);
  hardBtn.addEventListener('click', setHardMode);
  resetStreakBtn.addEventListener('click', resetBestStreak);

  init();
});