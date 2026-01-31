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
let lastSessionDate = localStorage.getItem("lastSessionDate");
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

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function updateStatsUI() {
  sessionCountEl.textContent = sessionsCompleted;
  streakCountEl.textContent = streak;
}

function updateStreak() {
  const today = getTodayDate();

  if (!lastSessionDate) {
    // First ever session
    streak = 1;
  } else {
    const last = new Date(lastSessionDate);
    const current = new Date(today);

    const diffDays = Math.floor(
      (current - last) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Continued streak
      streak += 1;
    } else if (diffDays > 1) {
      // Missed a day → reset
      streak = 1;
    }
    // diffDays === 0 → same day, streak unchanged
  }

  lastSessionDate = today;

  localStorage.setItem("streak", streak);
  localStorage.setItem("lastSessionDate", lastSessionDate);
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
sessionsCompleted += 1;
localStorage.setItem("sessionsCompleted", sessionsCompleted);

updateStreak();
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
updateDisplay();
updateStatsUI();
