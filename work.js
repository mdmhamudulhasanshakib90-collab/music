// DOM Elements Selection
const globalAudio = document.getElementById('globalAudio');
const songList = document.getElementById('songList');
const trackRows = Array.from(document.querySelectorAll('.track-row'));
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const seekBar = document.getElementById('seekBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('no-results');
const aboutModal = document.getElementById('aboutModal');

let currentTrackIndex = -1;
let isPlaying = false;

// Format Time (Seconds -> MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Load and Play Track by Index
function loadAndPlayTrack(index) {
    if (index < 0 || index >= trackRows.length) return;

    // Highlight row in active state
    trackRows.forEach(row => row.classList.remove('active-track'));
    
    currentTrackIndex = index;
    const selectedRow = trackRows[currentTrackIndex];
    selectedRow.classList.add('active-track');

    const src = selectedRow.getAttribute('data-src');
    const title = selectedRow.getAttribute('data-title');
    const artist = selectedRow.getAttribute('data-artist');

    globalAudio.src = src;
    nowPlayingTitle.textContent = title;
    nowPlayingArtist.textContent = artist;

    globalAudio.play()
        .then(() => {
            isPlaying = true;
            updatePlayPauseUI();
        })
        .catch(err => console.error("Error playing audio:", err));
}

// Update Play/Pause Button Icons
function updatePlayPauseUI() {
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

// Toggle Play / Pause
function togglePlayPause() {
    if (currentTrackIndex === -1) {
        // Play first track if nothing is selected yet
        loadAndPlayTrack(0);
        return;
    }

    if (globalAudio.paused) {
        globalAudio.play();
        isPlaying = true;
    } else {
        globalAudio.pause();
        isPlaying = false;
    }
    updatePlayPauseUI();
}

// Play First Track (from Playlist Main Play Button)
function playFirstTrack() {
    loadAndPlayTrack(0);
}

// Row Event Listeners
trackRows.forEach((row, index) => {
    row.addEventListener('click', () => {
        loadAndPlayTrack(index);
    });
});

// Control Buttons
playPauseBtn.addEventListener('click', togglePlayPause);

prevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        loadAndPlayTrack(currentTrackIndex - 1);
    } else {
        loadAndPlayTrack(trackRows.length - 1); // Loop to end
    }
});

nextBtn.addEventListener('click', () => {
    if (currentTrackIndex < trackRows.length - 1) {
        loadAndPlayTrack(currentTrackIndex + 1);
    } else {
        loadAndPlayTrack(0); // Loop to start
    }
});

// Audio Progress & Seek Bar
globalAudio.addEventListener('timeupdate', () => {
    if (globalAudio.duration) {
        const progressPercent = (globalAudio.currentTime / globalAudio.duration) * 100;
        seekBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(globalAudio.currentTime);
        durationTimeEl.textContent = formatTime(globalAudio.duration);
    }
});

seekBar.addEventListener('input', () => {
    if (globalAudio.duration) {
        const seekTime = (seekBar.value / 100) * globalAudio.duration;
        globalAudio.currentTime = seekTime;
    }
});

// Auto Next Track on Song End
globalAudio.addEventListener('ended', () => {
    if (currentTrackIndex < trackRows.length - 1) {
        loadAndPlayTrack(currentTrackIndex + 1);
    } else {
        isPlaying = false;
        updatePlayPauseUI();
    }
});

// Volume Control
volumeBar.addEventListener('input', () => {
    globalAudio.volume = volumeBar.value / 100;
});

// Search & Filter Tracks
function filterSongs() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    trackRows.forEach(row => {
        const title = row.getAttribute('data-title').toLowerCase();
        const artist = row.getAttribute('data-artist').toLowerCase();
        const originalArtist = row.querySelector('.artist-name').textContent.toLowerCase();

        if (title.includes(query) || artist.includes(query) || originalArtist.includes(query)) {
            row.style.display = 'grid';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
}

function focusSearch() {
    searchInput.focus();
}

// Sidebar Navigation Tab Switching
function switchTab(element) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

// About Modal Handling
function openModal() {
    aboutModal.style.display = 'flex';
}

function closeModal() {
    aboutModal.style.display = 'none';
}

window.addEventListener('click', (event) => {
    if (event.target === aboutModal) {
        closeModal();
    }
});
