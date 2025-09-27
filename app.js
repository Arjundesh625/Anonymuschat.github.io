// Anonymous Chat Application
class AnonymousChatApp {
    constructor() {
        this.currentUser = '';
        this.currentStranger = '';
        this.chatMessages = [];
        this.isConnected = false;
        this.chatTimer = null;
        this.responseTimer = null;
        this.typingTimer = null;
        this.disconnectTimer = null;
        this.lastUserMessage = '';
        this.hasInitialMessage = false;
        
        // Chat data from JSON
        this.strangerNames = [
            "ChatUser_2847", "Wanderer_91", "NightOwl_456", "Explorer_73", "Dreamer_182", 
            "Phoenix_94", "Shadow_271", "Mystic_85", "Rebel_394", "Cosmic_67",
            "Luna_428", "Storm_159", "Void_736", "Echo_312", "Raven_847",
            "Sage_295", "Nova_674", "Frost_183", "Blaze_529", "Ocean_391"
        ];
        
        this.openingMessages = [
            "Hey there! How's your day going?",
            "Hi! What's up?",
            "Hello from somewhere in the world!",
            "Hey! Nice to meet you 👋",
            "Hi there! How are you doing?",
            "What's good? 😊",
            "Howdy! What brings you here?",
            "Hey! Ready for a random chat?",
            "Hello! What's on your mind today?",
            "Hi! Where are you from?"
        ];
        
        this.responses = [
            "That's interesting! Tell me more",
            "Cool! I've never thought about that",
            "Haha nice 😄",
            "Really? That sounds fun",
            "I totally get that",
            "Same here!",
            "That's awesome!",
            "Wow, interesting perspective",
            "Makes sense to me",
            "I can relate to that",
            "That's pretty cool",
            "Nice! What else do you like?",
            "Sounds like a good time",
            "I hear you",
            "That's a good point"
        ];
        
        this.questions = [
            "What's your favorite hobby?",
            "What kind of music do you like?",
            "What's the weather like where you are?",
            "What do you do for fun?",
            "Have any interesting plans for the weekend?",
            "What's your favorite movie genre?",
            "Are you more of a morning or night person?",
            "What's something you're passionate about?",
            "Do you like traveling?",
            "What's your favorite season?"
        ];
        
        this.disconnectMessages = [
            "Nice chatting with you! Take care 👋",
            "Gotta go now, bye!",
            "Was fun talking! See ya",
            "Time for me to head out, goodbye!",
            "Great chat! Catch you later"
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showScreen('welcomeScreen');
        // Ensure chat input is hidden initially
        document.getElementById('chatInputArea').classList.add('hidden');
    }
    
    bindEvents() {
        // Username input and start chat
        const usernameInput = document.getElementById('usernameInput');
        const startChatBtn = document.getElementById('startChatBtn');
        
        startChatBtn.addEventListener('click', () => this.startChat());
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startChat();
        });
        
        // Message input and send
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // End chat button
        const endChatBtn = document.getElementById('endChatBtn');
        endChatBtn.addEventListener('click', () => this.endChat());
        
        // Focus username input on load
        setTimeout(() => {
            usernameInput.focus();
        }, 100);
    }
    
    startChat() {
        const usernameInput = document.getElementById('usernameInput');
        const username = usernameInput.value.trim();
        
        if (!username) {
            this.showToast('Please enter a username');
            usernameInput.focus();
            return;
        }
        
        if (username.length < 2) {
            this.showToast('Username must be at least 2 characters');
            usernameInput.focus();
            return;
        }
        
        this.currentUser = username;
        this.findNewChat();
    }
    
    findNewChat() {
        // Clear previous chat data
        this.clearChatData();
        
        // Show connecting screen
        this.showScreen('connectingScreen');
        this.updateConnectionStatus('Connecting...');
        
        // Simulate connection delay
        setTimeout(() => {
            this.connectToStranger();
        }, Math.random() * 2000 + 1500); // 1.5-3.5 seconds
    }
    
    connectToStranger() {
        // Select random stranger name
        this.currentStranger = this.getRandomElement(this.strangerNames);
        
        // Show connected screen briefly
        this.showScreen('connectedScreen');
        document.getElementById('connectedMessage').textContent = `Connected to ${this.currentStranger}!`;
        
        // Update header
        this.updateConnectionStatus(`Connected to ${this.currentStranger}`);
        document.getElementById('endChatBtn').classList.remove('hidden');
        
        this.isConnected = true;
        this.hasInitialMessage = false;
        
        // Transition to chat after short delay
        setTimeout(() => {
            this.showChatScreen();
            this.startConversation();
        }, 2000);
    }
    
    showChatScreen() {
        this.showScreen('chatScreen');
        
        // Show chat input area
        const chatInputArea = document.getElementById('chatInputArea');
        chatInputArea.classList.remove('hidden');
        
        // Focus message input
        setTimeout(() => {
            const messageInput = document.getElementById('messageInput');
            messageInput.focus();
        }, 100);
        
        // Set random chat duration (2-8 minutes)
        const chatDuration = Math.random() * 360000 + 120000; // 2-8 minutes in ms
        this.disconnectTimer = setTimeout(() => {
            if (this.isConnected) {
                this.strangerDisconnect();
            }
        }, chatDuration);
    }
    
    startConversation() {
        // Prevent duplicate initial messages
        if (this.hasInitialMessage || !this.isConnected) return;
        this.hasInitialMessage = true;
        
        // Stranger sends opening message after brief delay
        setTimeout(() => {
            if (this.isConnected && !this.hasInitialMessage) return;
            const openingMessage = this.getRandomElement(this.openingMessages);
            this.receiveMessage(openingMessage);
        }, Math.random() * 2000 + 1000); // 1-3 seconds
    }
    
    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (!message || !this.isConnected) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.lastUserMessage = message.toLowerCase();
        
        // Clear input
        messageInput.value = '';
        
        // Simulate stranger response
        this.simulateStrangerResponse();
    }
    
    simulateStrangerResponse() {
        if (!this.isConnected) return;
        
        // Clear any existing response timer
        if (this.responseTimer) {
            clearTimeout(this.responseTimer);
            this.responseTimer = null;
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response after typing delay
        const typingDelay = Math.random() * 3000 + 1000; // 1-4 seconds
        
        this.typingTimer = setTimeout(() => {
            this.hideTypingIndicator();
            
            if (this.isConnected) {
                const response = this.generateStrangerResponse();
                this.receiveMessage(response);
                
                // Maybe ask a follow-up question
                if (Math.random() < 0.3) { // 30% chance
                    this.responseTimer = setTimeout(() => {
                        if (this.isConnected) {
                            const question = this.getRandomElement(this.questions);
                            this.receiveMessage(question);
                        }
                    }, Math.random() * 2000 + 1000);
                }
            }
        }, typingDelay);
    }
    
    generateStrangerResponse() {
        const message = this.lastUserMessage;
        
        // Context-aware responses
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return this.getRandomElement([
                "Hey! How's it going?",
                "Hi there! Nice to meet you",
                "Hello! What's up?",
                "Hey! Good to see you here"
            ]);
        }
        
        if (message.includes('good') || message.includes('great') || message.includes('fine')) {
            return this.getRandomElement([
                "That's awesome!",
                "Glad to hear that!",
                "Nice! Same here",
                "That's great to hear 😊"
            ]);
        }
        
        if (message.includes('bad') || message.includes('terrible') || message.includes('awful')) {
            return this.getRandomElement([
                "Oh no, sorry to hear that",
                "That sucks, hope things get better",
                "Aw man, that's rough",
                "Hope your day gets better!"
            ]);
        }
        
        if (message.includes('?')) {
            // User asked a question, give a more specific response
            return this.getRandomElement([
                "Good question! I'd say...",
                "Hmm, I think...",
                "That's interesting to think about",
                "Well, from my experience..."
            ]) + " " + this.getRandomElement(this.responses);
        }
        
        // Default to random response
        return this.getRandomElement(this.responses);
    }
    
    receiveMessage(message) {
        if (!this.isConnected) return;
        this.addMessage(message, 'stranger');
    }
    
    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${this.escapeHtml(text)}
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        
        // Smooth scroll to bottom
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
        
        // Store message
        this.chatMessages.push({ text, sender, time: now });
    }
    
    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.classList.remove('hidden');
        
        setTimeout(() => {
            indicator.classList.add('show');
            
            // Scroll to show indicator
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    }
    
    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        indicator.classList.remove('show');
        setTimeout(() => {
            indicator.classList.add('hidden');
        }, 150);
    }
    
    endChat() {
        if (!this.isConnected) return;
        
        this.isConnected = false;
        this.clearTimers();
        
        // Add system message
        this.addSystemMessage('You ended the chat');
        
        // Show disconnected screen
        document.getElementById('disconnectMessage').textContent = 'You ended the chat';
        this.showDisconnectedScreen();
    }
    
    strangerDisconnect() {
        if (!this.isConnected) return;
        
        this.isConnected = false;
        this.clearTimers();
        
        // Maybe stranger says goodbye
        if (Math.random() < 0.7) { // 70% chance
            const goodbyeMessage = this.getRandomElement(this.disconnectMessages);
            this.addMessage(goodbyeMessage, 'stranger');
            
            setTimeout(() => {
                this.addSystemMessage('Stranger disconnected');
                this.showDisconnectedScreen();
            }, 1000);
        } else {
            this.addSystemMessage('Stranger disconnected');
            this.showDisconnectedScreen();
        }
    }
    
    addSystemMessage(text) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system';
        messageDiv.innerHTML = `
            <div style="text-align: center; color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: var(--space-16) 0;">
                ${text}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    }
    
    showDisconnectedScreen() {
        this.hideTypingIndicator();
        document.getElementById('chatInputArea').classList.add('hidden');
        document.getElementById('endChatBtn').classList.add('hidden');
        this.updateConnectionStatus('Disconnected');
        
        this.showScreen('disconnectedScreen');
        
        // Auto-find new chat after delay
        setTimeout(() => {
            this.findNewChat();
        }, 3000);
    }
    
    clearChatData() {
        // Clear all chat messages
        this.chatMessages = [];
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';
        
        // Clear input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) messageInput.value = '';
        
        // Clear timers
        this.clearTimers();
        
        // Reset state
        this.isConnected = false;
        this.currentStranger = '';
        this.lastUserMessage = '';
        this.hasInitialMessage = false;
        
        // Hide typing indicator
        this.hideTypingIndicator();
    }
    
    clearTimers() {
        if (this.responseTimer) {
            clearTimeout(this.responseTimer);
            this.responseTimer = null;
        }
        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
            this.typingTimer = null;
        }
        if (this.disconnectTimer) {
            clearTimeout(this.disconnectTimer);
            this.disconnectTimer = null;
        }
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }
    
    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = status;
            
            if (status.includes('Connected')) {
                statusElement.classList.add('connected');
            } else {
                statusElement.classList.remove('connected');
            }
        }
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
    
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AnonymousChatApp();
});

// Prevent zoom on input focus (iOS)
document.addEventListener('touchstart', () => {}, true);

// Handle back button or page refresh
window.addEventListener('beforeunload', (e) => {
    if (window.app && window.app.isConnected) {
        e.preventDefault();
        e.returnValue = 'You have an active chat. Are you sure you want to leave?';
        return e.returnValue;
    }
});