let songs=[
"h13lbNkUaEg","sf7VoyW_5ro","EtGh9oC2SZ0","yh3C2JU-m_Y",
"1PxT9i4-uTc","Q-_cu_78eIA","0pVMxbQh-Lc","NeXbmEnpSz0",
"palMj0iq-3g","LbrJZgyqp5w","vipdDXKHT_0","ElIizBi-rEc"
];

// ADD MORE LIKE THIS:
// songs.push("VIDEO_ID");

let currentIndex=0;
let player;
let repeat=0;

const list=document.getElementById("songList");
const cover=document.getElementById("cover");
const title=document.getElementById("title");
const miniCover=document.getElementById("miniCover");
const miniTitle=document.getElementById("miniTitle");
const loader=document.getElementById("loader");

function createPlaylist(){
  list.innerHTML="";
  songs.forEach((id,index)=>{
    const card=document.createElement("div");
    card.className="song-card";
    card.innerHTML=`
      <img src="https://img.youtube.com/vi/${id}/hqdefault.jpg">
      <p>Song ${index+1}</p>
    `;
    card.onclick=()=>playSong(index);
    list.appendChild(card);
  });
}

createPlaylist();

function onYouTubeIframeAPIReady(){
  player=new YT.Player('youtubePlayer',{
    height:'0',
    width:'0',
    videoId:songs[0],
    playerVars:{controls:0},
    events:{'onStateChange':onStateChange}
  });
}

function playSong(index){
  loader.style.display="flex";
  currentIndex=index;
  player.loadVideoById(songs[index]);

  let img=`https://img.youtube.com/vi/${songs[index]}/hqdefault.jpg`;
  cover.src=img;
  miniCover.src=img;
  title.innerText="Song "+(index+1);
  miniTitle.innerText="Song "+(index+1);

  openPlayer();
}

function onStateChange(event){
  if(event.data==YT.PlayerState.PLAYING){
    loader.style.display="none";
    document.getElementById("playBtn").innerText="⏸";
    document.getElementById("miniPlay").innerText="⏸";
  }
}

function togglePlay(){
  if(player.getPlayerState()==1){
    player.pauseVideo();
    document.getElementById("playBtn").innerText="▶";
    document.getElementById("miniPlay").innerText="▶";
  }else{
    player.playVideo();
    document.getElementById("playBtn").innerText="⏸";
    document.getElementById("miniPlay").innerText="⏸";
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
  createPlaylist();
  alert("Playlist Shuffled 🔀");
}

function repeatMode(){
  repeat=(repeat+1)%3;
  alert("Repeat Mode: "+repeat);
}

function openPlayer(){
  document.getElementById("fullPlayer").classList.add("active");
}

function closePlayer(){
  document.getElementById("fullPlayer").classList.remove("active");
}

/* Search */
document.getElementById("searchBar").addEventListener("input",function(){
  let value=this.value.toLowerCase();
  let cards=document.querySelectorAll(".song-card");

  cards.forEach((card,index)=>{
    if(("song "+(index+1)).toLowerCase().includes(value)){
      card.style.display="flex";
    }else{
      card.style.display="none";
    }
  });
});

/* Swipe */
let touchStartX=0;
let touchEndX=0;

document.getElementById("fullPlayer").addEventListener("touchstart",e=>{
  touchStartX=e.changedTouches[0].screenX;
});

document.getElementById("fullPlayer").addEventListener("touchend",e=>{
  touchEndX=e.changedTouches[0].screenX;
  if(touchEndX < touchStartX-50) nextSong();
  if(touchEndX > touchStartX+50) prevSong();
});
