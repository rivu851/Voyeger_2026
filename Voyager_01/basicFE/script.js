const API_BASE = "http://localhost:5000/api";
let currentMonument = null;
let currentFrame = null;
let currentVibe = "professor";

// UI Elements
const galleryView = document.getElementById('gallery');
const tourView = document.getElementById('tour');
const vibePicker = document.getElementById('vibePicker');

// Initial Load
window.onload = fetchMonuments;

async function fetchMonuments() {
    const res = await fetch(`${API_BASE}/monuments/getAll`);
    const monuments = await res.json();
    renderGallery(monuments);
}

function renderGallery(monuments) {
    const grid = document.getElementById('monumentGrid');
    grid.innerHTML = monuments.map(m => `
        <div class="card" onclick="startTour('${m._id}')">
            <img src="${m.imgUrl || 'https://via.placeholder.com/300x200'}" alt="${m.name}">
            <div class="card-info">
                <h3>${m.name}</h3>
                <p>${m.description?.substring(0, 100)}...</p>
            </div>
        </div>
    `).join('');
}

async function startTour(id) {
    const res = await fetch(`${API_BASE}/monuments/getById/${id}`);
    currentMonument = await res.json();
    
    // Switch Views
    galleryView.classList.add('hidden');
    tourView.classList.remove('hidden');
    document.getElementById('monumentTitle').innerText = currentMonument.name;

    // Fetch Entry Frame
    const frameRes = await fetch(`${API_BASE}/frames/getEntryFrameByMonumentId/${id}`);
    const entryFrame = await frameRes.json();
    renderFrame(entryFrame);
}

function renderFrame(frame) {
    currentFrame = frame;
    
    // Update Image and Title
    document.getElementById('frameImage').src = frame.imageUrl;
    document.getElementById('frameTitle').innerText = frame.title;
    
    // Update Narration based on Vibe
    updateVibeContent();

    // Handle Navigation
    const pathContainer = document.getElementById('pathButtons');
    const endSection = document.getElementById('endTour');
    const navHeader = document.getElementById('navigation');

    pathContainer.innerHTML = "";
    
    if (frame.type === "EXIT" || frame.pathsForward.length === 0) {
        navHeader.classList.add('hidden');
        endSection.classList.remove('hidden');
    } else {
        navHeader.classList.remove('hidden');
        endSection.classList.add('hidden');
        
        frame.pathsForward.forEach(path => {
            const btn = document.createElement('button');
            btn.innerText = path.nextFrameLabel || "Move Forward";
            btn.onclick = () => navigateToFrame(path.nextFrameId);
            pathContainer.appendChild(btn);
        });
    }
}

async function navigateToFrame(frameId) {
    const res = await fetch(`${API_BASE}/frames/getById/${frameId}`);
    const nextFrame = await res.json();
    renderFrame(nextFrame);
}

function updateVibeContent() {
    if (!currentFrame) return;

    const text = currentFrame.narration[currentVibe] || "No narration available for this vibe.";
    const audioUrl = currentFrame.narrationAudioUrl[currentVibe] || "";

    document.getElementById('narrationText').innerText = text;
    const audioEl = document.getElementById('frameAudio');
    
    if (audioUrl) {
        audioEl.src = audioUrl;
        audioEl.parentElement.classList.remove('hidden');
    } else {
        audioEl.parentElement.classList.add('hidden');
    }
}

// Event Listeners
vibePicker.onchange = (e) => {
    currentVibe = e.target.value;
    updateVibeContent();
};

function showGallery() {
    tourView.classList.add('hidden');
    galleryView.classList.remove('hidden');
    currentFrame = null;
}