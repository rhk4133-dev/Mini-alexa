const rawSongs = [
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

let songs = rawSongs.map((id,i)=>({
    name:"Song "+(i+1),
    file:id,
    img:"img"+(i+1)+".jpg"
}));

// Alphabetical
songs.sort((a,b)=>a.name.localeCompare(b.name));

let player,current=0,shuffle=false,repeat=false;

const grid=document.getElementById("songGrid");
const thumb=document.getElementById("thumb");
const title=document.getElementById("title");
const progress=document.getElementById("progress");
const loader=document.getElementById("loader");

function enterApp(){
document.getElementById("homePage").style.display="none";
document.getElementById("app").style.display="flex";
loadSongs();
}

function loadSongs(){
grid.innerHTML="";
songs.forEach((s,i)=>{
let div=document.createElement("div");
div.className="song";
div.innerHTML=`<img src="${s.img}" onerror="this.src='https://img.youtube.com/vi/${s.file}/hqdefault.jpg'"><h4>${s.name}</h4>`;
div.onclick=()=>playSong(i);
grid.appendChild(div);
});
}

function onYouTubeIframeAPIReady(){
player=new YT.Player("youtubePlayer",{height:'0',width:'0'});
}

function playSong(i){
loader.style.display="block";
current=i;
let s=songs[i];
player.loadVideoById(s.file);
thumb.src=s.img;
title.innerText=s.name;
setTimeout(()=>loader.style.display="none",1000);
}

function togglePlay(){
if(player.getPlayerState()==1){player.pauseVideo();}
else{player.playVideo();}
}

function nextSong(){
if(shuffle) current=Math.floor(Math.random()*songs.length);
else current=(current+1)%songs.length;
playSong(current);
}

function prevSong(){
current=(current-1+songs.length)%songs.length;
playSong(current);
}

function toggleShuffle(){shuffle=!shuffle;}
function toggleRepeat(){repeat=!repeat;}

setInterval(()=>{
if(player && player.getDuration){
let val=(player.getCurrentTime()/player.getDuration())*100;
progress.value=val;
}
},1000);

progress.oninput=()=>{
let seek=(progress.value/100)*player.getDuration();
player.seekTo(seek,true);
};

function toggleTheme(){
document.body.classList.toggle("light");
}

function searchSong(){
let q=document.getElementById("search").value.toLowerCase();
document.querySelectorAll(".song").forEach(s=>{
s.style.display=s.innerText.toLowerCase().includes(q)?"block":"none";
});
}