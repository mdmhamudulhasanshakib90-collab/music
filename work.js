/* ==========================================
   SPOTIFY-STYLE AUDIO PLAYER ENGINE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements Selection
    const trackRows = document.querySelectorAll('.track-row');
    const audioElements = document.querySelectorAll('.inline-audio');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('no-results');
    
    const nowPlayingTitle = document.getElementById('nowPlayingTitle');
    const nowPlayingArtist = document.getElementById('nowPlayingArtist');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const seekBar = document.getElementById('seekBar');
    const themeLabel = document.getElementById('themeLabel');
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const aboutModal = document.getElementById('aboutModal');

    // Player State Variables
    let currentAudio = null;
    let currentTrackIndex = -1;

    /* ==========================================
       2. HELPER FUNCTIONS
       ========================================== */
    // Time Formatter (mm:ss)
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Reset active UI states & pause playback
    function clearActiveStates() {
        audioElements.forEach(audio => audio.pause());
        trackRows.forEach(row => row.classList.remove('active', 'playing'));
    }

    /* ==========================================
       3. CORE PLAYER CONTROLS
       ========================================== */
    // Play track by index
    window.playTrack = function(index) {
        if (index < 0 || index >= trackRows.length) return;

        const row = trackRows[index];
        const audio = row.querySelector('audio');

        if (!audio) return;

        // Toggle pause/play if clicking the currently playing track
        if (currentAudio === audio && !audio.paused) {
            audio.pause();
            return;
        }

        clearActiveStates();

        currentAudio = audio;
        currentTrackIndex = index;

        // Active State Highlight
        row.classList.add('active', 'playing');

        // Extract metadata from row and update bottom player
        const title = row.querySelector('.track-name')?.textContent || "Unknown Title";
        const singer = row.querySelector('.artist-cell, .artist-name')?.textContent.replace(/"/g, '') || "Unknown Singer";

        if (nowPlayingTitle) nowPlayingTitle.textContent = title;
        if (nowPlayingArtist) nowPlayingArtist.textContent = singer;

        audio.play().catch(err => console.error("Playback error:", err));
    };

    // Play First Track
    window.playFirstTrack = function() {
        if (trackRows.length > 0) {
            playTrack(0);
        }
    };

    /* ==========================================
       4. AUDIO EVENT LISTENERS & PROGRESS SYNC
       ========================================== */
    trackRows.forEach((row, index) => {
        const audio = row.querySelector('audio');
        if (!audio) return;

        // Click track row to play
        row.addEventListener('click', (e) => {
            if (e.target.tagName !== 'AUDIO' && !e.target.closest('audio')) {
                playTrack(index);
            }
        });

        // Time and seekbar updating
        audio.addEventListener('timeupdate', () => {
            if (currentAudio === audio) {
                if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
                if (durationTimeEl && !isNaN(audio.duration)) {
                    durationTimeEl.textContent = formatTime(audio.duration);
                }
                if (seekBar && audio.duration) {
                    seekBar.value = (audio.currentTime / audio.duration) * 100;
                }
            }
        });

        // Track state syncing on play/pause
        audio.addEventListener('play', () => {
            if (currentAudio !== audio) {
                clearActiveStates();
                currentAudio = audio;
                currentTrackIndex = index;
            }
            row.classList.add('active', 'playing');
        });

        audio.addEventListener('pause', () => {
            row.classList.remove('active', 'playing');
        });

        // Spotify Continuous Autoplay
        audio.addEventListener('ended', () => {
            row.classList.remove('active', 'playing');
            if (currentTrackIndex + 1 < trackRows.length) {
                playTrack(currentTrackIndex + 1);
            }
        });
    });

    /* ==========================================
       5. SEEKBAR & MEDIA CONTROLS
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

    /* ==========================================
       6. THEME, SEARCH, TABS & MODALS
       ========================================== */
    // Light / Dark Theme Switcher
    window.toggleTheme = function() {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        root.setAttribute('data-theme', newTheme);
        if (themeLabel) {
            themeLabel.textContent = newTheme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    };

    // Live Instant Search Filter
    window.filterSongs = function() {
        if (!searchInput) return;
        const filter = searchInput.value.toLowerCase().trim();
        let hasMatch = false;

        trackRows.forEach(row => {
            const title = row.querySelector('.track-name')?.textContent.toLowerCase() || '';
            const artist = row.querySelector('.artist-cell, .artist-name')?.textContent.toLowerCase() || '';

            if (title.includes(filter) || artist.includes(filter)) {
                row.style.display = "flex";
                hasMatch = true;
            } else {
                row.style.display = "none";
            }
        });

        if (noResults) {
            noResults.style.display = hasMatch ? "none" : "block";
        }
    };

    window.focusSearch = function() {
        if (searchInput) searchInput.focus();
    };

    window.switchTab = function(element) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    };

    window.openModal = function() {
        if (aboutModal) aboutModal.style.display = 'flex';
    };

    window.closeModal = function() {
        if (aboutModal) aboutModal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target === aboutModal) {
            closeModal();
        }
    };
});
