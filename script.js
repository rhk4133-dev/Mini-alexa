const chatBox = document.getElementById("chatBox");

function addMessage(sender, message) {
    const msg = document.createElement("p");
    msg.innerHTML = "<strong>" + sender + ":</strong> " + message;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const userText = input.value.toLowerCase();
    if (userText === "") return;

    addMessage("You", userText);
    input.value = "";

    let reply = getReply(userText);
    setTimeout(() => {
        addMessage("RHK", reply);
        speak(reply);
    }, 500);
}

function getReply(text) {
    if (text.includes("hello")) return "Hello Raghav. How can I assist you?";
    if (text.includes("your name")) return "I am RHK, your personal AI assistant.";
    if (text.includes("time")) return "The current time is " + new Date().toLocaleTimeString();
    if (text.includes("who am i")) return "You are Raghav, future engineer.";
    return "I am still learning. Upgrade me.";
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event) {
        document.getElementById("userInput").value = event.results[0][0].transcript;
        sendMessage();
    };
}