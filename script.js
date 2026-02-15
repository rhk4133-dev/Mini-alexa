const orb = document.getElementById("orb");
const startup = document.getElementById("startup");

let recognition;
let isActive = false;

function speak(text) {
    orb.classList.remove("listening");
    orb.classList.add("speaking");

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    speech.onend = () => {
        orb.classList.remove("speaking");
        if (isActive) startListening();
    };

    window.speechSynthesis.speak(speech);
}

function getReply(text) {
    text = text.toLowerCase();

    if (text.includes("hello"))
        return "Hello Raghav. R H K online.";

    if (text.includes("time"))
        return "Current time is " + new Date().toLocaleTimeString();

    if (text.includes("who am i"))
        return "You are Raghav. Engineering student. Future AI architect.";

    if (text.includes("motivate"))
        return "Stop waiting for motivation. Execute with discipline.";

    return "Command not recognized. Expand my intelligence.";
}

function startListening() {
    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.continuous = false;
    }

    orb.classList.add("listening");

    recognition.start();

    recognition.onresult = function(event) {
        const userText = event.results[0][0].transcript;
        const reply = getReply(userText);
        speak(reply);
    };

    recognition.onerror = function() {
        orb.classList.remove("listening");
        if (isActive) startListening();
    };
}

orb.addEventListener("click", () => {
    if (!isActive) {
        isActive = true;
        speak("Continuous listening activated.");
    }
});