const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;

    appendMessage(message, 'user');
    userInput.value = '';

    try {
        // IMPORTANT: Replace 'YOUR_WORKER_URL' with the actual URL of your deployed Cloudflare Worker
        const WORKER_URL = 'https://test.study2882.dpdns.org/chat';
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: message })
        });

        const data = await response.json();

        if (data.success) {
            // The response structure for gpt-oss-120b is complex, extract the actual message
            const aiResponse = data.result.output.find(item => item.type === 'message')?.content[0]?.text;
            if (aiResponse) {
                appendMessage(aiResponse, 'ai');
            } else {
                appendMessage('Error: Could not parse AI response.', 'ai');
                console.error('AI response structure:', data);
            }
        } else {
            appendMessage(`Error: ${data.errors[0].message}`, 'ai');
            console.error('API Error:', data.errors);
        }
    } catch (error) {
        appendMessage('Error: Could not connect to the AI service.', 'ai');
        console.error('Fetch error:', error);
    }
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

function appendMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content');
    contentElement.textContent = text;

    messageElement.appendChild(contentElement);
    chatBox.appendChild(messageElement);
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Initial welcome message
appendMessage('Hello! How can I help you today?', 'ai');
