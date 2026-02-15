const orb = document.getElementById("orb");
const wave = document.getElementById("wave");
const statusText = document.getElementById("status");

const API_KEY = "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";

let recognition;
let isActive = false;
let isSpeaking = false;

function speak(text) {
    isSpeaking = true;

    orb.classList.remove("listening");
    wave.classList.remove("active");
    orb.classList.add("speaking");

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    speech.onend = () => {
        isSpeaking = false;
        orb.classList.remove("speaking");

        if (isActive) {
            startListening();
        }
    };

    window.speechSynthesis.speak(speech);
}

async function askAI(question) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct",
                messages: [{ role: "user", content: question }]
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        return "API error. Check your key.";
    }
}

function startListening() {

    if (!('webkitSpeechRecognition' in window)) {
        alert("Speech recognition not supported on this device.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    orb.classList.add("listening");
    wave.classList.add("active");
    statusText.innerText = "Listening...";

    recognition.start();

    recognition.onresult = async function(event) {

        if (isSpeaking) return;

        const transcript = event.results[event.results.length - 1][0].transcript;

        recognition.stop();

        statusText.innerText = "Processing...";
        const reply = await askAI(transcript);
        speak(reply);
    };

    recognition.onerror = function(event) {
        console.log("Speech error:", event.error);
    };

    recognition.onend = function() {
        if (isActive && !isSpeaking) {
            startListening();
        }
    };
}

orb.addEventListener("click", () => {
    if (!isActive) {
        isActive = true;

        // START MIC IMMEDIATELY (mobile requirement)
        startListening();

        speak("R H K activated.");
    }
});