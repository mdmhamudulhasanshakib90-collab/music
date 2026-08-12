  <!-- Logic & Event Listeners -->
    <script>
        const allAudios = document.querySelectorAll('audio');
        const nowTitle = document.getElementById('nowPlayingTitle');
        const nowArtist = document.getElementById('nowPlayingArtist');
        const seekBar = document.getElementById('seekBar');
        const currentTimeTxt = document.getElementById('currentTime');
        const durationTimeTxt = document.getElementById('durationTime');
        const themeLabel = document.getElementById('themeLabel');
        
        let activeAudio = null;

        // Theme Toggle Handler (Light/Dark Mode Switcher)
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            themeLabel.textContent = newTheme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }

        // Auto-pause and Bottom Bar Sync Logic
        allAudios.forEach((audio) => {
            audio.addEventListener('play', function() {
                // Pause all other audio players
                allAudios.forEach(a => {
                    if (a !== audio) {
                        a.pause();
                    }
                });

                activeAudio = audio;
                
                // Get track details from table row
                const row = audio.closest('tr');
                if (row) {
                    const title = row.querySelector('.track-name').textContent;
                    const artist = row.querySelector('.artist-cell').textContent;
                    nowTitle.textContent = title;
                    nowArtist.textContent = artist;
                }
            });

            // Update Progress Bar / Seekbar
            audio.addEventListener('timeupdate', function() {
                if (audio === activeAudio) {
                    const progress = (audio.currentTime / audio.duration) * 100;
                    seekBar.value = progress || 0;
                    currentTimeTxt.textContent = formatTime(audio.currentTime);
                    if(!isNaN(audio.duration)) {
                        durationTimeTxt.textContent = formatTime(audio.duration);
                    }
                }
            });
        });

        // Seek Audio using bottom seek bar
        seekBar.addEventListener('input', function() {
            if (activeAudio && !isNaN(activeAudio.duration)) {
                const seekTo = (seekBar.value / 100) * activeAudio.duration;
                activeAudio.currentTime = seekTo;
            }
        });

        // Time Formatting Helper
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        // Play First Song from Big Play Button
        function playFirstTrack() {
            if (allAudios.length > 0) {
                allAudios[0].play();
            }
        }

        // Instant Search Logic
        function filterSongs() {
            const filter = document.getElementById('searchInput').value.toLowerCase();
            const rows = document.querySelectorAll('#songList .track-row');
            const noResults = document.getElementById('no-results');
            let matchFound = false;

            rows.forEach(row => {
                const songTitle = row.querySelector('.track-name').textContent.toLowerCase();
                const artistName = row.querySelector('.artist-cell').textContent.toLowerCase();

                if (songTitle.includes(filter) || artistName.includes(filter)) {
                    row.style.display = "";
                    matchFound = true;
                } else {
                    row.style.display = "none";
                }
            });

            noResults.style.display = matchFound ? "none" : "block";
        }

        function focusSearch() {
            document.getElementById('searchInput').focus();
        }

        function switchTab(element) {
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
        }

        // Modal Handlers
        function openModal() {
            document.getElementById('aboutModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('aboutModal').style.display = 'none';
        }
        // JavaScript Implementation
document.addEventListener('DOMContentLoaded', function () {
    const allAudios = document.querySelectorAll('audio');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    let currentTrackIndex = -1;
    let activeAudio = null;
    /* ==========================================
   1. GLOBAL VARIABLES & INITIALIZATION
   ========================================== */
let currentAudio = null;
let currentTrackIndex = -1;

const trackRows = document.querySelectorAll('.track-row');
const audioElements = document.querySelectorAll('.inline-audio');
const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('no-results');

const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');
const seekBar = document.getElementById('seekBar');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const aboutModal = document.getElementById('aboutModal');

/* ==========================================
   2. THEME SWITCHER (LIGHT / DARK)
   ========================================== */
function toggleTheme() {
    const body = document.body;
    const themeLabel = document.getElementById('themeLabel');
    const currentTheme = body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    body.setAttribute('data-theme', newTheme);
    
    if (themeLabel) {
        themeLabel.innerText = newTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode';
    }
}

/* ==========================================
   3. NAVIGATION TABS & MODAL CONTROLS
   ========================================== */
function switchTab(element) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    element.classList.add('active');
}

function focusSearch() {
    if (searchInput) {
        searchInput.focus();
    }
}

function openModal() {
    if (aboutModal) {
        aboutModal.style.display = 'flex';
    }
}

function closeModal() {
    if (aboutModal) {
        aboutModal.style.display = 'none';
    }
}

window.onclick = function(event) {
    if (event.target === aboutModal) {
        closeModal();
    }
};

/* ==========================================
   4. SEARCH / FILTER FUNCTIONALITY
   ========================================== */
function filterSongs() {
    const filter = searchInput.value.toLowerCase().trim();
    let hasVisibleTracks = false;

    trackRows.forEach(row => {
        const songName = row.querySelector('.track-name')?.innerText.toLowerCase() || '';
        const artistName = row.querySelector('.artist-name')?.innerText.toLowerCase() || '';
        const singerName = row.querySelector('.artist-cell')?.innerText.toLowerCase() || '';

        if (songName.includes(filter) || artistName.includes(filter) || singerName.includes(filter)) {
            row.style.display = 'flex';
            hasVisibleTracks = true;
        } else {
            row.style.display = 'none';
        }
    });

    if (noResults) {
        noResults.style.display = hasVisibleTracks ? 'none' : 'block';
    }
}

/* ==========================================
   5. AUDIO PLAYER CONTROLS & AUTOPLAY SYNC
   ========================================== */

// Stop all playing audio and clear active visual states
function clearActiveStates() {
    audioElements.forEach(audio => audio.pause());
    trackRows.forEach(row => row.classList.remove('playing', 'active'));
}

// Format time in seconds to mm:ss format
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Primary function to play a specific track by index
function playTrack(index) {
    if (index < 0 || index >= trackRows.length) return;

    clearActiveStates();

    const row = trackRows[index];
    const audio = row.querySelector('.inline-audio');

    currentAudio = audio;
    currentTrackIndex = index;

    // Highlight the currently active track card visually
    row.classList.add('playing', 'active');

    // Update bottom player track metadata
    const title = row.querySelector('.track-name')?.innerText || "Unknown Title";
    const singer = row.querySelector('.artist-cell')?.innerText.replace(/"/g, '') || "Unknown Singer";

    if (nowPlayingTitle) nowPlayingTitle.innerText = title;
    if (nowPlayingArtist) nowPlayingArtist.innerText = singer;

    // Play the audio
    audio.play();
}

/* ==========================================
   6. EVENT LISTENERS FOR TRACKS
   ========================================== */
trackRows.forEach((row, index) => {
    const audio = row.querySelector('.inline-audio');

    // Play or pause when clicking anywhere on the track card
    row.addEventListener('click', (e) => {
        if (e.target.tagName !== 'AUDIO' && !e.target.closest('audio')) {
            if (audio.paused) {
                playTrack(index);
            } else {
                audio.pause();
                row.classList.remove('playing', 'active');
            }
        }
    });

    // Update playing status when playback starts
    audio.addEventListener('play', () => {
        if (currentAudio && currentAudio !== audio) {
            clearActiveStates();
        }
        currentAudio = audio;
        currentTrackIndex = index;
        row.classList.add('playing', 'active');

        const title = row.querySelector('.track-name')?.innerText || "Unknown Title";
        const singer = row.querySelector('.artist-cell')?.innerText.replace(/"/g, '') || "Unknown Singer";

        if (nowPlayingTitle) nowPlayingTitle.innerText = title;
        if (nowPlayingArtist) nowPlayingArtist.innerText = singer;
    });

    // Remove highlight when paused
    audio.addEventListener('pause', () => {
        row.classList.remove('playing', 'active');
    });

    // Sync track progress with current time and seekbar slider
    audio.addEventListener('timeupdate', () => {
        if (currentAudio === audio) {
            if (currentTimeEl) currentTimeEl.innerText = formatTime(audio.currentTime);
            if (durationTimeEl) durationTimeEl.innerText = formatTime(audio.duration);
            
            if (seekBar && audio.duration) {
                seekBar.value = (audio.currentTime / audio.duration) * 100;
            }
        }
    });

    // Autoplay the next song when the current song finishes
    audio.addEventListener('ended', () => {
        row.classList.remove('playing', 'active');
        if (currentTrackIndex + 1 < trackRows.length) {
            playTrack(currentTrackIndex + 1);
        }
    });
});

/* ==========================================
   7. SEEKBAR & PLAYER BUTTON CONTROLS
   ========================================== */
if (seekBar) {
    seekBar.addEventListener('input', () => {
        if (currentAudio && currentAudio.duration) {
            currentAudio.currentTime = (seekBar.value / 100) * currentAudio.duration;
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentTrackIndex > 0) {
            playTrack(currentTrackIndex - 1);
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentTrackIndex < trackRows.length - 1) {
            playTrack(currentTrackIndex + 1);
        }
    });
}

function playFirstTrack() {
    if (trackRows.length > 0) {
        playTrack(0);
    }
}


    </script>
