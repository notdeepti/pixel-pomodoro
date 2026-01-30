// ===============================
// ELEMENTS
// ===============================
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

const timerDisplay = document.getElementById("timer");
const modeDisplay = document.getElementById("mode");

const focusInput = document.getElementById("focusInput");
const breakInput = document.getElementById("breakInput");

const musicBtn = document.getElementById("musicToggle");

// ===============================
// AUDIO
// ===============================
const focusSound = new Audio("assets/sounds/focus.mp3");
const breakSound = new Audio("assets/sounds/break.mp3");

const lofiMusic = new Audio("assets/sounds/lofi.mp3");
lofiMusic.loop = true;
lofiMusic.volume = 0.4;

let audioUnlocked = false;
let musicOn = false;

// ===============================
// STATE
// ===============================
let isRunning = false;
let isFocus = true;
let timer = null;
let timeLeft = 0;

// ===============================
// FUNCTIONS
// ===============================
function unlockAudio() {
  if (audioUnlocked) return;

  focusSound.play().then(() => focusSound.pause()).catch(() => {});
  breakSound.play().then(() => breakSound.pause()).catch(() => {});
  lofiMusic.play().then(() => lofiMusic.pause()).catch(() => {});

  audioUnlocked = true;
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.textContent =
    `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
}

function startTimer() {
  unlockAudio();
  if (isRunning) return;

  isRunning = true;
  document.body.classList.add("running");

  if (musicOn) {
    lofiMusic.play();
  }

  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      handleModeEnd();
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  document.body.classList.remove("running");
  lofiMusic.pause();
}

function resetTimer() {
  pauseTimer();

  isFocus = true;
  modeDisplay.textContent = "FOCUS";
  timeLeft = focusInput.value * 60;
  updateDisplay();

  lofiMusic.currentTime = 0;
}

function handleModeEnd() {
  clearInterval(timer);
  isRunning = false;
  document.body.classList.remove("running");
  lofiMusic.pause();

  // ⏸ 3-second pause before switching
  setTimeout(() => {
    if (isFocus) {
      breakSound.currentTime = 0;
      breakSound.play();

      isFocus = false;
      modeDisplay.textContent = "BREAK";
      timeLeft = breakInput.value * 60;
    } else {
      focusSound.currentTime = 0;
      focusSound.play();

      isFocus = true;
      modeDisplay.textContent = "FOCUS";
      timeLeft = focusInput.value * 60;
    }

    updateDisplay();
    startTimer();
  }, 3000);
}

// ===============================
// MUSIC TOGGLE
// ===============================
musicBtn.addEventListener("click", () => {
  musicOn = !musicOn;

  if (musicOn) {
    lofiMusic.play();
    musicBtn.textContent = "MUSIC: ON";
  } else {
    lofiMusic.pause();
    musicBtn.textContent = "MUSIC: OFF";
  }
});

// ===============================
// EVENTS
// ===============================
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// ===============================
// INIT
// ===============================
timeLeft = focusInput.value * 60;
updateDisplay();
