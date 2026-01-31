~ Pixel Pomodoro Timer ~

A cozy pixel-art Pomodoro timer with an animated cat chasing a mouse, a cute café background, and lofi music to help you focus ✨
Built using HTML, CSS, and JavaScript.

<img width="1911" height="1000" alt="image" src="https://github.com/user-attachments/assets/37c8c74f-615e-413f-8abc-2c07a86852a9" />


## ✨ Features

* **⏱ Pomodoro Timer**
  * Custom focus and break durations
  * Smooth mode switching with a short pause between sessions
* **🎧 Lo-Fi Background Music**
  * Optional looping lo-fi track for focus
  * One-click Music ON/OFF toggle
* **🔔 Sound Alerts**
  * Distinct sounds for: **Focus → Break** and **Break → Focus**
  * Audio unlocks on first user interaction (browser-safe)
* **🔔 System Notifications**
  * Desktop notifications when a session ends
  * Works even when the tab is not active
* **🐱 Animated Pixel Cat**
  * Idle floating animation
  * Runs when the timer is active
  * Reacts visually to session progress
* **🔥 Daily Streak Tracker**
  * Streak continues if at least one focus session is completed per day
  * Automatically resets after a missed calendar day
  * Fire emoji 🔥 to motivate consistency
* **📊 Session Counter**
  * Tracks total completed focus sessions
  * Updates only after a full focus session finishes
* **💾 Persistent Progress**
  * Sessions completed and streaks are saved using `localStorage`
  * Progress remains even after refresh or browser restart
* **🐱🎉 Cat Celebration on Streak Increase**
  * Cat jumps and glows when the daily streak increases
  * Optional celebratory sound effect
* **🎨 Pixel-Art UI**
  * Soft blue color palette
  * Blocky borders and retro font styling
  * Consistent pixel-perfect visuals
* **⚡ Accurate Background Timing**
  * Timer stays accurate even when the browser tab is inactive
  * Uses real time difference instead of relying on intervals
* **🌐 Deployed with GitHub Pages**
  * Fully static site
  * No backend required





### 📂 Project Structure

```text
pixel-pomodoro/
├── index.html
├── style.css
├── script.js
│
├── assets/
│   ├── sprites/
│   │   ├── cafe-bg1.gif
│   │   ├── cat.png
│   │   ├── cats/
│   │   │   └── cat-run.png
│   │   └── mouse/
│   │       └── mouse-run.png
│   │
│   └── sounds/
│       ├── focus.mp3
│       ├── break.mp3
│       └── lofi.mp3
│
└── README.md
```

~ How to Run Locally ~

Download or clone the repository

git clone https://github.com/your-username/pixel-pomodoro.git


Open the project folder

Open index.html in your browser

Double-click it
OR

Right-click → Open with Live Server (VS Code recommended)

⚠️ Important:
Audio works best when using Live Server or GitHub Pages due to browser autoplay rules.

