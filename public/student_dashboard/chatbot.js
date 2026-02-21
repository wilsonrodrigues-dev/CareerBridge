

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Pre-defined knowledge base from the problem statement
const botKnowledge = {
    "cutoff": "The standard cutoff is 7.0 CGPA with 0 active backlogs.", // [cite: 12]
    "venue": "All interviews are currently scheduled in the Main Seminar Hall.", // 
    "tcs": "TCS Digital Drive requires CS/MCA branches only.", // [cite: 12]
    "mock": "Let's practice! 'Tell me about a technical project you built.'", // [cite: 37]
    "default": "I'm not sure about that. Please contact the TPO Admin Dashboard for specific details."

};

function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

function handleResponse() {
    const input = userInput.value.toLowerCase();
    if (!input) return;

    addMessage(userInput.value, 'user');
    userInput.value = '';

    // Logic: Look for keywords to resolve queries instantly [cite: 37]
    setTimeout(() => {
        let response = botKnowledge["default"];
        if (input.includes("cutoff")) response = botKnowledge["cutoff"];
        else if (input.includes("venue")) response = botKnowledge["venue"];
        else if (input.includes("tcs")) response = botKnowledge["tcs"];
        else if (input.includes("mock")) response = botKnowledge["mock"];

        addMessage(response, 'bot');
    }, 500);
}

sendBtn.addEventListener('click', handleResponse);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleResponse(); });


const launcher = document.getElementById('chat-launcher');
const chatContainer = document.getElementById('chat-container');
const closeChat = document.getElementById('close-chat');

// Open Chat
launcher.addEventListener('click', () => {
    chatContainer.classList.remove('chat-hidden');
    launcher.classList.add('chat-hidden'); // Hide circle when open
});

// Close Chat
closeChat.addEventListener('click', () => {
    chatContainer.classList.add('chat-hidden');
    launcher.classList.remove('chat-hidden'); // Show circle when closed
});
// Function for Quick Question Buttons
function sendQuickQuery(key) {
    // 1. Get the answer from your existing botKnowledge
    const response = botKnowledge[key];
    
    // 2. Add the "User Question" to the chat visually
    let userText = "";
    if(key === 'cutoff') userText = "What is the cutoff?";
    if(key === 'venue') userText = "Where is the venue?";
    if(key === 'tcs') userText = "TCS Digital details?";
    if(key === 'mock') userText = "Start mock interview";

    addMessage(userText, 'user');

    // 3. Add the Bot's response with a small delay
    setTimeout(() => {
        addMessage(response, 'bot');
    }, 400);
}

// Optional: Dynamic Name Change
// You can call this when the page loads if you have the user's name
function setUserName(name) {
    document.getElementById('user-welcome').innerText = `Welcome, ${name}`;
}

// Keep all your existing addMessage and handleResponse functions below...


