// ---------------------------
// IG-style Stories
// ---------------------------
const storyItems = [
  { type: "text", value: "Happy Birthday Seng 🎉\nToday is YOUR day", duration: 3500 },
  { type: "text", value: "You’re amazing ✨\nKeep shining!", duration: 3500 },
  { type: "text", value: "Wishing you joy, more wins 🎂", duration: 3500 },

  // Optional media examples:
  // { type: "image", value: "images/1.jpg", duration: 4500 },
  // { type: "video", value: "videos/1.mp4", duration: 8000 },
];

const viewer = document.getElementById("storyViewer");
const content = document.getElementById("storyContent");
const progress = document.getElementById("storyProgress");
const timeEl = document.getElementById("storyTime");
const tapLeft = document.getElementById("tapLeft");
const tapRight = document.getElementById("tapRight");

let storyIndex = 0;
let timer = null;
let raf = null;
let isPaused = false;
let startTs = 0;
let elapsedBeforePause = 0;

buildProgressBars();
renderStory(storyIndex);
playStory();

// Tap zones
tapLeft.addEventListener("click", prevStory);
tapRight.addEventListener("click", nextStory);

// Hold to pause (mouse + touch)
["mousedown", "touchstart"].forEach((ev) => {
  viewer.addEventListener(ev, () => pauseStory(true), { passive: true });
});
["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((ev) => {
  viewer.addEventListener(ev, () => pauseStory(false), { passive: true });
});

// Swipe inside story viewer (left/right)
let sx = 0, ex = 0;
viewer.addEventListener("touchstart", (e) => {
  sx = e.changedTouches[0].screenX;
}, { passive: true });

viewer.addEventListener("touchend", (e) => {
  ex = e.changedTouches[0].screenX;
  const dx = ex - sx;
  if (Math.abs(dx) < 50) return;
  if (dx < 0) nextStory();
  else prevStory();
}, { passive: true });

function buildProgressBars() {
  progress.innerHTML = "";
  for (let i = 0; i < storyItems.length; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    const fill = document.createElement("div");
    fill.className = "fill";
    bar.appendChild(fill);
    progress.appendChild(bar);
  }
}

function setProgress(i, pct) {
  const bars = progress.querySelectorAll(".fill");
  bars.forEach((f, idx) => {
    if (idx < i) f.style.width = "100%";
    else if (idx > i) f.style.width = "0%";
    else f.style.width = `${pct}%`;
  });
}

function renderStory(i) {
  const item = storyItems[i];
  content.innerHTML = "";
  timeEl.textContent = "now";

  const slide = document.createElement("div");
  slide.className = "story-slide";

  if (item.type === "text") {
    slide.style.whiteSpace = "pre-line";
    slide.textContent = item.value;
  } else if (item.type === "image") {
    const img = document.createElement("img");
    img.src = item.value;
    img.alt = "Story image";
    slide.style.padding = "0";
    slide.appendChild(img);
  } else if (item.type === "video") {
    const v = document.createElement("video");
    v.src = item.value;
    v.playsInline = true;
    v.muted = true; // allow autoplay on mobile
    v.autoplay = true;
    v.loop = false;
    v.controls = false;
    slide.style.padding = "0";
    slide.appendChild(v);
  }

  content.appendChild(slide);
  setProgress(i, 0);
}

function playStory() {
  clearTimers();
  isPaused = false;
  elapsedBeforePause = 0;
  startTs = performance.now();
  const duration = storyItems[storyIndex].duration ?? 3500;

  const vid = content.querySelector("video");
  if (vid) {
    vid.currentTime = 0;
    vid.play().catch(() => {});
    vid.onloadedmetadata = () => {
      const ms = Math.max(2000, Math.min(20000, vid.duration * 1000));
      runProgress(ms);
    };
    runProgress(duration);
  } else {
    runProgress(duration);
  }
}

function runProgress(duration) {
  clearTimers();
  startTs = performance.now();

  const tick = (now) => {
    if (isPaused) {
      raf = requestAnimationFrame(tick);
      return;
    }
    const elapsed = now - startTs + elapsedBeforePause;
    const pct = Math.min(100, (elapsed / duration) * 100);
    setProgress(storyIndex, pct);

    if (pct >= 100) {
      nextStory();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  timer = setTimeout(() => nextStory(), duration);
}

function pauseStory(shouldPause) {
  if (shouldPause && !isPaused) {
    isPaused = true;
    elapsedBeforePause += performance.now() - startTs;
    const vid = content.querySelector("video");
    if (vid) vid.pause();
    clearTimers(false);
  } else if (!shouldPause && isPaused) {
    isPaused = false;
    startTs = performance.now();
    const vid = content.querySelector("video");
    if (vid) vid.play().catch(() => {});
  }
}

function nextStory() {
  storyIndex = Math.min(storyIndex + 1, storyItems.length - 1);
  renderStory(storyIndex);
  playStory();
}

function prevStory() {
  storyIndex = Math.max(storyIndex - 1, 0);
  renderStory(storyIndex);
  playStory();
}

function clearTimers(cancelRaf = true) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (cancelRaf && raf) {
    cancelAnimationFrame(raf);
    raf = null;
  }
}

// ---------------------------
// Pictures (BIG Carousel)
// ---------------------------
// Put your real filenames here (must exist in /images)
const images = ["1.jpg", "2.jpg", "3.jpg"];

const track = document.getElementById("carTrack");
const dotsWrap = document.getElementById("carDots");
const carousel = document.getElementById("imageCarousel");
const btnPrev = carousel.querySelector(".prev");
const btnNext = carousel.querySelector(".next");

let carIndex = 0;

function buildCarousel() {
  track.innerHTML = "";
  dotsWrap.innerHTML = "";

  images.forEach((src, i) => {
    // slide
    const slide = document.createElement("div");
    slide.className = "car-slide";

    const img = document.createElement("img");
    img.src = "images/" + src;
    img.alt = `Picture ${i + 1}`;
    img.loading = "lazy";

    slide.appendChild(img);
    track.appendChild(slide);

    // dot
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.ariaLabel = `Go to image ${i + 1}`;
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  updateDots();
  goTo(0, true);
}

function goTo(i, instant = false) {
  carIndex = Math.max(0, Math.min(i, images.length - 1));
  const slideWidth = track.clientWidth; // track is same width as viewport
  track.scrollTo({
    left: slideWidth * carIndex,
    behavior: instant ? "auto" : "smooth",
  });
  updateDots();
}

function updateDots() {
  const dots = dotsWrap.querySelectorAll(".dot");
  dots.forEach((d, i) => d.classList.toggle("active", i === carIndex));
}

btnPrev.addEventListener("click", () => goTo(carIndex - 1));
btnNext.addEventListener("click", () => goTo(carIndex + 1));

// keep index in sync if user swipes/scrolls
let scrollTimer = null;
track.addEventListener("scroll", () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const slideWidth = track.clientWidth;
    const newIndex = Math.round(track.scrollLeft / slideWidth);
    if (newIndex !== carIndex) {
      carIndex = newIndex;
      updateDots();
    }
  }, 80);
});

// rebuild on resize so snapping stays perfect
window.addEventListener("resize", () => goTo(carIndex, true));

buildCarousel();

// ---------------------------
// Videos
// ---------------------------
const videos = ["1.mp4", "2.mp4"];
const vgrid = document.getElementById("videoGrid");
vgrid.innerHTML = "";
videos.forEach((src) => {
  const v = document.createElement("video");
  v.src = "videos/" + src;
  v.controls = true;
  vgrid.appendChild(v);
});

// ---------------------------
// Mini Game
// ---------------------------
let score = 0;
document.getElementById("startGame").onclick = () => {
  score = 0;
  const arena = document.getElementById("arena");
  arena.innerHTML = "";
  document.getElementById("score").innerText = score;

  for (let i = 0; i < 10; i++) {
    const b = document.createElement("div");
    b.innerText = "🎈";
    b.style.fontSize = "40px";
    b.style.display = "inline-block";
    b.style.cursor = "pointer";
    b.style.userSelect = "none";
    b.onclick = () => {
      score++;
      document.getElementById("score").innerText = score;
      b.remove();
    };
    arena.appendChild(b);
  }
};

// ---------------------------
// Confetti (physics, background, interactive) - NO BURST
// ---------------------------
(() => {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  const ctx = canvas.getContext("2d", { alpha: true });

  const TARGET = 140;
  const GRAVITY = 0.14;
  const DRAG = 0.75;
  const BASE_WIND = 0.02;
  const INFLUENCE_R = 160;

  let w = 0, h = 0, dpr = 1;
  const parts = [];

  const ptr = { x: 0, y: 0, vx: 0, vy: 0, active: false, _t: 0, _x: 0, _y: 0 };

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(p) {
    p.x = Math.random() * w;
    p.y = -20 - Math.random() * h;
    p.vx = (Math.random() - 0.5) * 0.8;
    p.vy = Math.random() * 1.2;
    p.s = 3 + Math.random() * 5;
    p.r = Math.random() * Math.PI * 2;
    p.vr = (Math.random() - 0.5) * 0.25;
    p.hue = Math.random() * 360;
    p.shape = Math.random() < 0.55 ? 0 : 1; // 0=rect, 1=tri
  }

  function ensureCount() {
    while (parts.length < TARGET) {
      const p = {};
      spawn(p);
      parts.push(p);
    }
  }

  function setPointer(x, y) {
    const now = performance.now();
    if (ptr._t) {
      const dt = Math.max(1, now - ptr._t);
      ptr.vx = (x - ptr._x) / dt; // px per ms
      ptr.vy = (y - ptr._y) / dt;
    }
    ptr.x = x;
    ptr.y = y;
    ptr._x = x;
    ptr._y = y;
    ptr._t = now;
  }

  window.addEventListener("mousemove", (e) => {
    ptr.active = true;
    setPointer(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    ptr.active = false;
  }, { passive: true });

  window.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    if (!t) return;
    ptr.active = true;
    setPointer(t.clientX, t.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    ptr.active = true;
    setPointer(t.clientX, t.clientY);
  }, { passive: true });

  window.addEventListener("touchend", () => {
    ptr.active = false;
  }, { passive: true });

  window.addEventListener("resize", resize, { passive: true });

  function draw(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = `hsla(${p.hue},100%,60%,0.95)`;

    if (p.shape === 0) {
      ctx.fillRect(-p.s * 0.6, -p.s * 0.35, p.s * 1.2, p.s * 0.7);
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -p.s * 0.7);
      ctx.lineTo(p.s * 0.6, p.s * 0.6);
      ctx.lineTo(-p.s * 0.6, p.s * 0.6);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  function step(t) {
    ctx.clearRect(0, 0, w, h);

    const windWave = Math.sin(t * 0.0006) * 0.03;

    for (const p of parts) {
      // base forces
      p.vy += GRAVITY;
      p.vx += BASE_WIND + windWave;

      // pointer influence (push + swirl + "follow" based on movement)
      if (ptr.active) {
        const dx = p.x - ptr.x;
        const dy = p.y - ptr.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < INFLUENCE_R) {
          const f = (1 - dist / INFLUENCE_R);

          // push away from pointer
          p.vx += (dx / dist) * 0.35 * f;
          p.vy += (dy / dist) * 0.18 * f;

          // swirl around pointer
          p.vx += (-dy / dist) * 0.18 * f;
          p.vy += (dx / dist) * 0.08 * f;

          // follow pointer movement
          p.vx += (ptr.vx * 18) * f;
          p.vy += (ptr.vy * 18) * f;
        }
      }

      // integrate
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;

      // wrap/respawn
      if (p.y > h + 30) spawn(p);
      if (p.x < -40) p.x = w + 40;
      if (p.x > w + 40) p.x = -40;

      draw(p);
    }

    requestAnimationFrame(step);
  }

  resize();
  ensureCount();
  requestAnimationFrame(step);
})();

// Backwards-compat: older code may still call confetti(); keep it as a no-op.
function confetti() {}
