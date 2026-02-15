const playlist = [
    { id: 'hoNb6HuNmU0', title: 'Khairiyat', artist: 'Arijit Singh' },
    { id: '5Eqb_-j3FDA', title: 'Pasoori', artist: 'Ali Sethi' },
    { id: 'LK7-_dgAVQE', title: 'Tauba Tauba', artist: 'Karan Aujla' },
    { id: 'hxMNYkLN7tI', title: 'Aaj Ki Raat', artist: 'Stree 2' },
    { id: 'kmjeMrjOjFA', title: 'Taambdi Chaamdi', artist: 'Kratex' },
    { id: 'sCbbMZ-q4-I', title: 'Lut Gaye', artist: 'Jubin Nautiyal' },
    { id: '8of5w7RgcTc', title: 'Pal Pal', artist: 'Afusic' }
];

let player;
const songGrid = document.getElementById('song-grid');
const masterToggle = document.getElementById('master-toggle');

// Build Data Modules
playlist.forEach(song => {
    const module = document.createElement('div');
    module.className = 'data-module';
    module.innerHTML = `
        <img src="https://img.youtube.com/vi/${song.id}/default.jpg">
        <div class="module-info">
            <div style="font-size: 14px; font-weight:bold">${song.title}</div>
            <div style="font-size: 10px; color: #666">${song.artist}</div>
        </div>
    `;
    module.onclick = () => bootTrack(song);
    songGrid.appendChild(module);
});

// YT API Loader
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player('yt-engine', {
        height: '0', width: '0',
        events: { 'onStateChange': onStateChange }
    });
}

function bootTrack(song) {
    player.loadVideoById(song.id);
    document.getElementById('core-title').innerText = song.title;
    document.getElementById('core-artist').innerText = song.artist;
    
    const thumb = document.getElementById('core-thumb');
    thumb.src = `https://img.youtube.com/vi/${song.id}/default.jpg`;
    thumb.classList.remove('hidden');
    
    masterToggle.innerText = 'PAUSE';
}

function onStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        updateCore();
    }
}

function updateCore() {
    setInterval(() => {
        if (player && player.getDuration) {
            const p = (player.getCurrentTime() / player.getDuration()) * 100;
            document.getElementById('load-progress').style.width = p + "%";
        }
    }, 1000);
}

masterToggle.onclick = () => {
    const state = player.getPlayerState();
    if (state === 1) {
        player.pauseVideo();
        masterToggle.innerText = 'RESUME';
    } else {
        player.playVideo();
        masterToggle.innerText = 'PAUSE';
    }
};
