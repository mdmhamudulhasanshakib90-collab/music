// App State Variables
let currentTrackIndex = -1;
let isPlaying = false;

// DOM Elements
const audio = document.getElementById('globalAudio');
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

// Initialize Player Event Listeners
function initPlayer() {
    trackRows.forEach((row, index) => {
        row.addEventListener('click', () => playTrack(index));
    });

    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPreviousTrack);
    nextBtn.addEventListener('click', playNextTrack);

    audio.addEventListener('timeupdate', updateSeekBar);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', playNextTrack);

    seekBar.addEventListener('input', seekAudio);
    volumeBar.addEventListener('input', adjustVolume);
}

// Play Specific Track by Index
function playTrack(index) {
    if (index < 0 || index >= trackRows.length) return;

    currentTrackIndex = index;
    const selectedRow = trackRows[currentTrackIndex];
    const src = selectedRow.getAttribute('data-src');
    const title = selectedRow.getAttribute('data-title');
    const artist = selectedRow.getAttribute('data-artist');

    // UI Updates
    trackRows.forEach(row => row.classList.remove('active-track'));
    selectedRow.classList.add('active-track');

    nowPlayingTitle.textContent = title;
    nowPlayingArtist.textContent = artist;

    // Audio Playback
    audio.src = src;
    audio.play();
    isPlaying = true;
    updateControlIcons();
}

// Toggle Play/Pause State
function togglePlayPause() {
    if (currentTrackIndex === -1) {
        playTrack(0);
        return;
    }

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }
    updateControlIcons();
}

function updateControlIcons() {
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

function playNextTrack() {
    if (trackRows.length === 0) return;
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= trackRows.length) nextIndex = 0;
    playTrack(nextIndex);
}

function playPreviousTrack() {
    if (trackRows.length === 0) return;
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = trackRows.length - 1;
    playTrack(prevIndex);
}

function playFirstTrack() {
    playTrack(0);
}

// Progress Bar & Duration Formatters
function updateSeekBar() {
    if (!isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        seekBar.value = progress;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

function updateDuration() {
    durationTimeEl.textContent = formatTime(audio.duration);
}

function seekAudio() {
    if (!isNaN(audio.duration)) {
        const seekTime = (seekBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    }
}

function adjustVolume() {
    audio.volume = volumeBar.value / 100;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Live Search Logic
function filterSongs() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    let visibleCount = 0;

    trackRows.forEach(row => {
        const title = row.getAttribute('data-title').toLowerCase();
        const artist = row.getAttribute('data-artist').toLowerCase();

        if (title.includes(query) || artist.includes(query)) {
            row.style.display = 'grid';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    const noResults = document.getElementById('no-results');
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

// Interface Helper Functions
function focusSearch() {
    document.getElementById('searchInput').focus();
}

function switchTab(element) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

function openModal() {
    document.getElementById('aboutModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('aboutModal').style.display = 'none';
}

// Boot System
document.addEventListener('DOMContentLoaded', initPlayer);
