const API_BASE = "https://voyeger2026-backend.onrender.com/api";
let currentMonument = null;
let currentFrame = null;
let currentVibe = "professor"; 
let allMonuments = [];

// Initialization
async function init() {
    try {
        const res = await fetch(`${API_BASE}/monuments/getAll`);
        allMonuments = await res.json();
        renderGallery(allMonuments);
    } catch (err) {
        console.error("Failed to load monuments:", err);
    }
}

function playAudio(url) {
    const audio = document.getElementById("narration-audio");

    if (!url) {
        audio.pause();
        audio.src = "";
        return;
    }

    audio.pause();
    audio.src = url;
    audio.load();

    audio.play().catch(err => {
        console.warn("Autoplay blocked until user clicks", err);
    });
}


// 1. Gallery Rendering
function renderGallery(monuments) {
    const grid = document.getElementById('monument-grid');
    grid.innerHTML = monuments.map(m => `
        <div class="card" onclick="startTour('${m._id}')">
            <img src="${m.imgUrl || 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1000'}" alt="${m.name}">
            <div class="card-body">
                <h3>${m.name}</h3>
                <p>📍 ${m.location?.address || 'Ancient Site'}</p>
            </div>
        </div>
    `).join('');
}

// Search Filter Logic
function filterMonuments() {
    const query = document.getElementById('monumentSearch').value.toLowerCase();
    const filtered = allMonuments.filter(m => m.name.toLowerCase().includes(query));
    renderGallery(filtered);
}

// 2. Start Tour (Get Monument Meta)
async function startTour(id) {
    const res = await fetch(`${API_BASE}/monuments/getById/${id}`);
    currentMonument = await res.json();
    
    document.getElementById('gallery-view').classList.add('hidden');
    document.getElementById('tour-view').classList.remove('hidden');
    window.scrollTo(0,0);

    renderMonumentOverview();
}

function renderMonumentOverview() {
    currentFrame = null; // We are in overview mode
    document.getElementById('display-title').innerText = currentMonument.name;
    document.getElementById('display-image').src = currentMonument.imgUrl;
    
    // Dynamic text selection
    const text = currentMonument.overview[currentVibe] || "No description available for this vibe.";
    document.getElementById('display-description').innerText = text;
    document.getElementById('narration-audio').src = currentMonument.overviewAudioUrl[currentVibe] || "";

    const pathBtns = document.getElementById('path-buttons');
    pathBtns.innerHTML = `
        <button class="btn-next" onclick="loadEntryFrame()">
            Begin Visual Tour <span>→</span>
        </button>
    `;
    document.getElementById('path-section').classList.remove('hidden');
    document.getElementById('end-message').classList.add('hidden');
}

// 3. Frame Navigation Logic
async function loadEntryFrame() {
    const res = await fetch(`${API_BASE}/frames/getEntryFrameByMonumentId/${currentMonument._id}`);
    const frame = await res.json();
    renderFrame(frame);
}

async function renderFrame(frame) {
    currentFrame = frame;
    
    document.getElementById('display-title').innerText = frame.title;
    document.getElementById('display-image').src = frame.imageUrl;
    document.getElementById('display-description').innerText = frame.narration[currentVibe] || "Silence...";
    document.getElementById('narration-audio').src = frame.narrationAudioUrl[currentVibe] || "";

    const pathBtns = document.getElementById('path-buttons');
    pathBtns.innerHTML = '';

    if (frame.type === "EXIT") {
        document.getElementById('path-section').classList.add('hidden');
        document.getElementById('end-message').classList.remove('hidden');
    } else {
        document.getElementById('path-section').classList.remove('hidden');
        document.getElementById('end-message').classList.add('hidden');
        
        // Fetch full next frames so we can display their custom labels (e.g., "Enter the Secret Gate")
        const nextRes = await fetch(`${API_BASE}/frames/getAllNextFramesByCurrentFrameId/${frame._id}`);
        const nextFrames = await nextRes.json();
        
        nextFrames.forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'btn-next';
            btn.innerHTML = `${f.choiceLabel || "Continue Path"} <span>→</span>`;
            btn.onclick = () => renderFrame(f);
            pathBtns.appendChild(btn);
        });
    }
}

// 4. Vibe Switch Listener
document.getElementById('vibe-selector').addEventListener('change', (e) => {
    currentVibe = e.target.value;
    if (currentFrame) {
        renderFrame(currentFrame);
    } else if (currentMonument) {
        renderMonumentOverview();
    }
});

function showGallery() {
    document.getElementById('gallery-view').classList.remove('hidden');
    document.getElementById('tour-view').classList.add('hidden');
}

init();