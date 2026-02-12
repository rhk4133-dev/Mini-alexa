const songs = [
    { name: "DIL LAGANA MANATHA", file: "song1.mp3", image: "img1.jpg" },
    { name: "KAGADADA DONIYALLI", file: "song2.mp3", image: "img2.jpg" },
    { name: "KANAVE KANAVE", file: "song3.mp3", image: "img3.jpg" },
    { name: "KANTHARA THE PART 2", file: "song4.mp3", image: "img4.jpg" },
    { name: "ZARA ZARA", file: "song5.mp3", image: "img5.jpg" }
];

const audio = document.getElementById("audio");
const cd = document.getElementById("cd");
const title = document.getElementById("title");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");

let currentSong = 0;
let isPlaying = false;

function loadSong(index) {
    currentSong = index;
    audio.src = songs[index].file;
    document.body.style.backgroundImage = `url(${songs[index].image})`;
    cd.src = songs[index].image;
    title.innerText = songs[index].name;
    playSong();
}

function playSong() {
    audio.play();
    cd.style.animationPlayState = "running";
    playBtn.innerText = "⏸";
    isPlaying = true;
}

function togglePlay() {
    if (!audio.src) {
        loadSong(0);
        return;
    }

    if (isPlaying) {
        audio.pause();
        cd.style.animationPlayState = "paused";
        playBtn.innerText = "▶";
    } else {
        playSong();
    }

    isPlaying = !isPlaying;
}

function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
}

function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
}

/* Progress bar update */
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    }
});

/* Click progress bar */
function setProgress(e) {
    const width = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
}

/* Auto next */
audio.addEventListener("ended", nextSong);