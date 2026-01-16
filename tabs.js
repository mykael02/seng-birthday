// ---------------------------
// Tabs + Swipe Between Tabs
// (separate file)
// ---------------------------
const tabs = ["stories", "pics", "videos", "game"];
let currentTabIndex = 0;

const navButtons = Array.from(document.querySelectorAll("nav button"));

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

function showTab(id) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  const el = document.getElementById(id);
  if (!el) return;

  el.classList.add("active");
  currentTabIndex = tabs.indexOf(id);

  // visual active state on buttons
  navButtons.forEach((b) => b.classList.toggle("active", b.dataset.tab === id));
}

// Set initial active button
showTab(tabs[currentTabIndex]);

// Global tab swipe (disabled inside story viewer)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener(
  "touchstart",
  (e) => {
    if (e.target.closest("#storyViewer")) return;
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (e) => {
    if (e.target.closest("#storyViewer")) return;
    touchEndX = e.changedTouches[0].screenX;
    handleTabSwipe();
  },
  { passive: true }
);

function handleTabSwipe() {
  // keep this behavior if you want Stories to be “locked” like IG
  if (tabs[currentTabIndex] === "stories") return;

  const swipeDistance = touchEndX - touchStartX;
  if (Math.abs(swipeDistance) < 50) return;

  if (swipeDistance < 0) {
    currentTabIndex = Math.min(currentTabIndex + 1, tabs.length - 1);
  } else {
    currentTabIndex = Math.max(currentTabIndex - 1, 0);
  }

  showTab(tabs[currentTabIndex]);
}
