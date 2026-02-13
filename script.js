// ------------------------------
// 5 YouTube Songs
// ------------------------------
let songs = [
    { name: "Song 1", file: "45ZXIpC53tY", img: "img1.jpg" },
    { name: "Song 2", file: "05h-b8yOwwE", img: "img2.jpg" },
    { name: "Song 3", file: "WbSV889CwBc", img: "img3.jpg" },
    { name: "Song 4", file: "yMNm6XAxduU", img: "img4.jpg" },
    { name: "Song 5", file: "7uFWC5xNnYQ", img: "img5.jpg" }
];

// DOM Elements
const songGrid = document.getElementById("songGrid");
const playerView = document.getElementById("playerView");
const cd = document.getElementById("cd");
const nowTitle = document.getElementById("nowTitle");
const prevTitle = document.getElementById("prevTitle");
const currentTitle = document.getElementById("currentTitle");
const nextTitle = document.getElementById("nextTitle");

let currentIndex = 0;
let player;

// ENTER MUSIC APP
function enterApp(){
    document.getElementById("homePage").style.display="none";
    document.getElementById("musicApp").style.display="block";
}

// CREATE SONG GRID
songs.forEach((song,index)=>{
    const card = document.createElement("div");
    card.className = "song-card";
    card.innerHTML = `<img src="${song.img}"><h3>${song.name}</h3>`;
    card.onclick = ()=> playSong(index);
    songGrid.appendChild(card);
});

// UPDATE SLIDE TITLES
function updateSlideTitles(){
    let prevIndex = (currentIndex-1+songs.length)%songs.length;
    let nextIndex = (currentIndex+1)%songs.length;
    prevTitle.innerText = songs[prevIndex].name;
    currentTitle.innerText = songs[currentIndex].name;
    nextTitle.innerText = songs[nextIndex].name;
}

// YouTube IFrame API
function onYouTubeIframeAPIReady(){
    player = new YT.Player('youtubePlayer', {
        height: '0',
        width: '0',
        videoId: songs[0].file,
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event){
    if(event.data === YT.PlayerState.ENDED) nextSong();
}

// PLAY SONG (Only YouTube)
function playSong(index){
    currentIndex = index;
    const song = songs[index];

    if(player) player.loadVideoById(song.file);

    nowTitle.innerText = song.name;
    cd.style.backgroundImage = `url('${song.img}')`;
    cd.classList.add("playing");
    playerView.style.display = "flex";
    updateSlideTitles();
}

// PLAY / PAUSE
function togglePlay(){
    if(!player) return;
    const state = player.getPlayerState();
    if(state === YT.PlayerState.PLAYING){
        player.pauseVideo();
        cd.classList.remove("playing");
        document.getElementById("playBtn").innerText="▶";
    } else {
        player.playVideo();
        cd.classList.add("playing");
        document.getElementById("playBtn").innerText="⏸";
    }
}

// NEXT / PREV SONG
function nextSong(){
    currentIndex = (currentIndex+1)%songs.length;
    playSong(currentIndex);
}
function prevSong(){
    currentIndex = (currentIndex-1+songs.length)%songs.length;
    playSong(currentIndex);
}

// SKIP 10s
function plus10(){ if(player) player.seekTo(player.getCurrentTime()+10,true); }
function minus10(){ if(player) player.seekTo(player.getCurrentTime()-10,true); }

// GO BACK TO GRID
function goBack(){
    playerView.style.display="none";
    player?.pauseVideo();
    cd.classList.remove("playing");
}

// SEARCH SONG
function searchSong(){
    const input = document.getElementById("searchBar").value.toLowerCase();
    document.querySelectorAll(".song-card").forEach(card=>{
        card.style.display = card.innerText.toLowerCase().includes(input)?"block":"none";
    });
}