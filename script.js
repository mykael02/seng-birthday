// Tabs
document.querySelectorAll("nav button").forEach(btn=>{
  btn.onclick=()=>showTab(btn.dataset.tab)
});
function showTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Stories
const stories=[
  "Happy Birthday Seng 🎉",
  "You are amazing ✨",
  "Wishing you all the best! 🎂",
];
let i=0;
document.getElementById("stories").onclick=()=>{
  i=(i+1)%stories.length;
  document.getElementById("storyText").innerText=stories[i];
  confetti();
};

// Load images from images folder
const images=["1.jpg","2.jpg","3.jpg"];
const grid=document.getElementById("imageGrid");
images.forEach(src=>{
  const img=document.createElement("img");
  img.src="images/"+src;
  grid.appendChild(img);
});

// Load videos from videos folder
const videos=["1.mp4","2.mp4"];
const vgrid=document.getElementById("videoGrid");
videos.forEach(src=>{
  const v=document.createElement("video");
  v.src="videos/"+src;
  v.controls=true;
  vgrid.appendChild(v);
});

// Mini game
let score=0;
document.getElementById("startGame").onclick=()=>{
  score=0;
  const arena=document.getElementById("arena");
  arena.innerHTML="";
  for(let i=0;i<10;i++){
    const b=document.createElement("div");
    b.innerText="🎈";
    b.style.fontSize="40px";
    b.style.display="inline-block";
    b.onclick=()=>{
      score++;
      document.getElementById("score").innerText=score;
      b.remove();
    };
    arena.appendChild(b);
  }
};

// Confetti (simple)
function confetti(){
  const c=document.getElementById("confetti");
  const ctx=c.getContext("2d");
  c.width=innerWidth;c.height=innerHeight;
  for(let i=0;i<100;i++){
    ctx.fillStyle=`hsl(${Math.random()*360},100%,60%)`;
    ctx.fillRect(Math.random()*c.width,Math.random()*c.height,5,5);
  }
}
