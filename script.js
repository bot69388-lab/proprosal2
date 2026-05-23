// Romantic Love Confession - Core Interactivity

// Music Configuration
const MUSIC_URL = "https://assets.mixkit.co/music/preview/mixkit-delicate-relationship-24.mp3";
let audio = null;
let isMusicPlaying = false;

// Names and state
let herName = "";
let hisName = "";
let noClickCount = 0;

// Initialize when DOM loads
window.addEventListener("DOMContentLoaded", () => {
  // Spawn continuous hearts
  setInterval(createFloatingHeart, 350);
  
  // Set up event listeners
  setupMusicPlayer();
  setupLoginForm();
  setupProposalButtons();
  setupJourneyGallery();

  // Highlight initial nav indicator for Page 1
  updateNavIndicators(1);
});

// 1. FLOATING HEARTS SYSTEM
function createFloatingHeart() {
  // Limit max floating hearts to keep performance ultra-smooth
  const activeHearts = document.querySelectorAll(".floating-heart");
  if (activeHearts.length > 40) return;

  const heart = document.createElement("div");
  heart.className = "floating-heart";
  
  // Array of cute symbols
  const heartTypes = ["❤", "💖", "💝", "💕", "🌸", "💌", "✨"];
  heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
  
  // Style configurations
  const startX = Math.random() * window.innerWidth;
  const size = Math.random() * (2.2 - 0.8) + 0.8; // size range 0.8rem to 2.2rem
  const duration = Math.random() * (8 - 4) + 4; // duration 4s to 8s
  const swayX = (Math.random() * 200 - 100) + "px"; // sway width between -100px and 100px
  
  heart.style.left = startX + "px";
  heart.style.fontSize = size + "rem";
  heart.style.animationDuration = duration + "s";
  heart.style.setProperty("--sway-x", swayX);
  
  // Soft pink-red hues randomly
  const heartColors = [
    "rgba(255, 71, 126, 0.85)", 
    "rgba(255, 133, 161, 0.9)", 
    "rgba(255, 182, 193, 0.9)", 
    "rgba(255, 74, 150, 0.85)",
    "rgba(201, 24, 74, 0.75)"
  ];
  heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
  
  document.body.appendChild(heart);
  
  // Self-remove after animation
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

// 2. BACKGROUND SOUNDPLAYER SYSTEM
function setupMusicPlayer() {
  audio = new Audio(MUSIC_URL);
  audio.loop = true;
  
  const musicToggleBtn = document.getElementById("music-toggle-btn");
  if (!musicToggleBtn) return;
  
  musicToggleBtn.addEventListener("click", () => {
    toggleMusic();
  });
  
  // Play on any user click on the document once (browser autoplay bypass)
  const startAutoplay = () => {
    if (!isMusicPlaying) {
      playMusic();
    }
    document.removeEventListener("click", startAutoplay);
  };
  document.addEventListener("click", startAutoplay);
}

function playMusic() {
  if (!audio) return;
  audio.play()
    .then(() => {
      isMusicPlaying = true;
      const toggleIcon = document.getElementById("music-toggle-icon");
      if (toggleIcon) toggleIcon.innerHTML = "🎵";
      document.getElementById("music-toggle-btn").classList.add("heartbeat-animation");
      spawnMusicNotes();
    })
    .catch(err => console.log("User interaction required to play music first: ", err));
}

function pauseMusic() {
  if (!audio) return;
  audio.pause();
  isMusicPlaying = false;
  const toggleIcon = document.getElementById("music-toggle-icon");
  if (toggleIcon) toggleIcon.innerHTML = "🔇";
  document.getElementById("music-toggle-btn").classList.remove("heartbeat-animation");
}

function toggleMusic() {
  if (isMusicPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

// Spawns visual music notes drifting from top right
function spawnMusicNotes() {
  if (!isMusicPlaying) return;
  
  const btn = document.getElementById("music-toggle-btn");
  if (!btn) return;
  
  const rect = btn.getBoundingClientRect();
  const note = document.createElement("div");
  note.className = "music-note";
  note.innerHTML = ["♫", "♪", "♩", "♬"][Math.floor(Math.random() * 4)];
  
  // Position near the button
  note.style.top = (rect.top + 20) + "px";
  note.style.right = (window.innerWidth - rect.right + 20) + "px";
  note.style.setProperty("--note-sway", (Math.random() * 60 - 30) + "px");
  
  document.body.appendChild(note);
  
  setTimeout(() => {
    note.remove();
  }, 2000);
  
  // Continue spawning notes occasionally while music is live
  setTimeout(spawnMusicNotes, 1500);
}

// 3. PAGE ROUTING SYSTEM
function navigateToPage(pageIndex) {
  const pages = document.querySelectorAll(".page");
  
  // Fade out active page
  const activePage = document.querySelector(".page.active");
  if (activePage) {
    activePage.classList.remove("active");
  }
  
  // Update theme indicators dynamically
  updateNavIndicators(pageIndex);
  
  // Gentle delay to allow transition before displaying next page
  setTimeout(() => {
    const targetPage = document.getElementById(`page-${pageIndex}`);
    if (targetPage) {
      targetPage.classList.add("active");
      
      // Personalized greetings / names if computed
      if (pageIndex === 3) {
        fadeInLoveLetter();
      }
    }
  }, 400);
}

function updateNavIndicators(pageIndex) {
  for (let i = 1; i <= 3; i++) {
    const ind = document.getElementById(`indicator-${i}`);
    if (!ind) continue;
    const dot = ind.querySelector(".indicator-dot");
    if (i === pageIndex) {
      ind.classList.remove("text-[#ff4d6d]/40");
      ind.classList.add("text-[#ff4d6d]");
      if (dot) {
        dot.classList.remove("bg-transparent");
        dot.classList.add("bg-[#ff4d6d]");
      }
    } else {
      ind.classList.add("text-[#ff4d6d]/40");
      ind.classList.remove("text-[#ff4d6d]");
      if (dot) {
        dot.classList.add("bg-transparent");
        dot.classList.remove("bg-[#ff4d6d]");
      }
    }
  }
}

// 4. PAGE 1 - LOGIN
function setupLoginForm() {
  const loginForm = document.getElementById("login-form");
  const herNameInput = document.getElementById("her-name");
  const hisNameInput = document.getElementById("his-name");
  const passwordInput = document.getElementById("lock-passcode");
  const loginErrorMsg = document.getElementById("login-error-msg");
  
  if (!loginForm) return;
  
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    herName = herNameInput.value.trim();
    hisName = hisNameInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Exact password check is 1208
    if (password === "1208") {
      loginErrorMsg.classList.add("hidden");
      
      // Update heading dynamically on page 2 for high touch personalization
      const proposalHeading = document.getElementById("proposal-heading");
      if (proposalHeading && herName) {
        proposalHeading.innerHTML = `I love you, my jaan ${herName}! ❤️`;
      }
      
      // Attempt to play music since user interacted by submit
      playMusic();
      showToast("Access granted... ❤️");
      navigateToPage(2);
    } else {
      // Small cute warning errors
      loginErrorMsg.classList.remove("hidden");
      loginErrorMsg.classList.add("animate-bounce");
      passwordInput.classList.add("border-red-400", "glow-pulsing-border");
      
      const cuteWarns = [
        "Oopsie! Wrong passcode, my love! ❤️ Please try again.",
        "That's not it, boo! Keep guessing carefully... 🤔",
        "Incorrect, my jaan! Let's try another combination! 😉",
        "Incorrect passcode! The lock is guarded with pure love! ❤️"
      ];
      loginErrorMsg.innerText = cuteWarns[Math.floor(Math.random() * cuteWarns.length)];
      
      setTimeout(() => {
        loginErrorMsg.classList.remove("animate-bounce");
      }, 1000);
    }
  });

  // Remove red glow once typing resets
  passwordInput.addEventListener("input", () => {
    passwordInput.classList.remove("border-red-400", "glow-pulsing-border");
  });
}

// 5. PAGE 2 - PROPOSAL
function setupProposalButtons() {
  const yesBtn = document.getElementById("proposal-yes-btn");
  const noBtn = document.getElementById("proposal-no-btn");
  const proposalCatSvg = document.getElementById("proposal-cat-svg");
  const proposalTitleSub = document.getElementById("proposal-subtitle");
  
  if (!yesBtn || !noBtn) return;
  
  // Playful Moving and Shrinking "NO" Button
  const handleNoButtonAction = () => {
    noClickCount++;
    
    // Shrink the button scale with each try
    const scale = Math.max(0.15, 1 - noClickCount * 0.15);
    
    // Playful random translates
    const maxOffset = noClickCount * 25; // drifts further each time!
    const randomX = (Math.random() - 0.5) * maxOffset * 2.5;
    const randomY = (Math.random() - 0.5) * maxOffset * 1.5;
    
    noBtn.style.transform = `scale(${scale}) translate(${randomX}px, ${randomY}px)`;
    noBtn.style.position = "relative";
    noBtn.style.zIndex = "5";
    
    // Switch up button styles slightly / text changes
    const funnyTexts = [
      "NO 💔",
      "Are you sure? 🥹",
      "Think again! 😢",
      "Please baby... 🙏",
      "Booboo please? ❤️",
      "You can't click this! 😜",
      "Only YES allowed! 😘"
    ];
    noBtn.innerText = funnyTexts[Math.min(noClickCount, funnyTexts.length - 1)];
    
    // Gradually enlarge YES button as reward!
    const yesScale = 1 + noClickCount * 0.15;
    yesBtn.style.transform = `scale(${yesScale})`;
    
    // If clicked too much, disappear completely
    if (noClickCount >= 7) {
      noBtn.style.display = "none";
      showToast("Hehe! The NO button ran away! You can only say YES now! ❤️");
    }
  };

  // Shrink and fly on hover (on desktop) and click (for mobile)
  noBtn.addEventListener("mouseover", () => {
    // Only escape if not clicked clean out
    if (noClickCount < 7) {
      handleNoButtonAction();
    }
  });
  
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (noClickCount < 7) {
      handleNoButtonAction();
    }
  });
  
  // "YES" Click - Explosive Happiness
  yesBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    // 1. Core explosion trigger
    triggerHeartExplosion(e);
    
    // 2. Change Cat representation to extremely happy state
    if (proposalCatSvg) {
      proposalCatSvg.classList.add("cat-happy");
      const eyesGroup = document.getElementById("cat-eyes-group");
      if (eyesGroup) {
        // Change regular eyes to loving pulsing pink hearts!
        eyesGroup.innerHTML = `
          <!-- Left Heart Eye -->
          <g transform="translate(53, 62) scale(0.8)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff4d6d" />
          </g>
          <!-- Right Heart Eye -->
          <g transform="translate(103, 62) scale(0.8)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff4d6d" />
          </g>
        `;
      }
    }
    
    // 3. Cute success text feedback
    if (proposalTitleSub) {
      proposalTitleSub.innerHTML = "<span class='text-2xl font-bold text-red-500 glow-pink-text block animate-bounce'>YAYYYYY ❤️ I am yours forever baby!</span>";
    }
    
    // Hide NO button entirely
    noBtn.style.display = "none";
    yesBtn.disabled = true;
    yesBtn.innerHTML = "My Jaan Said YES! ♥";
    yesBtn.style.transform = "scale(1.2)";
    yesBtn.classList.add("glow-pulsing-border");
    
    showToast("YAYYYYY! Best day ever! Starting love letter... 💖");
    
    // 4. Smooth automated transition to page 3 after 2.8s
    setTimeout(() => {
      navigateToPage(3);
    }, 2800);
  });
}

// 6. HEART BURST EXPLOSION (Page 2 Success)
function triggerHeartExplosion(event) {
  const burstCount = 35;
  const originX = event.clientX || window.innerWidth / 2;
  const originY = event.clientY || window.innerHeight / 2;
  
  for (let i = 0; i < burstCount; i++) {
    const explosionItem = document.createElement("div");
    explosionItem.className = "explosion-heart";
    
    const heartEmojis = ["❤", "💖", "💝", "💕", "💋", "🌸", "⭐"];
    explosionItem.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    
    // Random direction vector
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 220 + 80; // scatter radius
    const dx = Math.cos(angle) * distance + "px";
    const dy = Math.sin(angle) * distance + "px";
    
    const rotation = (Math.random() * 360) + "deg";
    
    explosionItem.style.left = originX + "px";
    explosionItem.style.top = originY + "px";
    explosionItem.style.setProperty("--dx", dx);
    explosionItem.style.setProperty("--dy", dy);
    explosionItem.style.setProperty("--rot", rotation);
    explosionItem.style.animationDuration = (Math.random() * 0.8 + 0.8) + "s";
    
    // Set random visual size
    explosionItem.style.fontSize = (Math.random() * 1.5 + 1) + "rem";
    
    document.body.appendChild(explosionItem);
    
    // Fade & delete
    setTimeout(() => {
      explosionItem.remove();
    }, 1600);
  }
}

// 7. PAGE 3 - LOVE LETTER FADE IN
function fadeInLoveLetter() {
  const container = document.getElementById("love-letter");
  if (!container) return;
  
  container.style.opacity = "0";
  container.style.transition = "opacity 2.5s ease-in-out";
  
  setTimeout(() => {
    container.style.opacity = "1";
    
    // Dynamic naming personalization if provided
    if (herName) {
      const salutation = document.getElementById("letter-salutation");
      if (salutation) {
        salutation.innerText = herName.toLowerCase();
      }
    }
  }, 100);
}

// Helper: Custom romantic toast alerts
function showToast(message) {
  let toast = document.getElementById("app-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "app-toast";
    toast.className = "toast-cute";
    document.body.appendChild(toast);
  }
  
  toast.innerHTML = message;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// 8. JOURNEY POLAROID GALLERY SYSTEM
function setupJourneyGallery() {
  const ourJourneyBtn = document.getElementById("our-journey-btn");
  const journeyOverlay = document.getElementById("journey-overlay");
  const closeJourneyBtn = document.getElementById("close-journey-btn");

  if (!ourJourneyBtn || !journeyOverlay || !closeJourneyBtn) return;

  ourJourneyBtn.addEventListener("click", () => {
    journeyOverlay.classList.add("show");
    showToast("Opening our memories... 💖📸");
  });

  closeJourneyBtn.addEventListener("click", () => {
    journeyOverlay.classList.remove("show");
  });

  // Close when clicking outside the modal content
  journeyOverlay.addEventListener("click", (e) => {
    if (e.target === journeyOverlay) {
      journeyOverlay.classList.remove("show");
    }
  });
}
