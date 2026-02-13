let songs = [
"h13lbNkUaEg","sf7VoyW_5ro","EtGh9oC2SZ0","yh3C2JU-m_Y",
"1PxT9i4-uTc","Q-_cu_78eIA","0pVMxbQh-Lc","NeXbmEnpSz0",
"palMj0iq-3g","LbrJZgyqp5w","vipdDXKHT_0","ElIizBi-rEc",
"DL8BsPDe4ck","N5BmQz4AmFI","CQSzGF9VAak","pPGcYXZhCPY",
"YjoKyFJf4CU","aorAeMA06i0","vmu53OX935A","wc-pzBaSiPA",
"PMzTLWTWLZU","g5O5ufz8w34","5Eqb_-j3FDA","uXgzCjAv-9k",
"Zu6z3qUPu1s","sX4Bxks_VlI","hoNb6HuNmU0","LK7-_dgAVQE",
"Pm7sWFzcPes","yu8nxs1gw48","wiur_AGatGU","LAdp3ZHeP4Q",
"rUeyfai1ddc","FCDAnPFJUPA","AN8-o7ckg6k"
];

let currentIndex = 0;
let player;
let repeat = 0; // 0 off, 1 all, 2 one

const list = document.getElementById("songList");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const loader = document.getElementById("loader");

songs.forEach((id,index)=>{
    const card = document.createElement("div");
    card.className="song-card";
    card.innerHTML=`
    <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg">
    <p>Song ${index+1}</p>
    `;
    card.onclick=()=>playSong(index);
    list.appendChild(card);
});

function onYouTubeIframeAPIReady(){
    player = new YT.Player('youtubePlayer',{
        height:'0',
        width:'0',
        videoId:songs[0],
        playerVars:{controls:0},
        events:{
            'onStateChange':onStateChange
        }
    });
}

function playSong(index){
    loader.style.display="flex";
    currentIndex=index;
    player.loadVideoById(songs[index]);
    cover.src=`https://img.youtube.com/vi/${songs[index]}/hqdefault.jpg`;
    title.innerText="Song "+(index+1);
}

function onStateChange(event){
    if(event.data==YT.PlayerState.PLAYING){
        loader.style.display="none";
        document.getElementById("playBtn").innerText="⏸";
    }
    if(event.data==YT.PlayerState.ENDED){
        if(repeat==2){
            playSong(currentIndex);
        }else if(repeat==1){
            nextSong();
        }
    }
}

function togglePlay(){
    if(player.getPlayerState()==1){
        player.pauseVideo();
        document.getElementById("playBtn").innerText="▶";
    }else{
        player.playVideo();
        document.getElementById("playBtn").innerText="⏸";
    }
}

function nextSong(){
    currentIndex=(currentIndex+1)%songs.length;
    playSong(currentIndex);
}

function prevSong(){
    currentIndex=(currentIndex-1+songs.length)%songs.length;
    playSong(currentIndex);
}

function shuffleSongs(){
    songs.sort(()=>Math.random()-0.5);
    alert("Playlist Shuffled 🔀");
}

function repeatMode(){
    repeat=(repeat+1)%3;
    if(repeat==0) alert("Repeat Off");
    if(repeat==1) alert("Repeat All");
    if(repeat==2) alert("Repeat One");
}

function toggleTheme(){
    document.body.classList.toggle("light");
}