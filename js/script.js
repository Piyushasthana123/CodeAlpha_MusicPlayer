/**
 * ==============================================================================
 *  MUSIC CLONE - JAVASCRIPT AUDIO ENGINE (HTML5 Audio API)
 * ==============================================================================
 *  This JavaScript file controls the Music Player.
 *  It is structured cleanly and modularly for ease of understanding.
 *
 *  Key Features:
 *  1. HTML5 Audio API Controls (Play, Pause, Skip Next, Skip Previous)
 *  2. Dynamic Track Information (Title, Artist, Cover Image, Duration)
 *  3. Real-Time Seekbar Synchronization & User Seeking/Scrubbing
 *  4. Volume Control Logic (Slider + Mute/Unmute Toggle)
 *  5. Interactive Sidebar Playlist & Main Cards Click-to-Play
 * ==============================================================================
 */

// ==============================================================================
// 1. SONGS DATABASE
// List of all 13 songs from the 'songs' folder along with artist and cover details
// ==============================================================================
const DEFAULT_CARD_IMAGE = "assets/images/Default_card_image.png";

const songsList = [
    {
        id: 0,
        title: "Shape of You",
        artist: "Ed Sheeran",
        src: "songs/Ed Sheeran  Shape of You .mp3",
        cover: "https://thisismehul.com/wp-content/uploads/2017/01/ed-sheeran-shape-of-you-video-1485704997.jpg?w=640"
    },
    {
        id: 1,
        title: "Die With A Smile",
        artist: "Lady Gaga, Bruno Mars",
        src: "songs/Lady Gaga  Bruno Mars  Die With A Smile .mp3",
        cover: "https://ew.com/thmb/5fx__-L_JvEhhoUACWpOG4vTAuE=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc()/lady-gaga-die-with-a-smile-081524-2-2246dd22701c437fb3ea8aa3d218bc91.jpg"
    },
    {
        id: 2,
        title: "Faded",
        artist: "Alan Walker",
        src: "songs/Alan Walker   Faded.mp3",
        cover: DEFAULT_CARD_IMAGE
    },
    {
        id: 3,
        title: "Lovely",
        artist: "Billie Eilish, Khalid",
        src: "songs/Billie Eilish.mp3",
        cover: "https://i.ytimg.com/vi/V1Pl8CzNzCw/maxresdefault.jpg"
    },
    {
        id: 4,
        title: "Hey Mama",
        artist: "David Guetta ft. Nicki Minaj & Bebe Rexha",
        src: "songs/David Guetta  Hey Mama .mp3",
        cover: "https://i1.sndcdn.com/artworks-000141858942-z9lbh8-t500x500.jpg"
    },
    {
        id: 5,
        title: "Believer",
        artist: "Imagine Dragons",
        src: "songs/Imagine Dragons  Believer .mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b2735675e83f707f1d7271e5cf8a"
    },
    {
        id: 6,
        title: "Bones",
        artist: "Imagine Dragons",
        src: "songs/Imagine Dragons  Bones .mp3",
        cover: DEFAULT_CARD_IMAGE
    },
    {
        id: 7,
        title: "FRIENDS",
        artist: "Marshmello & Anne-Marie",
        src: "songs/Marshmello & Anne-Marie  FRIENDS .mp3",
        cover: "https://i1.sndcdn.com/artworks-000474540912-e5msg4-t500x500.jpg"
    },
    {
        id: 8,
        title: "No Lie",
        artist: "Sean Paul ft. Dua Lipa",
        src: "songs/Sean Paul No Lie ft. Dua Lipa.mp3",
        cover: "https://i.ytimg.com/vi/166tsC3RUcc/mqdefault.jpg"
    },
    {
        id: 9,
        title: "Safari",
        artist: "Serena",
        src: "songs/Serena .mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b273909182bf113b1980e97cfbfa"
    },
    {
        id: 10,
        title: "Waka Waka (This Time for Africa)",
        artist: "Shakira",
        src: "songs/Shakira  Waka Waka .mp3",
        cover: DEFAULT_CARD_IMAGE
    },
    {
        id: 11,
        title: "Unstoppable",
        artist: "Sia",
        src: "songs/Sia  Unstoppable .mp3",
        cover: DEFAULT_CARD_IMAGE
    },
    {
        id: 12,
        title: "Bad Boy",
        artist: "Tungevaag, Raaban",
        src: "songs/Tungevaag Raaban   Bad Boy.mp3",
        cover: "https://c.saavncdn.com/509/Bad-Boy-feat-Luana-Kiara--English-2018-20190607042030-500x500.jpg"
    }
];

// ==============================================================================
// 2. STATE & HTML5 AUDIO OBJECT
// ==============================================================================
// Main HTML5 Audio API instance
const currentAudio = new Audio();

// Player State Variables
let currentSongIndex = 0;       // Currently playing song index
let isPlaying = false;          // Whether audio is currently playing or paused
let lastVolume = 0.8;           // Previous volume level before muting (restored on unmute)
let isDraggingSeekbar = false;  // Flag indicating if user is dragging/scrubbing seekbar

// ==============================================================================
// 3. DOM ELEMENT SELECTORS
// ==============================================================================
// Audio Controls
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const playIcon = document.getElementById("playIcon");

// Track Information
const trackCover = document.getElementById("trackCover");
const trackTitle = document.getElementById("trackTitle");
const trackArtist = document.getElementById("trackArtist");

// Progress Bar / Seekbar & Timestamps
const seekbar = document.getElementById("seekbar");
const seekbarFill = document.getElementById("seekbarFill");
const seekbarCircle = document.getElementById("seekbarCircle");
const currentTimeEl = document.getElementById("currentTime");
const totalDurationEl = document.getElementById("totalDuration");

// Volume Controls
const volumeBtn = document.getElementById("volumeBtn");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volumeSlider");

// Sidebar Playlist Container
const playlistContainer = document.getElementById("playlist");

// ==============================================================================
// 4. SVG ICON PATHS (PLAY / PAUSE & VOLUME ICONS)
// ==============================================================================
// Play icon path (triangle)
const PLAY_ICON_PATH = "M64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320zM252.3 211.1C244.7 215.3 240 223.4 240 232L240 408C240 416.7 244.7 424.7 252.3 428.9C259.9 433.1 269.1 433 276.6 428.4L420.6 340.4C427.7 336 432.1 328.3 432.1 319.9C432.1 311.5 427.7 303.8 420.6 299.4L276.6 211.4C269.2 206.9 259.9 206.7 252.3 210.9z";

// Pause icon path (two vertical bars)
const PAUSE_ICON_PATH = "M320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64zM272 400C272 408.8 264.8 416 256 416H224C215.2 416 208 408.8 208 400V240C208 231.2 215.2 224 224 224H256C264.8 224 272 231.2 272 240V400zM432 400C432 408.8 424.8 416 416 416H384C375.2 416 368 408.8 368 400V240C368 231.2 375.2 224 384 224H416C424.8 224 432 231.2 432 240V400z";

// Volume Icon Paths
const VOL_HIGH_PATH = "M384 112c0-10.2-5.7-19.5-14.8-24.1s-20-3.7-28.3 2.3L197.3 208H128c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64h69.3L340.9 549.8c8.3 6.1 19.2 6.9 28.3 2.3s14.8-13.9 14.8-24.1V112zm80 80c-8.8-8.8-23.2-8.8-32 0s-8.8 23.2 0 32c39.8 39.8 39.8 104.2 0 144-8.8 8.8-8.8 23.2 0 32s23.2 8.8 32 0c57.6-57.6 57.6-150.4 0-208zm64-64c-8.8-8.8-23.2-8.8-32 0s-8.8 23.2 0 32c75 75 75 197 0 272-8.8 8.8-8.8 23.2 0 32s23.2 8.8 32 0c92.7-92.7 92.7-243.3 0-336z";
const VOL_LOW_PATH = "M384 112c0-10.2-5.7-19.5-14.8-24.1s-20-3.7-28.3 2.3L197.3 208H128c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64h69.3L340.9 549.8c8.3 6.1 19.2 6.9 28.3 2.3s14.8-13.9 14.8-24.1V112zm80 80c-8.8-8.8-23.2-8.8-32 0s-8.8 23.2 0 32c39.8 39.8 39.8 104.2 0 144-8.8 8.8-8.8 23.2 0 32s23.2 8.8 32 0c57.6-57.6 57.6-150.4 0-208z";
const VOL_MUTE_PATH = "M384 112c0-10.2-5.7-19.5-14.8-24.1s-20-3.7-28.3 2.3L197.3 208H128c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64h69.3L340.9 549.8c8.3 6.1 19.2 6.9 28.3 2.3s14.8-13.9 14.8-24.1V112zm45.3 125.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L441.4 295l-34.7 34.7c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l34.7-34.7 34.7 34.7c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L486.6 295l34.7-34.7c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0l-34.7 34.7-34.7-34.7z";

// ==============================================================================
// 5. HELPER FUNCTION: FORMAT TIME
// ==============================================================================
/**
 * Formats seconds into 'mm:ss' string
 * Example: 75 seconds -> "01:15"
 * @param {number} seconds
 * @returns {string}
 */
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    const formattedSecs = secs < 10 ? `0${secs}` : secs;
    return `${formattedMins}:${formattedSecs}`;
}

// ==============================================================================
// 6. LOAD SONG & UPDATE DYNAMIC TRACK INFO
// ==============================================================================
/**
 * Loads a song into the Audio API and updates track info across the UI
 * @param {number} index - Index of song in songsList
 * @param {boolean} shouldPlay - Whether to start playback immediately after loading
 */
function loadSong(index, shouldPlay = false) {
    // Boundary check: ensure index is within range
    if (index < 0 || index >= songsList.length) return;

    currentSongIndex = index;
    const currentSong = songsList[currentSongIndex];

    // Set HTML5 Audio source
    currentAudio.src = currentSong.src;

    // 1. Update dynamic track info (Title, Artist, Cover)
    if (trackTitle) trackTitle.textContent = currentSong.title;
    if (trackArtist) trackArtist.textContent = currentSong.artist;
    if (trackCover) {
        trackCover.src = currentSong.cover || DEFAULT_CARD_IMAGE;
        trackCover.alt = `${currentSong.title} cover`;
        trackCover.onerror = function () {
            this.onerror = null;
            this.src = DEFAULT_CARD_IMAGE;
        };
    }

    // Reset seekbar and timer displays
    updateSeekbarVisuals(0);
    if (currentTimeEl) currentTimeEl.textContent = "00:00";
    if (totalDurationEl) totalDurationEl.textContent = "00:00";

    // Display total duration when audio metadata is loaded
    currentAudio.onloadedmetadata = () => {
        if (totalDurationEl && !isNaN(currentAudio.duration)) {
            totalDurationEl.textContent = formatTime(currentAudio.duration);
        }
    };

    // Highlight active song in playlist and grid cards
    highlightActiveSong();

    // If shouldPlay is true, play the song immediately
    if (shouldPlay) {
        playSong();
        if (typeof closeMobileSidebar === "function" && window.innerWidth <= 1024) {
            closeMobileSidebar();
        }
    }
}

// ==============================================================================
// 7. AUDIO CONTROLS: PLAY, PAUSE, NEXT, PREVIOUS
// ==============================================================================
/**
 * Plays the current audio track
 */
function playSong() {
    currentAudio.play()
        .then(() => {
            isPlaying = true;
            updatePlayButtonIcon(true);
        })
        .catch((error) => {
            console.warn("Audio autoplay blocked by browser policy:", error);
        });
}

/**
 * Pauses audio playback
 */
function pauseSong() {
    currentAudio.pause();
    isPlaying = false;
    updatePlayButtonIcon(false);
}

/**
 * Toggles Play/Pause state (pause if playing, play if paused)
 */
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

/**
 * Skips to the next song
 * Loops back to index 0 if the last song is reached
 */
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songsList.length;
    loadSong(currentSongIndex, true);
}

/**
 * Skips to the previous song
 * Restarts song if played past 3 seconds; otherwise goes to previous track
 */
function prevSong() {
    if (currentAudio.currentTime > 3) {
        currentAudio.currentTime = 0;
    } else {
        currentSongIndex = (currentSongIndex - 1 + songsList.length) % songsList.length;
        loadSong(currentSongIndex, true);
    }
}

/**
 * Updates the Play/Pause button SVG icon
 * @param {boolean} isCurrentlyPlaying
 */
function updatePlayButtonIcon(isCurrentlyPlaying) {
    if (!playIcon) return;
    const path = playIcon.querySelector("path");
    if (path) {
        path.setAttribute("d", isCurrentlyPlaying ? PAUSE_ICON_PATH : PLAY_ICON_PATH);
    }
}

// ==============================================================================
// 8. SEEKBAR SYNCHRONIZATION & USER SCRUBBING
// ==============================================================================
/**
 * timeupdate fires continuously as audio plays
 * Synchronizes seekbar progress and timestamps in real time
 */
currentAudio.addEventListener("timeupdate", () => {
    // Prevent auto-update while the user is actively dragging the seekbar
    if (isDraggingSeekbar) return;

    const current = currentAudio.currentTime;
    const duration = currentAudio.duration;

    if (!isNaN(duration) && duration > 0) {
        const percent = (current / duration) * 100;
        updateSeekbarVisuals(percent);

        if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
        if (totalDurationEl) totalDurationEl.textContent = formatTime(duration);
    }
});

/**
 * Updates the visual width of the seekbar fill and position of the circle thumb
 * @param {number} percent - Percentage value between 0 and 100
 */
function updateSeekbarVisuals(percent) {
    const safePercent = Math.min(100, Math.max(0, percent));
    if (seekbarFill) seekbarFill.style.width = `${safePercent}%`;
    if (seekbarCircle) seekbarCircle.style.left = `${safePercent}%`;
}

/**
 * Seeks audio to the position clicked or dragged on the seekbar
 * @param {MouseEvent} event
 */
function seekAudio(event) {
    if (!seekbar || isNaN(currentAudio.duration)) return;

    const rect = seekbar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;

    // Calculate ratio relative to seekbar width (clamped between 0 and 1)
    const ratio = Math.min(1, Math.max(0, clickX / width));

    // Update audio current time and visuals
    currentAudio.currentTime = ratio * currentAudio.duration;
    updateSeekbarVisuals(ratio * 100);

    if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(currentAudio.currentTime);
    }
}

// 1. Single click to seek on seekbar
if (seekbar) {
    seekbar.addEventListener("click", seekAudio);

    // 2. Smooth scrubbing support (mousedown + mousemove)
    seekbar.addEventListener("mousedown", (e) => {
        isDraggingSeekbar = true;
        seekAudio(e);

        const onMouseMove = (moveEvent) => {
            if (isDraggingSeekbar) {
                seekAudio(moveEvent);
            }
        };

        const onMouseUp = () => {
            isDraggingSeekbar = false;
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    });
}

// ==============================================================================
// 9. VOLUME CONTROL & MUTE/UNMUTE LOGIC
// ==============================================================================
/**
 * Sets the audio volume (between 0 and 1) and updates slider and icon
 * @param {number|string} value
 */
function setVolume(value) {
    const vol = parseFloat(value);
    currentAudio.volume = vol;

    if (volumeSlider) {
        volumeSlider.value = vol;
    }

    if (vol > 0) {
        lastVolume = vol; // Store non-zero volume for restoring on unmute
    }

    updateVolumeIcon(vol);
}

/**
 * Updates volume SVG icon based on current volume level
 * @param {number} vol
 */
function updateVolumeIcon(vol) {
    if (!volumeIcon) return;
    const path = volumeIcon.querySelector("path");
    if (!path) return;

    if (vol === 0) {
        // Mute icon
        path.setAttribute("d", VOL_MUTE_PATH);
    } else if (vol < 0.5) {
        // Low volume icon
        path.setAttribute("d", VOL_LOW_PATH);
    } else {
        // High volume icon
        path.setAttribute("d", VOL_HIGH_PATH);
    }
}

/**
 * Toggles between muted and unmuted states
 */
function toggleMute() {
    if (currentAudio.volume > 0) {
        // Mute audio
        lastVolume = currentAudio.volume;
        setVolume(0);
    } else {
        // Unmute audio (restore previous volume level)
        setVolume(lastVolume > 0 ? lastVolume : 0.8);
    }
}

// Volume slider input event listener
if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
        setVolume(e.target.value);
    });
}

// Volume icon click event (Mute / Unmute toggle)
if (volumeBtn) {
    volumeBtn.addEventListener("click", toggleMute);
}

// ==============================================================================
// 10. AUTO-PLAY NEXT SONG ON TRACK END
// ==============================================================================
currentAudio.addEventListener("ended", () => {
    nextSong();
});

// ==============================================================================
// 11. DYNAMIC SIDEBAR PLAYLIST RENDERING
// ==============================================================================
/**
 * Populates the sidebar playlist dynamically from the songs database
 */
function renderSidebarPlaylist() {
    if (!playlistContainer) return;

    playlistContainer.innerHTML = ""; // Clear existing playlist items

    songsList.forEach((song, index) => {
        const item = document.createElement("div");
        item.className = "listcard1 song-item";
        item.setAttribute("data-index", index);

        item.innerHTML = `
            <img src="assets/icons/music.svg" alt="music icon" width="24px" style="flex-shrink:0;">
            <div class="info" style="flex:1; margin:0 10px;">
                <div class="song-title-text" style="font-weight:600; font-size:13px;">${song.title}</div>
                <div class="song-artist-text" style="font-size:11px; color:#b3b3b3;">${song.artist}</div>
            </div>
            <div class="playnow" style="display:flex; align-items:center; gap:6px;">
                <span style="font-size:12px; color:#b3b3b3;">Play</span>
                <img src="assets/icons/play.svg" alt="play button" width="18px">
            </div>
        `;

        // Play clicked song item
        item.addEventListener("click", () => {
            if (currentSongIndex === index && isPlaying) {
                pauseSong();
            } else {
                loadSong(index, true);
            }
        });

        playlistContainer.appendChild(item);
    });
}

/**
 * Highlights the active song in both sidebar playlist and main grid cards
 */
function highlightActiveSong() {
    // 1. Highlight active item in sidebar playlist
    const playlistItems = document.querySelectorAll(".playlist .listcard1");
    playlistItems.forEach((el, idx) => {
        if (idx === currentSongIndex) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });

    // 2. Highlight active card in main songs grid
    const songCards = document.querySelectorAll(".play .songcard");
    songCards.forEach((card, idx) => {
        if (idx === currentSongIndex) {
            card.classList.add("active");
        } else {
            card.classList.remove("active");
        }
    });
}

// ==============================================================================
// 12. MAIN GRID SONG CARD CLICK LISTENERS
// ==============================================================================
function setupSongCardClickListeners() {
    const songCards = document.querySelectorAll(".play .songcard");
    songCards.forEach((card, index) => {
        // Play corresponding song when card is clicked
        card.addEventListener("click", () => {
            // Safe index mapping to ensure valid song index
            const targetIndex = index < songsList.length ? index : (index % songsList.length);
            loadSong(targetIndex, true);
        });
    });
}

// ==============================================================================
// 13. KEYBOARD SHORTCUTS (UX ENHANCEMENT)
// ==============================================================================
window.addEventListener("keydown", (e) => {
    // Ignore shortcuts if the user is typing in a search input
    if (document.activeElement.tagName === "INPUT" && document.activeElement.type === "search") {
        return;
    }

    switch (e.code) {
        case "Space":
            e.preventDefault(); // Prevent page scroll on Spacebar
            togglePlayPause();
            break;
        case "ArrowRight":
            e.preventDefault();
            // Seek forward 5 seconds
            currentAudio.currentTime = Math.min(currentAudio.duration, currentAudio.currentTime + 5);
            break;
        case "ArrowLeft":
            e.preventDefault();
            // Seek backward 5 seconds
            currentAudio.currentTime = Math.max(0, currentAudio.currentTime - 5);
            break;
        case "ArrowUp":
            e.preventDefault();
            // Increase volume by 5%
            setVolume(Math.min(1, currentAudio.volume + 0.05));
            break;
        case "ArrowDown":
            e.preventDefault();
            // Decrease volume by 5%
            setVolume(Math.max(0, currentAudio.volume - 0.05));
            break;
        case "KeyM":
            toggleMute();
            break;
    }
});

// ==============================================================================
// 14. AUDIO CONTROL BUTTON EVENT LISTENERS
// ==============================================================================
if (playBtn) playBtn.addEventListener("click", togglePlayPause);
if (prevBtn) prevBtn.addEventListener("click", prevSong);
if (nextBtn) nextBtn.addEventListener("click", nextSong);

// ==============================================================================
// 15. MOBILE SIDEBAR DRAWER CONTROLS
// ==============================================================================
const sidebarContainer = document.getElementById("sidebarContainer");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const sidebarOverlay = document.getElementById("sidebarOverlay");

function openMobileSidebar() {
    if (sidebarContainer) sidebarContainer.classList.add("show");
    if (sidebarOverlay) sidebarOverlay.classList.add("show");
}

function closeMobileSidebar() {
    if (sidebarContainer) sidebarContainer.classList.remove("show");
    if (sidebarOverlay) sidebarOverlay.classList.remove("show");
}

if (hamburgerBtn) hamburgerBtn.addEventListener("click", openMobileSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeMobileSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeMobileSidebar);

// ==============================================================================
// 16. REAL-TIME SEARCH FILTERING
// ==============================================================================
const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();

        // 1. Filter song cards in main grid
        const songCards = document.querySelectorAll("#songsGrid .songcard");
        songCards.forEach((card) => {
            const titleEl = card.querySelector(".card-title");
            const artistEl = card.querySelector(".card-artist");
            const title = titleEl ? titleEl.textContent.toLowerCase() : "";
            const artist = artistEl ? artistEl.textContent.toLowerCase() : "";

            if (title.includes(query) || artist.includes(query)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });

        // 2. Filter items in sidebar playlist
        const listItems = document.querySelectorAll("#playlistContainer .listcard1");
        listItems.forEach((item) => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
    });
}

// ==============================================================================
// 17. ENSURE DEFAULT CARD IMAGES (FALLBACK HANDLING)
// ==============================================================================
function ensureCardImages() {
    const songCards = document.querySelectorAll(".play .songcard");

    songCards.forEach((card) => {
        let img = card.querySelector("img");
        if (!img) {
            // If card does not have an image tag, insert fallback image
            img = document.createElement("img");
            img.src = DEFAULT_CARD_IMAGE;
            img.alt = "Song Cover";
            const hoverEl = card.querySelector(".hover");
            if (hoverEl && hoverEl.nextSibling) {
                card.insertBefore(img, hoverEl.nextSibling);
            } else {
                card.prepend(img);
            }
        } else {
            // If image src is empty or invalid
            const src = img.getAttribute("src");
            if (!src || src.trim() === "" || src === "#") {
                img.src = DEFAULT_CARD_IMAGE;
            }
        }

        // Automatically replace broken image links with default cover
        img.onerror = function () {
            this.onerror = null;
            this.src = DEFAULT_CARD_IMAGE;
        };
    });
}

// ==============================================================================
// 18. INITIALIZATION (INIT FUNCTION)
// Initializes player components and audio state on page load
// ==============================================================================
function initPlayer() {
    console.log("🎵 Music Player Initializing...");

    // 1. Ensure fallback images for main grid cards
    ensureCardImages();

    // 2. Populate sidebar playlist
    renderSidebarPlaylist();

    // 3. Attach click listeners to main grid song cards
    setupSongCardClickListeners();

    // 4. Set default volume (80%)
    setVolume(0.8);

    // 5. Load first track (without auto-playing)
    loadSong(0, false);

    console.log("✅ Music Player Ready! 13 tracks loaded.");
}

// Initialize once DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPlayer);
} else {
    initPlayer();
}