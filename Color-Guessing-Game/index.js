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

  let colors = []; // Array to store all color options
  let correctColor = ''; // The target color to guess
  let currentStreak = 0; // Current consecutive correct guesses
  let bestStreak = 0; // All-time best streak
  let numColors = 6; // Number of color boxes (3 for easy, 6 for hard)

  function init() {
    loadBestStreak();
    // ensure some default mode selected visually
    hardBtn.classList.add('selected');
    setupGame();
    updateStreakDisplay();
  }

  function loadBestStreak() {
    const saved = localStorage.getItem('colorGameBestStreak');

    if (saved !== null) {
      bestStreak = parseInt(saved, 10) || 0;
    } else {
      bestStreak = 0;
    }
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

  // Pick random color from array as correct answer
  function pickCorrectColor() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  function setupGame() {
    colors = generateColors(numColors);

    correctColor = pickCorrectColor();

    // Display RGB value to guess (uppercase for readability)
    colorDisplay.innerText = correctColor.toUpperCase();

    // Reset message
    messageDisplay.innerText = 'Pick a color!';
    messageDisplay.style.color = 'white';

    // Reset and assign colors to boxes
    colorBoxes.forEach(function (box, index) {
      if (index < numColors) {
        // Show box and assign color
        box.style.display = 'block';
        box.style.backgroundColor = colors[index];
        box.classList.remove('fade');

        // Reset the border for the new round
        box.style.border = 'none';
        box.style.pointerEvents = 'auto';
      } else {
        // Hide extra boxes (for easy mode)
        box.style.display = 'none';
      }
    });

    // Reset header background if present
    if (header) header.style.backgroundColor = '';
    newRoundBtn.innerText = 'New Round';
  }

  // ========================================
  // Game Logic Functions
  // ========================================

  // Handle color box click
  function handleColorClick(event) {
    const clickedBox = event.currentTarget; // safer than target
    // Use getComputedStyle so comparison matches browser-normalized string
    const clickedColor = getComputedStyle(clickedBox).backgroundColor;
    const normalizedCorrect = correctColor; // generateRandomColor uses same format

    // Check if clicked color matches correct answer
    if (clickedColor === normalizedCorrect) {
      // Correct answer!
      handleCorrectGuess(clickedBox);
    } else {
      // Wrong answer!
      handleWrongGuess(clickedBox);
    }
  }

  // Handle correct guess
  function handleCorrectGuess(clickedBox) {
    // Update streak
    currentStreak++;

    let message = '';
    let messageColor = '';
// TASK-2 =  "Streak!" Message When Streak ≥ 3
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
    //   TASK-5 = Header Text Becomes Bold on New Best Streak
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

    
    colorBoxes.forEach(function (box) {
      if (box.style.display !== 'none') {
        box.style.backgroundColor = correctColor;
        box.classList.remove('fade'); // Remove fade from any wrong guesses
        box.style.border = 'none'; // Reset all other borders
        box.style.pointerEvents = 'none'; // disable further clicking this round
      }
    });

    // Apply glow effect to the correctly clicked box (if visible)
    // TASK-1 =  Correct Color Glows When Clicked

    clickedBox.style.border = '2px solid gold';

    if (header) header.style.backgroundColor = correctColor;

    updateStreakDisplay();

    newRoundBtn.innerText = 'Next Round';
  }

  function handleWrongGuess(clickedBox) {
    currentStreak = 0;
    updateStreakDisplay();

    // Fade out the wrong box and disable it
    clickedBox.classList.add('fade');
    clickedBox.style.pointerEvents = 'none';
clickedBox.classList.add('wrong');
    messageDisplay.innerText = 'Try Again!';
    messageDisplay.style.color = '#FF6B6B';
  }

  function updateStreakDisplay() {
    currentStreakDisplay.innerText = currentStreak;
    bestStreakDisplay.innerText = bestStreak;
  }
// TASK-3 = Easy Mode Button Turns Green When Selected
  function setEasyMode() {
    easyBtn.style.color = 'white';
    easyBtn.style.backgroundColor = 'green';
    numColors = 3;
    easyBtn.classList.add('selected');
    hardBtn.classList.remove('selected');
    setupGame();
  }

  function setHardMode() {
    numColors = 6;
    hardBtn.classList.add('selected');
    easyBtn.classList.remove('selected');
    hardBtn.style.color = 'white';
    hardBtn.style.backgroundColor = ''; // reset if you changed it earlier
    setupGame();
  }

  // ========================================
  // Event Listeners
  // ========================================

  colorBoxes.forEach(function (box) {
    box.addEventListener('click', handleColorClick);
  });

  newRoundBtn.addEventListener('click', function () {
    setupGame();
  });

  easyBtn.addEventListener('click', setEasyMode);
  hardBtn.addEventListener('click', setHardMode);
  resetStreakBtn.addEventListener('click', resetBestStreak);

  // ========================================
  // Initialise Game
  // ========================================
  init();
});