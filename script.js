
/* =====================================
   1. TIMER VARIABLES
===================================== */

let timer = null;

let timeLeft = 25 * 60;
let totalTime = 25 * 60;

let currentMode = "pomodoro";
let isRunning = false;

let completedSessions = 0;
let nextMode = "pomodoro";

let durations = {
    "pomodoro": 25,
    "short-break": 5,
    "long-break": 15
};


/* =====================================
   2. HTML ELEMENTS
===================================== */

const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");

const timerProgress = document.getElementById("timer-progress");
const currentModeDisplay = document.getElementById("current-mode");

const musicPanel = document.getElementById("music-panel");
const settingsPanel = document.getElementById("settings-panel");

const music = document.getElementById("background-music");

const blankScreen = document.getElementById("blank-screen");

const notification = document.getElementById("break-notification");

const websiteVolume = document.getElementById("website-volume");


/* =====================================
   3. UPDATE TIMER DISPLAY
===================================== */

function updateDisplay() {

    let safeTime = Math.max(
        0,
        Number.isFinite(timeLeft) ? timeLeft : 0
    );

    let minutes = Math.floor(safeTime / 60);
    let seconds = safeTime % 60;

    minutesDisplay.textContent =
        String(minutes).padStart(2, "0");

    secondsDisplay.textContent =
        String(seconds).padStart(2, "0");

    let progress = totalTime > 0
        ? ((totalTime - safeTime) / totalTime) * 100
        : 0;

    timerProgress.style.width = progress + "%";

}


/* =====================================
   4. GET DURATION
===================================== */

function getDuration(mode) {

    let duration = Number(durations[mode]);

    if (!Number.isFinite(duration) || duration <= 0) {
        return 25;
    }

    return duration;

}


/* =====================================
   5. CHANGE TIMER MODE
===================================== */

function changeMode(mode) {

    clearInterval(timer);

    timer = null;
    isRunning = false;

    if (!Object.prototype.hasOwnProperty.call(durations, mode)) {
        mode = "pomodoro";
    }

    currentMode = mode;

    timeLeft = getDuration(mode) * 60;
    totalTime = timeLeft;

    startButton.textContent = "Start";

    document.querySelectorAll(".modes button").forEach(button => {

        button.classList.remove("active");

    });

    const selectedButton = document.querySelector(
        `[data-mode="${mode}"]`
    );

    if (selectedButton) {
        selectedButton.classList.add("active");
    }

    if (mode === "pomodoro") {

        currentModeDisplay.textContent = "Focus Time";

    }

    else if (mode === "short-break") {

        currentModeDisplay.textContent = "Short Break";

    }

    else if (mode === "long-break") {

        currentModeDisplay.textContent = "Long Break";

    }

    updateDisplay();

}


/* =====================================
   6. START / PAUSE TIMER
===================================== */

startButton.addEventListener("click", function () {

    if (isRunning) {

        clearInterval(timer);

        timer = null;
        isRunning = false;

        startButton.textContent = "Start";

    }

    else {

        if (timeLeft <= 0) {
            timeLeft = getDuration(currentMode) * 60;
            totalTime = timeLeft;
        }

        isRunning = true;

        startButton.textContent = "Pause";

        timer = setInterval(countdown, 1000);

    }

});


/* =====================================
   7. COUNTDOWN
===================================== */

function countdown() {

    if (timeLeft > 0) {

        timeLeft--;

        updateDisplay();

    }

    if (timeLeft <= 0) {

        clearInterval(timer);

        timer = null;
        isRunning = false;

        startButton.textContent = "Start";

        timeLeft = 0;

        updateDisplay();

        playNotificationSound();

        completeSession();

    }

}


/* =====================================
   8. RESET TIMER
===================================== */

resetButton.addEventListener("click", function () {

    clearInterval(timer);

    timer = null;
    isRunning = false;

    timeLeft = getDuration(currentMode) * 60;
    totalTime = timeLeft;

    startButton.textContent = "Start";

    updateDisplay();

});


/* =====================================
   9. TIMER MODE BUTTONS
===================================== */

document.getElementById("pomodoro")
    .addEventListener("click", function () {

        changeMode("pomodoro");

    });


document.getElementById("short-break")
    .addEventListener("click", function () {

        changeMode("short-break");

    });


document.getElementById("long-break")
    .addEventListener("click", function () {

        changeMode("long-break");

    });


/* =====================================
   10. COMPLETE SESSION
===================================== */

function completeSession() {

    const title =
        document.getElementById("notification-title");

    const message =
        document.getElementById("notification-message");

    if (currentMode === "pomodoro") {

        completedSessions++;

        updateRepetitions();

        title.textContent = "Focus Session Complete!";

        if (completedSessions % getRepetitions() === 0) {

            message.textContent =
                "Great work! Time for a long break.";

            nextMode = "long-break";

        }

        else {

            message.textContent =
                "Well done! Time for a short break.";

            nextMode = "short-break";

        }

    }

    else {

        title.textContent = "Break Complete!";

        message.textContent =
            "Your break is over. Ready to focus again?";

        nextMode = "pomodoro";

    }

    if (!notification.open) {
        notification.showModal();
    }

}


/* =====================================
   11. NOTIFICATION CONTINUE
===================================== */

document.getElementById("notification-continue")
    .addEventListener("click", function () {

        notification.close();

        changeMode(nextMode);

    });


/* =====================================
   12. FOCUS REPETITIONS
===================================== */

function getRepetitions() {

    let value = Number(
        document.getElementById("focus-repetitions").value
    );

    if (!Number.isFinite(value) || value < 1) {
        return 3;
    }

    return Math.min(3, Math.floor(value));

}


function updateRepetitions() {

    const repetitions = document.querySelectorAll(".rep");

    const completed = completedSessions % getRepetitions();

    repetitions.forEach((rep, index) => {

        rep.classList.toggle(
            "completed",
            index < completed
        );

    });

}


/* =====================================
   13. MUSIC PANEL
===================================== */

document.getElementById("music")
    .addEventListener("click", function () {

        musicPanel.classList.add("open");

        settingsPanel.classList.remove("open");

    });


document.getElementById("close-music")
    .addEventListener("click", function () {

        musicPanel.classList.remove("open");

    });




/* =====================================
   15. SETTINGS PANEL
===================================== */

document.getElementById("settings")
    .addEventListener("click", function () {

        settingsPanel.classList.add("open");

        musicPanel.classList.remove("open");

    });


document.getElementById("close-settings")
    .addEventListener("click", function () {

        settingsPanel.classList.remove("open");

    });


/* =====================================
   16. BACKGROUND SELECTOR
===================================== */

const backgroundChoice =
    document.getElementById("background-choice");


function changeBackground() {

    const allowedImages = [
        "IMGA.jpg",
        "IMAG.jpg",
        "IMGI.jpg"
    ];

    const selectedImage = backgroundChoice.value;

    if (allowedImages.includes(selectedImage)) {

        document.documentElement.style.setProperty(
            "--page-background",
            `url("${selectedImage}")`
        );

    }

}


backgroundChoice.addEventListener(
    "change",
    changeBackground
);


/* =====================================
   17. BACKGROUND DIMMING
===================================== */

const backgroundDim =
    document.getElementById("background-dim");

const dimValue =
    document.getElementById("dim-value");


function changeDim() {

    let value = Number(backgroundDim.value);

    document.documentElement.style.setProperty(
        "--background-dim",
        value / 100
    );

    dimValue.textContent = value + "%";

}


backgroundDim.addEventListener("input", changeDim);


/* =====================================
   18. WEBSITE VOLUME
===================================== */

const volumeValue =
    document.getElementById("volume-value");


function changeVolume() {

    let value = Number(websiteVolume.value);

    music.volume = value / 100;

    volumeValue.textContent = value + "%";

}


websiteVolume.addEventListener("input", changeVolume);


/* =====================================
   19. NOTIFICATION SOUNDS
===================================== */

function playNotificationSound() {

    const sound =
        document.getElementById("timer-sound").value;

    const patterns = {

        chimes: [523, 659, 784],

        xylophone: [784, 659, 523],

        chords: [523, 659, 784, 1046],

        jingle: [659, 784, 659, 880],

        transition: [440, 554, 659],

        descending: [880, 784, 659],

        bounce: [523, 784, 523, 784],

        echo: [659, 523, 659],

        ascending: [440, 554, 659, 784]

    };

    const frequencies =
        patterns[sound] || patterns.chimes;

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        return;
    }

    const audioContext = new AudioContextClass();

    frequencies.forEach((frequency, index) => {

        const oscillator = audioContext.createOscillator();

        const gain = audioContext.createGain();

        const startTime =
            audioContext.currentTime + index * 0.2;

        oscillator.type = "sine";

        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(0.15, startTime);

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + 0.35
        );

        oscillator.connect(gain);

        gain.connect(audioContext.destination);

        oscillator.start(startTime);

        oscillator.stop(startTime + 0.4);

    });

    setTimeout(() => {

        audioContext.close();

    }, frequencies.length * 250 + 1000);

}


/* =====================================
   20. TEST SOUND
===================================== */

document.getElementById("test-sound")
    .addEventListener("click", function () {

        playNotificationSound();

    });


/* =====================================
   21. SAVE SETTINGS
===================================== */

document.getElementById("save-settings")
    .addEventListener("click", function () {

        const focus = Number(
            document.getElementById("pomodoro-duration").value
        );

        const short = Number(
            document.getElementById("short-break-duration").value
        );

        const long = Number(
            document.getElementById("long-break-duration").value
        );

        if (
            !Number.isInteger(focus) ||
            focus < 1 || focus > 120 ||

            !Number.isInteger(short) ||
            short < 1 || short > 60 ||

            !Number.isInteger(long) ||
            long < 1 || long > 60
        ) {

            alert("Please enter valid timer durations.");

            return;

        }

        durations["pomodoro"] = focus;

        durations["short-break"] = short;

        durations["long-break"] = long;

        clearInterval(timer);

        timer = null;
        isRunning = false;

        timeLeft = getDuration(currentMode) * 60;

        totalTime = timeLeft;

        startButton.textContent = "Start";

        updateDisplay();

        updateRepetitions();

        changeBackground();

        changeDim();

        changeVolume();

        settingsPanel.classList.remove("open");

        alert("Settings saved successfully!");

    });


/* =====================================
   22. SCREEN MODE FUNCTION
===================================== */

function setScreenMode(mode) {

    blankScreen.className = "active";

    if (mode === "black") {

        blankScreen.classList.add("black");

    }

    else if (mode === "white") {

        blankScreen.classList.add("white");

    }

    else if (mode === "multicolour") {

        blankScreen.classList.add("multicolour");

    }

}


/* =====================================
   23. SETTINGS SCREEN BUTTONS
===================================== */

document.getElementById("view-screen")
    .addEventListener("click", function () {

        setScreenMode("view");

    });


document.getElementById("multicolour-screen")
    .addEventListener("click", function () {

        setScreenMode("multicolour");

    });


document.getElementById("black-screen")
    .addEventListener("click", function () {

        setScreenMode("black");

    });


document.getElementById("white-screen")
    .addEventListener("click", function () {

        setScreenMode("white");

    });


/* =====================================
   24. BLANK SCREEN BUTTONS
===================================== */

document.getElementById("blank-view")
    .addEventListener("click", function () {

        setScreenMode("view");

    });


document.getElementById("blank-multicolour")
    .addEventListener("click", function () {

        setScreenMode("multicolour");

    });


document.getElementById("blank-black")
    .addEventListener("click", function () {

        setScreenMode("black");

    });


document.getElementById("blank-white")
    .addEventListener("click", function () {

        setScreenMode("white");

    });


/* =====================================
   25. EXIT BLANK SCREEN
===================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        blankScreen.className = "";

    }

});


/* =====================================
   26. INITIALISE WEBSITE
===================================== */

changeMode("pomodoro");

updateDisplay();

updateRepetitions();

changeBackground();

changeDim();

changeVolume();
