// Mini ChatGPT Application
// Main script file for handling chat functionality, API integration, and UI interactions

// DOM Elements
const elements = {
    chatMessages: document.getElementById('chat-messages'),
    messageInput: document.getElementById('message-input'),
    sendButton: document.getElementById('send-button'),
    fileUploadButton: document.getElementById('file-upload-button'),
    fileUploadContainer: document.getElementById('file-upload-container'),
    fileUploadArea: document.getElementById('file-upload-area'),
    fileInput: document.getElementById('file-input'),
    uploadProgress: document.getElementById('upload-progress'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    loadingIndicator: document.getElementById('loading-indicator'),
    searchButton: document.getElementById('search-button'),
    searchContainer: document.getElementById('search-container'),
    searchInput: document.getElementById('search-input'),
    searchClear: document.getElementById('search-clear'),
    historyButton: document.getElementById('history-button'),
    historyContainer: document.getElementById('history-container'),
    historyClose: document.getElementById('history-close'),
    historyList: document.getElementById('history-list'),
    newChatButton: document.getElementById('new-chat-button'),
    settingsButton: document.getElementById('settings-button'),
    settingsContainer: document.getElementById('settings-container'),
    settingsClose: document.getElementById('settings-close'),
    lightThemeButton: document.getElementById('light-theme'),
    darkThemeButton: document.getElementById('dark-theme')
};

// API Configuration
const API_CONFIG = {
    key: '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',
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'openai/gpt-3.5-turbo'
};

// Application state
let chatHistory = [];
let chatSessions = [];
let currentSessionId = null;
let isLoading = false;

// Initialize the application
function init() {
    setupEventListeners();
    loadTheme();
    loadSessionsFromLocalStorage();
    
    // If no sessions exist, create a new one with initial message
    if (chatSessions.length === 0) {
        loadInitialMessage();
    } else {
        // Render the most recent session
        elements.chatMessages.innerHTML = '';
        chatHistory.forEach(message => renderMessage(message));
    }
}

// Setup event listeners
function setupEventListeners() {
    // Send message on button click
    elements.sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key press
    elements.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // File upload button click
    elements.fileUploadButton.addEventListener('click', toggleFileUpload);
    
    // File upload area click
    elements.fileUploadArea.addEventListener('click', () => {
        elements.fileInput.click();
    });
    
    // File input change
    elements.fileInput.addEventListener('change', handleFileUpload);
    
    // Drag and drop for files
    elements.fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.fileUploadArea.style.borderColor = 'var(--primary-color)';
        elements.fileUploadArea.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
    });
    
    elements.fileUploadArea.addEventListener('dragleave', () => {
        elements.fileUploadArea.style.borderColor = 'var(--border-color)';
        elements.fileUploadArea.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
    });
    
    elements.fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.fileUploadArea.style.borderColor = 'var(--border-color)';
        elements.fileUploadArea.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // Search functionality
    elements.searchButton.addEventListener('click', toggleSearch);
    elements.searchInput.addEventListener('input', handleSearch);
    elements.searchClear.addEventListener('click', clearSearch);
    
    // Close search when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.searchContainer.contains(e.target) && 
            !elements.searchButton.contains(e.target) && 
            elements.searchContainer.classList.contains('active')) {
            elements.searchContainer.classList.remove('active');
        }
    });
    
    // History functionality
    elements.historyButton.addEventListener('click', toggleHistory);
    elements.historyClose.addEventListener('click', toggleHistory);
    
    // New chat button
    elements.newChatButton.addEventListener('click', () => {
        createNewSession();
        // Add initial welcome message
        const initialMessage = {
            role: 'assistant',
            content: 'Hello! I\'m your Zaheer assistant. How can I help you today?'
        };
        chatHistory.push(initialMessage);
        renderMessage(initialMessage);
        saveSession();
        // Close history container
        elements.historyContainer.classList.remove('active');
    });
    
    // Close history when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.historyContainer.contains(e.target) && 
            !elements.historyButton.contains(e.target) && 
            elements.historyContainer.classList.contains('active')) {
            elements.historyContainer.classList.remove('active');
        }
    });
    
    // Settings functionality
    elements.settingsButton.addEventListener('click', toggleSettings);
    elements.settingsClose.addEventListener('click', toggleSettings);
    
    // Theme toggle
    elements.lightThemeButton.addEventListener('click', () => setTheme('light'));
    elements.darkThemeButton.addEventListener('click', () => setTheme('dark'));
    
    // Close settings when clicking outside
    document.addEventListener('click', (e) => {
        if (!elements.settingsContainer.contains(e.target) && 
            !elements.settingsButton.contains(e.target) && 
            elements.settingsContainer.classList.contains('active')) {
            elements.settingsContainer.classList.remove('active');
        }
    });
}

// Load initial welcome message
function loadInitialMessage() {
    createNewSession();
    const initialMessage = {
        role: 'assistant',
        content: 'Hello! I\'m your Zaheer assistant. How can I help you today?'
    };
    chatHistory.push(initialMessage);
    renderMessage(initialMessage);
    saveSession();
}

// Toggle history container
function toggleHistory() {
    elements.historyContainer.classList.toggle('active');
    if (elements.historyContainer.classList.contains('active')) {
        renderHistory();
    }
}

// Toggle settings container
function toggleSettings() {
    elements.settingsContainer.classList.toggle('active');
}

// Set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update active state of theme buttons
    if (theme === 'light') {
        elements.lightThemeButton.classList.add('active');
        elements.darkThemeButton.classList.remove('active');
    } else {
        elements.darkThemeButton.classList.add('active');
        elements.lightThemeButton.classList.remove('active');
    }
    
    // Save theme preference to local storage
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.error('Error saving theme to local storage:', error);
    }
}

// Load theme from local storage
function loadTheme() {
    try {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
    } catch (error) {
        console.error('Error loading theme from local storage:', error);
        // Default to dark theme
        setTheme('dark');
    }
}

// Create a new chat session
function createNewSession() {
    // First, save the current session if it has messages
    if (currentSessionId && chatHistory.length > 0) {
        saveSession();
    }
    
    const sessionId = Date.now().toString();
    const session = {
        id: sessionId,
        title: 'New Chat',
        messages: [],
        timestamp: new Date().toISOString()
    };
    
    chatSessions.push(session);
    currentSessionId = sessionId;
    chatHistory = [];
    
    // Clear chat messages
    elements.chatMessages.innerHTML = '';
    
    // Save sessions to local storage
    saveSessionsToLocalStorage();
}

// Save current session
function saveSession() {
    if (!currentSessionId) return;
    
    const sessionIndex = chatSessions.findIndex(session => session.id === currentSessionId);
    if (sessionIndex !== -1) {
        // Update session title based on the first user message
        const firstUserMessage = chatHistory.find(msg => msg.role === 'user');
        if (firstUserMessage) {
            chatSessions[sessionIndex].title = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
        } else if (chatHistory.length > 0) {
            // If no user message yet, use the first message (likely assistant welcome)
            chatSessions[sessionIndex].title = chatHistory[0].content.substring(0, 30) + (chatHistory[0].content.length > 30 ? '...' : '');
        }
        
        chatSessions[sessionIndex].messages = [...chatHistory];
        chatSessions[sessionIndex].timestamp = new Date().toISOString();
        
        // Save sessions to local storage
        saveSessionsToLocalStorage();
    }
}

// Load session
function loadSession(sessionId) {
    // First, save the current session if it has messages and is different from the one being loaded
    if (currentSessionId && currentSessionId !== sessionId && chatHistory.length > 0) {
        saveSession();
    }
    
    const session = chatSessions.find(session => session.id === sessionId);
    if (session) {
        currentSessionId = sessionId;
        chatHistory = [...session.messages];
        
        // Clear chat messages
        elements.chatMessages.innerHTML = '';
        
        // Render all messages
        chatHistory.forEach(message => renderMessage(message));
        
        // Close history container
        elements.historyContainer.classList.remove('active');
    }
}

// Render history
function renderHistory() {
    elements.historyList.innerHTML = '';
    
    // Sort sessions by timestamp (newest first)
    const sortedSessions = [...chatSessions].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    sortedSessions.forEach(session => {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${session.id === currentSessionId ? 'active' : ''}`;
        historyItem.onclick = () => loadSession(session.id);
        
        // Format timestamp
        const date = new Date(session.timestamp);
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        historyItem.innerHTML = `
            <div class="history-item-content">${session.title}</div>
            <div class="history-item-time">${timeString}</div>
        `;
        
        elements.historyList.appendChild(historyItem);
    });
}

// Save sessions to local storage
function saveSessionsToLocalStorage() {
    try {
        localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    } catch (error) {
        console.error('Error saving sessions to local storage:', error);
    }
}

// Load sessions from local storage
function loadSessionsFromLocalStorage() {
    try {
        const savedSessions = localStorage.getItem('chatSessions');
        if (savedSessions) {
            chatSessions = JSON.parse(savedSessions);
            if (chatSessions.length > 0) {
                // Load the most recent session
                const mostRecentSession = chatSessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
                currentSessionId = mostRecentSession.id;
                chatHistory = [...mostRecentSession.messages];
            }
        }
    } catch (error) {
        console.error('Error loading sessions from local storage:', error);
        // If there's an error, create a new session
        createNewSession();
    }
}

// Toggle file upload container
function toggleFileUpload() {
    elements.fileUploadContainer.classList.toggle('active');
}

// Handle file upload
function handleFileUpload(e) {
    if (e.target.files.length > 0) {
        handleFiles(e.target.files);
    }
}

// Handle files
function handleFiles(files) {
    // Show progress bar
    elements.uploadProgress.classList.add('active');
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        elements.progressBar.style.width = `${progress}%`;
        elements.progressText.textContent = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                elements.uploadProgress.classList.remove('active');
                elements.fileUploadContainer.classList.remove('active');
                
                // Add file message to chat
                const fileName = files[0].name;
                const fileSize = formatFileSize(files[0].size);
                const fileMessage = `Uploaded file: ${fileName} (${fileSize})`;
                
                addMessage('user', fileMessage);
                sendMessageToAPI(fileMessage);
            }, 500);
        }
    }, 200);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Toggle search container
function toggleSearch() {
    elements.searchContainer.classList.toggle('active');
    if (elements.searchContainer.classList.contains('active')) {
        elements.searchInput.focus();
    }
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm) {
        elements.searchClear.classList.add('active');
        
        // Filter messages based on search term
        const filteredMessages = chatHistory.filter(message => 
            message.content.toLowerCase().includes(searchTerm)
        );
        
        // Clear current messages
        elements.chatMessages.innerHTML = '';
        
        // Render filtered messages
        filteredMessages.forEach(message => renderMessage(message));
    } else {
        elements.searchClear.classList.remove('active');
        
        // Clear current messages
        elements.chatMessages.innerHTML = '';
        
        // Render all messages
        chatHistory.forEach(message => renderMessage(message));
    }
}

// Clear search
function clearSearch() {
    elements.searchInput.value = '';
    elements.searchClear.classList.remove('active');
    
    // Clear current messages
    elements.chatMessages.innerHTML = '';
    
    // Render all messages
    chatHistory.forEach(message => renderMessage(message));
}

// Send message
function sendMessage() {
    const message = elements.messageInput.value.trim();
    
    if (message && !isLoading) {
        elements.messageInput.value = '';
        addMessage('user', message);
        sendMessageToAPI(message);
    }
}

// Add message to chat
function addMessage(role, content) {
    const message = {
        role,
        content
    };
    
    chatHistory.push(message);
    renderMessage(message);
    scrollToBottom();
    
    // Save session after adding message
    saveSession();
}

// Render message
function renderMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.role}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message.content}</p>
        </div>
        <div class="message-meta">
            <span class="message-author">${message.role === 'user' ? 'You' : 'Zaheer'}</span>
        </div>
    `;
    
    elements.chatMessages.appendChild(messageDiv);
}

// Send message to API
async function sendMessageToAPI(message) {
    setLoading(true);
    
    try {
        const response = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.key}`,
                'X-Title': 'Mini ChatGPT'
            },
            body: JSON.stringify({
                model: API_CONFIG.model,
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    ...chatHistory
                ],
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'API request failed');
        }
        
        const data = await response.json();
        const assistantResponse = data.choices[0].message.content;
        
        addMessage('assistant', assistantResponse);
        saveSession();
    } catch (error) {
        console.error('Error calling API:', error);
        addMessage('assistant', 'Sorry, there was an error processing your request. Please try again later.');
        saveSession();
    } finally {
        setLoading(false);
    }
}

// Set loading state
function setLoading(state) {
    isLoading = state;
    if (state) {
        elements.loadingIndicator.classList.add('active');
        elements.sendButton.disabled = true;
    } else {
        elements.loadingIndicator.classList.remove('active');
        elements.sendButton.disabled = false;
    }
}

// Scroll to bottom of chat
function scrollToBottom() {
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);