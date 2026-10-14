# 🎵 Web Music Player (Spotify Clone)

A modern, responsive web-based music streaming interface with full HTML5 Audio playback controls, real-time seekbar progress synchronization, volume adjustments, mobile drawer navigation, and clean architecture.

---

## 📁 Project Directory Structure

```text
spotify clone project/
├── assets/
│   ├── icons/
│   │   ├── music.svg              # Library note icon
│   │   └── play.svg               # Play badge icon
│   └── images/
│       ├── Default_card_image.png # Fallback card cover
│       └── lang.png               # Language selector globe
├── css/
│   └── style.css                  # Responsive design system
├── js/
│   └── script.js                  # HTML5 Audio engine & UI controller
├── songs/                         # MP3 audio library (13 tracks)
│   ├── Alan Walker   Faded.mp3
│   ├── Billie Eilish.mp3
│   ├── David Guetta  Hey Mama .mp3
│   ├── Ed Sheeran  Shape of You .mp3
│   ├── Imagine Dragons  Believer .mp3
│   ├── Imagine Dragons  Bones .mp3
│   ├── Lady Gaga  Bruno Mars  Die With A Smile .mp3
│   ├── Marshmello & Anne-Marie  FRIENDS .mp3
│   ├── Sean Paul No Lie ft. Dua Lipa.mp3
│   ├── Serena .mp3
│   ├── Shakira  Waka Waka .mp3
│   ├── Sia  Unstoppable .mp3
│   └── Tungevaag Raaban   Bad Boy.mp3
├── main.html                      # Primary application entry point
└── README.md                      # Project documentation
```

---

## 🚀 Key Features

1. **HTML5 Audio API Controls**:
   - Play, Pause, Next, Previous, and Auto-advance on track completion.
   - Dynamic track information (Cover image, Title, Artist, and formatted Duration).
2. **Interactive Seekbar**:
   - Real-time playback synchronization (`timeupdate`).
   - Interactive mouse click & drag scrubbing.
3. **Volume & Mute Control**:
   - Slider control (0 to 1) with instant audio feedback.
   - Dynamic Mute / Unmute button with volume state icons.
4. **Responsive Multi-Device Layout**:
   - **Desktop (1025px+)**: Full two-column layout with fixed floating player bar.
   - **Tablet (768px - 1024px)**: Slide-out drawer navigation with hamburger menu.
   - **Mobile (<= 580px)**: Compact 2-column grid and adaptive player bar.
5. **Real-time Live Search**:
   - Instant filtering across both song grid cards and sidebar playlist items.
6. **Smart Fallback Handling**:
   - Any missing or broken image automatically defaults to `assets/images/Default_card_image.png`.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| **Spacebar** | Play / Pause current track |
| **Right Arrow (`→`)** | Seek forward by 5 seconds |
| **Left Arrow (`←`)** | Seek backward by 5 seconds |
| **Up Arrow (`↑`)** | Increase volume by 5% |
| **Down Arrow (`↓`)** | Decrease volume by 5% |
| **M** | Toggle Mute / Unmute |

---

## 🛠️ How to Run Locally

Open the directory in your preferred web browser:
```bash
# Using Python built-in HTTP server:
python3 -m http.server 3000

# Open in browser:
http://localhost:3000/main.html
```
