// 1. DATA: Initialize from LocalStorage or use defaults
const defaultData = [
    { word: "Hello", def: "Xin chào", ipa: "/həˈləʊ/" },
    { word: "Goodbye", def: "Tạm biệt", ipa: "/ɡʊdˈbaɪ/" },
    { word: "Thank you", def: "Cảm ơn", ipa: "/θæŋk juː/" },
    { word: "Beautiful", def: "Xinh đẹp", ipa: "/ˈbjuːtɪfl/" },
    { word: "Programming", def: "Lập trình", ipa: "/ˈprəʊɡræmɪŋ/" }
];

let vocabList = [];
const storedData = localStorage.getItem('vocabList');
if (storedData) {
    vocabList = JSON.parse(storedData);
} else {
    vocabList = [...defaultData];
}

let currentIndex = 0;

// 2. DOM Elements
const wordEl = document.querySelector('.word');
const defEl = document.getElementById('def-area');
const installBtn = document.getElementById('install-btn');
const modal = document.getElementById('add-modal');
const inpWord = document.getElementById('inp-word');
const inpIpa = document.getElementById('inp-ipa');
const inpDef = document.getElementById('inp-def');

// 3. LOGIC: Core Functions

function renderCard() {
    if (vocabList.length === 0) {
        wordEl.textContent = "No words yet";
        defEl.textContent = "Add some!";
        return;
    }
    const currentCard = vocabList[currentIndex];

    // Set content
    wordEl.textContent = currentCard.word;
    // If IPA is missing, just show definition
    const ipaText = currentCard.ipa ? `${currentCard.ipa} - ` : '';
    defEl.textContent = `${ipaText}${currentCard.def}`;

    // Reset state
    defEl.style.display = 'none';
}

function toggleDef() {
    const isHidden = defEl.style.display === 'none';
    defEl.style.display = isHidden ? 'block' : 'none';
}

function nextCard() {
    if (vocabList.length === 0) return;
    currentIndex = (currentIndex + 1) % vocabList.length;
    renderCard();
}

function prevCard() {
    if (vocabList.length === 0) return;
    currentIndex = (currentIndex - 1 + vocabList.length) % vocabList.length;
    renderCard();
}

function saveData() {
    localStorage.setItem('vocabList', JSON.stringify(vocabList));
}

// 4. MODAL & ADD WORD LOGIC

function openModal() {
    modal.classList.add('active');
    inpWord.focus();
}

function closeModal() {
    modal.classList.remove('active');
    // Clear inputs
    inpWord.value = '';
    inpIpa.value = '';
    inpDef.value = '';
}

function addWord() {
    const word = inpWord.value.trim();
    const ipa = inpIpa.value.trim();
    const def = inpDef.value.trim();

    if (!word || !def) {
        alert("Please enter at least a Word and Definition!");
        return;
    }

    // Add new word to the BEGINNING of the list (so user sees it first)
    const newCard = { word, ipa, def };
    vocabList.unshift(newCard);

    // Save to LocalStorage
    saveData();

    // Reset index to 0 (to show new word) and render
    currentIndex = 0;
    renderCard();

    closeModal();
}

// 5. INITIALIZATION

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW Registered!', reg))
            .catch(err => console.log('SW Failed!', err));
    });
}

// Initial Render
renderCard();

// Install Prompt Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
        deferredPrompt = null;
    });
});
