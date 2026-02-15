const orb = document.getElementById("orb");
const statusText = document.getElementById("status");

const API_KEY = "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";

let recognition;
let isAwake = false;

function speak(text) {
    orb.classList.remove("listening");
    orb.classList.add("speaking");

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    speech.onend = () => {
        orb.classList.remove("speaking");
        startListening();
    };

    window.speechSynthesis.speak(speech);
}

async function askAI(question) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: question }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

function startListening() {
    if (!recognition) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.continuous = true;
    }

    orb.classList.add("listening");
    recognition.start();

    recognition.onresult = async function(event) {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();

        if (!isAwake && transcript.includes("hey r h k")) {
            isAwake = true;
            statusText.innerText = "Listening...";
            speak("Yes Raghav?");
            return;
        }

        if (isAwake) {
            isAwake = false;
            statusText.innerText = "Processing...";
            const reply = await askAI(transcript);
            speak(reply);
        }
    };

    recognition.onerror = function() {
        recognition.stop();
        startListening();
    };
}

/* First interaction required */
document.body.addEventListener("click", () => {
    speak("R H K activated.");
});