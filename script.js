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
const sessionCountEl = document.getElementById("sessionCount");
const streakCountEl = document.getElementById("streakCount");

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
let endTime = null;
let sessionsCompleted = Number(localStorage.getItem("sessionsCompleted")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;
let lastSessionTimestamp = Number(localStorage.getItem("lastSessionTimestamp")) || 0;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
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

function updateStatsUI() {
  sessionCountEl.textContent = sessionsCompleted;
  streakCountEl.textContent = streak;
}

function resetStatsIfExpired() {
  if (!lastSessionTimestamp) return;

  const now = Date.now();
  const hasExpired = now - lastSessionTimestamp >= TWENTY_FOUR_HOURS_MS;

  if (hasExpired) {
    sessionsCompleted = 0;
    streak = 0;

    localStorage.setItem("sessionsCompleted", sessionsCompleted);
    localStorage.setItem("streak", streak);
  }
}

function recordCompletedFocusSession() {
  resetStatsIfExpired();

  sessionsCompleted += 1;
  streak += 1;
  lastSessionTimestamp = Date.now();

  localStorage.setItem("sessionsCompleted", sessionsCompleted);
  localStorage.setItem("streak", streak);
  localStorage.setItem("lastSessionTimestamp", lastSessionTimestamp.toString());
}


// ===============================
// NOTIFICATIONS
// ===============================
function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return;
  }

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}
function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: body,
      icon: "assets/sprites/cat.png", // optional cute icon 🐱
    });
  }
}

function playAlertWithNotification(sound, title, message) {
  // Stop background music cleanly
  lofiMusic.pause();
  lofiMusic.currentTime = 0;

  sound.currentTime = 0;

  // Play sound FIRST
  sound.play().then(() => {
    // Fire notification exactly when sound starts
    showNotification(title, message);
  }).catch(() => {
    // Fallback if browser blocks audio
    showNotification(title, message);
  });

  // Resume lofi AFTER alert (only if enabled)
  sound.onended = () => {
    if (musicOn) {
      lofiMusic.play().catch(() => {});
    }
  };
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
  requestNotificationPermission();

  unlockAudio();
  if (musicOn) {
  lofiMusic.play().catch(() => {});
}

  if (isRunning) return;

  isRunning = true;
  document.body.classList.add("running");

  endTime = Date.now() + timeLeft * 1000;

  timer = setInterval(() => {
    const now = Date.now();
    timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
    updateDisplay();

    if (timeLeft === 0) {
      handleModeEnd();
    }
  }, 500);
}


function pauseTimer() {
  isRunning = false;
  clearInterval(timer);
  document.body.classList.remove("running");
  lofiMusic.pause();
  timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
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
    // Focus → Break
    // ✅ Focus session completed
recordCompletedFocusSession();
updateStatsUI();

    playAlertWithNotification(
      breakSound,
      "Break Time 💤",
      "Focus session complete! Time to relax ☕"
    );

    isFocus = false;
    modeDisplay.textContent = "BREAK";
    timeLeft = breakInput.value * 60;
  } else {
    // Break → Focus
    playAlertWithNotification(
      focusSound,
      "Focus Time 🎯",
      "Break over! Let’s get back to work 💪"
    );

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
resetStatsIfExpired();
updateStatsUI();
updateDisplay();
