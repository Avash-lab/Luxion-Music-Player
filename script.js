const songsList = [
    {
        name: "Ngai Mohrari Ngolo Aachyo Mroriba",
        artist: "Old Gurung Song",
        src: "assets/music/1.mp4",
        cover: "assets/photos/logo.jpg",
        duration: 208
    },
    {
        name: "Chaudhary",
        artist: "Mame Khan | Amit Trivedi",
        src: "assets/music/2.mp4",
        cover: "assets/photos/logo.jpg",
        duration: 208
    },
    {
        name: "Tere Bina",
        artist: "A.R. Rahman",
        src: "assets/music/3.mp4",
        cover: "assets/photos/logo.jpg",
        duration: 208
    },
    {
        name: "Aasman Ko Chukar Dekha",
        artist: "Daler Mehndi",
        src: "assets/music/4.mp4",
        cover: "assets/photos/logo.jpg",
        duration: 208
    },
    {
        name: "Keti Ko",
        artist: "Uunchai",
        src: "assets/music/5.mp4",
        cover: "assets/photos/logo.jpg",
        duration: 208
    },
    {
        name: "Jham Jham Paryo Pani",
        artist: "Kta Haru",
        src: "assets/music/6.mp4",
        cover: "assets/photos/logo.jpg",
        duration: 208
    },
];

const artistName = document.querySelector('.artist-name');
const musicName = document.querySelector('.song-name');
const fillBar = document.querySelector('.fill-bar');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const cover = document.getElementById('cover');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const volumeSlider = document.getElementById('volume');
const prog = document.querySelector('.progress-bar');
const trackCurrent = document.getElementById('track-current');
const trackTotal = document.getElementById('track-total');
const playlistEl = document.getElementById('playlist');

const playerStatusEl = document.getElementById('playerStatus');
const totalTracksEl = document.getElementById('totalTracks');
const nowPlayingTrackEl = document.getElementById('nowPlayingTrack');
const currentTrackNameEl = document.getElementById('currentTrackName');
const currentArtistEl = document.getElementById('currentArtist');
const devToggle = document.getElementById('devToggle');
const devPanel = document.getElementById('devPanel');
const closePanel = document.querySelector('.close-panel');

let song = new Audio();
let currentSong = 0;
let playing = false;
let isShuffled = false;
let isRepeating = false;
let isDevPanelOpen = false;

$(document).ready(function() {
    initializePlayer();
    createPlaylist();
    setupEventListeners();
    initializeVideoBackground();
    
    totalTracksEl.textContent = songsList.length;
    nowPlayingTrackEl.textContent = '1';
    playerStatusEl.textContent = 'READY';
    
    const firstSongName = songsList[0].name;
    currentTrackNameEl.textContent = firstSongName.length > 25 
        ? firstSongName.substring(0, 25) + '...' 
        : firstSongName;
    
    currentArtistEl.textContent = songsList[0].artist;
    
    trackTotal.textContent = songsList.length;
    totalTimeEl.textContent = '3:28';
    
    loadSong(currentSong);
});

function initializeVideoBackground() {
    const video = document.getElementById('bgVideo');
    
    if (!video) {
        console.error('Video element not found!');
        return;
    }
    
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('playsinline', 'true');
    video.preload = 'auto';
    
    video.style.objectFit = 'cover';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.position = 'absolute';
    video.style.top = '50%';
    video.style.left = '50%';
    video.style.transform = 'translate(-50%, -50%)';
    
    const playVideo = () => {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video playing successfully');
            }).catch(error => {
                console.log('Video autoplay prevented:', error.name);
                
                const enableVideoPlayback = () => {
                    video.muted = true;
                    video.play().then(() => {
                        console.log('Video started after user interaction');

                        document.removeEventListener('click', enableVideoPlayback);
                        document.removeEventListener('touchstart', enableVideoPlayback);
                        document.removeEventListener('keydown', enableVideoPlayback);
                    }).catch(e => {
                        console.log('Still cannot play video:', e);
                    });
                };
                
                document.addEventListener('click', enableVideoPlayback, { once: true });
                document.addEventListener('touchstart', enableVideoPlayback, { once: true });
                document.addEventListener('keydown', enableVideoPlayback, { once: true });
            });
        }
    };
    
    video.load();
    
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('canplay', playVideo);
    
    setTimeout(playVideo, 1000);
    
    video.addEventListener('error', function(e) {
        console.error('Video error:', e);
        console.error('Video error details:', video.error);
    });
}

function initializePlayer() {

    song.addEventListener('timeupdate', updateProgress);
    song.addEventListener('ended', handleSongEnd);
    song.addEventListener('loadedmetadata', function() {
        if (song.duration && !isNaN(song.duration)) {
            totalTimeEl.textContent = formatTime(song.duration);
        }
    });
    
    song.addEventListener('error', function(e) {
        console.error('Audio error:', e);
        playerStatusEl.textContent = 'ERROR';
    });
    
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    playBtn.addEventListener('click', togglePlayPause);
    prog.addEventListener('click', seek);
    volumeSlider.addEventListener('input', adjustVolume);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    document.addEventListener('keydown', handleKeyboard);
    
    song.volume = volumeSlider.value / 100;
}

function setupEventListeners() {

    devToggle.addEventListener('click', () => {
        toggleDevPanel();
    });
    
    closePanel.addEventListener('click', () => {
        closeDevPanel();
    });
    
    devPanel.addEventListener('transitionend', () => {
        if (devPanel.classList.contains('active')) {
            updateDevPanel();
        }
    });
}

function toggleDevPanel() {
    devPanel.classList.toggle('active');
    isDevPanelOpen = devPanel.classList.contains('active');
    
    if (isDevPanelOpen) {
        updateDevPanel();
    }
}

function closeDevPanel() {
    devPanel.classList.remove('active');
    isDevPanelOpen = false;
}

function updateDevPanel() {

    playerStatusEl.textContent = playing ? 'PLAYING' : 'PAUSED';

    totalTracksEl.textContent = songsList.length;
    
    nowPlayingTrackEl.textContent = currentSong + 1;
    
    const currentSongObj = songsList[currentSong];
    const trackName = currentSongObj.name;
    currentTrackNameEl.textContent = trackName.length > 25 
        ? trackName.substring(0, 25) + '...' 
        : trackName;
    
    currentArtistEl.textContent = currentSongObj.artist;
}

function createPlaylist() {
    playlistEl.innerHTML = '';
    songsList.forEach((songItem, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        
        if (index === currentSong) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <div class="item-info">
                <div class="item-title">${songItem.name}</div>
                <div class="item-artist">${songItem.artist}</div>
            </div>
            <div class="item-duration">${formatTime(songItem.duration)}</div>
        `;
        
        item.addEventListener('click', () => {
            playSpecificSong(index);
        });
        
        playlistEl.appendChild(item);
    });
}

function loadSong(index) {
    const songItem = songsList[index];
    
    artistName.textContent = songItem.artist;
    musicName.textContent = songItem.name;
    
    if (isDevPanelOpen) {
        updateDevPanel();
    }
    
    if (song) {
        song.pause();
        song = null;
    }
    
    song = new Audio();
    
    song.addEventListener('error', function(e) {
        console.error('Audio loading error:', e);
        
        if (isDevPanelOpen) {
            playerStatusEl.textContent = 'ERROR';
        }
        
        setTimeout(() => {
            nextSong();
        }, 1000);
    });
    
    try {
        song.src = songItem.src;
    } catch (error) {
        console.error('Error setting song source:', error);
        return;
    }
    
    song.addEventListener('timeupdate', updateProgress);
    song.addEventListener('ended', handleSongEnd);
    song.addEventListener('loadedmetadata', function() {
        if (song.duration && !isNaN(song.duration)) {
            totalTimeEl.textContent = formatTime(song.duration);
        }
    });
    
    song.volume = volumeSlider.value / 100;
    
    if (songItem.cover) {
        cover.style.backgroundImage = `url(${songItem.cover})`;
    }
    
    trackCurrent.textContent = index + 1;
    updatePlaylistHighlight(index);
    
    fillBar.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    
    setTimeout(() => {
        if (song.duration && !isNaN(song.duration)) {
            totalTimeEl.textContent = formatTime(song.duration);
        } else {
            totalTimeEl.textContent = formatTime(songItem.duration);
        }
    }, 100);
    
    if (playing) {
        song.play().then(() => {
            playBtn.classList.add('fa-pause');
            playBtn.classList.remove('fa-play');
            cover.classList.add('active');
            
            if (isDevPanelOpen) {
                playerStatusEl.textContent = 'PLAYING';
            }
        }).catch(error => {
            console.error('Error playing song:', error);
            playing = false;
            playBtn.classList.remove('fa-pause');
            playBtn.classList.add('fa-play');
            cover.classList.remove('active');
            
            if (isDevPanelOpen) {
                playerStatusEl.textContent = 'ERROR';
            }
        });
    }
}

function updatePlaylistHighlight(index) {
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
}

function updateProgress() {
    if (song.duration && !isNaN(song.duration)) {
        const pos = (song.currentTime / song.duration) * 100;
        fillBar.style.width = `${pos}%`;
        
        currentTimeEl.textContent = formatTime(song.currentTime);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function togglePlayPause() {
    if (playing) {
        song.pause();
        playBtn.classList.remove('fa-pause');
        playBtn.classList.add('fa-play');
        cover.classList.remove('active');
    } else {
        song.play().then(() => {
            playBtn.classList.add('fa-pause');
            playBtn.classList.remove('fa-play');
            cover.classList.add('active');
        }).catch(error => {
            console.error('Error playing:', error);
            playing = false;
        });
    }
    playing = !playing;
    
    if (isDevPanelOpen) {
        playerStatusEl.textContent = playing ? 'PLAYING' : 'PAUSED';
    }
}

function nextSong() {
    if (isShuffled) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songsList.length);
        } while (newIndex === currentSong && songsList.length > 1);
        currentSong = newIndex;
    } else {
        currentSong = (currentSong + 1) % songsList.length;
    }
    playMusic();
}

function prevSong() {
    if (isShuffled) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songsList.length);
        } while (newIndex === currentSong && songsList.length > 1);
        currentSong = newIndex;
    } else {
        currentSong = (currentSong - 1 + songsList.length) % songsList.length;
    }
    playMusic();
}

function playSpecificSong(index) {
    currentSong = index;
    playMusic();
}

function playMusic() {
    loadSong(currentSong);
    playing = true;
    song.play().then(() => {
        playBtn.classList.add('fa-pause');
        playBtn.classList.remove('fa-play');
        cover.classList.add('active');
        
        if (isDevPanelOpen) {
            playerStatusEl.textContent = 'PLAYING';
        }
    }).catch(error => {
        console.error('Error playing music:', error);
        playing = false;
        
        if (isDevPanelOpen) {
            playerStatusEl.textContent = 'ERROR';
        }
    });
}

function seek(e) {
    if (song.duration && !isNaN(song.duration)) {
        const rect = prog.getBoundingClientRect();
        const pos = ((e.clientX - rect.left) / rect.width) * song.duration;
        song.currentTime = Math.max(0, Math.min(pos, song.duration));
    }
}

function adjustVolume() {
    song.volume = volumeSlider.value / 100;
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    repeatBtn.classList.toggle('active', isRepeating);
}

function handleSongEnd() {
    if (isRepeating) {
        song.currentTime = 0;
        song.play();
    } else {
        nextSong();
    }
}

function handleKeyboard(e) {
    switch(e.key.toLowerCase()) {
        case ' ':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'arrowleft':
            e.preventDefault();
            prevSong();
            break;
        case 'arrowright':
            e.preventDefault();
            nextSong();
            break;
        case 'escape':
            e.preventDefault();
            closeDevPanel();
            break;
        case 'd':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleDevPanel();
            }
            break;
    }
}

window.addEventListener('load', initializeVideoBackground);