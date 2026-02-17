let player;
const cd = document.getElementById("cd");
const eyes = document.getElementById("eyes");
const talkBtn = document.getElementById("talkBtn");
const songTitle = document.getElementById("songTitle");

const songs = {
    "believer": "h13lbNkUaEg",
    "shape of you": "sf7VoyW_5ro",
    "srivalli": "EtGh9oC2SZ0"
};

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "0",
        width: "0",
        videoId: "",
        playerVars: { 'playsinline': 1 }
    });
}

function playVideo() {
    player.playVideo();
    cd.classList.add("rotate");
    eyes.classList.add("active");
}

function pauseVideo() {
    player.pauseVideo();
    cd.classList.remove("rotate");
    eyes.classList.remove("active");
}

function forward10() {
    let current = player.getCurrentTime();
    player.seekTo(current + 10, true);
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = function(event) {
        let command = event.results[0][0].transcript.toLowerCase();

        if (command.includes("hey rhk")) {
            speak("Hello. Which song do you want?");
            return;
        }

        let found = false;

        for (let key in songs) {
            if (command.includes(key)) {
                player.loadVideoById(songs[key]);
                songTitle.innerText = "Playing: " + key;
                speak("Playing " + key);
                cd.classList.add("rotate");
                eyes.classList.add("active");
                found = true;
                break;
            }
        }

        if (!found) {
            speak("Song not found.");
        }
    };

    recognition.start();
}

talkBtn.addEventListener("click", startListening);