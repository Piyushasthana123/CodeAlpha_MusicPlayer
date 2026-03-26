async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/spotify%20clone%20project/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.includes(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}

async function main() {
    let songs = await getSongs();
    console.log(songs);

    // ✅ गलती 3 fix — .playlist container use करो, listcard नहीं
    let playlist = document.querySelector(".playlist");
    playlist.innerHTML = ""; // पुराने hardcoded cards हटाओ

    // ✅ गलती 4 fix — सिर्फ file name दिखाओ
    let htmlContent = "";
    for (const song of songs) {
        let songName = song.split("/").pop().replaceAll("%20", " ").replaceAll("%26", " ");
        htmlContent += `<div class="listcard">${songName}</div>`;
    }
    playlist.innerHTML = htmlContent;

    // ✅ गलती 1 & 2 fix — event listener अंदर रखो, सही element को
    let currentAudio = null;

    // Play button को सही से select करो (दूसरा SVG है .palybutton में)
    let playBtns = document.querySelectorAll(".palybutton svg");
    let currentIndex = 0;

    playBtns[1].addEventListener("click", () => { // ✅ दूसरा svg = play button
        if (!currentAudio) {
            currentAudio = new Audio(songs[currentIndex]);
            currentAudio.addEventListener("loadeddata", () => {
                console.log("Duration:", currentAudio.duration);
            });
        }
        currentAudio.play();
    });

    playBtns[0].addEventListener("click", () => { // previous button
        currentIndex = Math.max(0, currentIndex - 1);
        currentAudio = null;
        playBtns[1].click();
    });

    playBtns[2].addEventListener("click", () => { // next button
        currentIndex = Math.min(songs.length - 1, currentIndex + 1);
        currentAudio = null;
        playBtns[1].click();
    });
}

main();