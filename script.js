const orb = document.getElementById("orb");

function speak(text) {
    orb.classList.remove("listening");
    orb.classList.add("speaking");

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    speech.onend = () => {
        orb.classList.remove("speaking");
    };

    window.speechSynthesis.speak(speech);
}

function getReply(text) {
    text = text.toLowerCase();

    if (text.includes("hello")) 
        return "Hello Raghav. I am R H K. Your personal AI assistant.";

    if (text.includes("time")) 
        return "The current time is " + new Date().toLocaleTimeString();

    if (text.includes("who am i")) 
        return "You are Raghav. Engineering student. Future system builder.";

    if (text.includes("motivate")) 
        return "Discipline beats motivation. Act even when you do not feel like it.";

    return "Command not recognized. Upgrade my intelligence.";
}

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-US";
    recognition.start();

    orb.classList.add("listening");

    recognition.onresult = function(event) {
        const userText = event.results[0][0].transcript;
        const reply = getReply(userText);
        speak(reply);
    };

    recognition.onerror = function() {
        orb.classList.remove("listening");
    };
}

orb.addEventListener("click", startListening);