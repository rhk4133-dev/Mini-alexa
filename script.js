let recognition;
let isListening = false;

const synth = window.speechSynthesis;

function speak(text) {
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-IN";
  utter.rate = 1;
  synth.speak(utter);
}

function startAssistant() {
  if (isListening) return;

  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-IN";

  recognition.onstart = () => {
    isListening = true;
    speak("Hello, I am ready. You can ask me anything.");
  };

  recognition.onresult = (event) => {
    const transcript =
      event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();

    console.log("User said:", transcript);
    handleCommand(transcript);
  };

  recognition.onerror = () => {
    recognition.start(); // auto restart
  };

  recognition.onend = () => {
    if (isListening) recognition.start();
  };

  recognition.start();
}

// 🧠 Brain
function handleCommand(text) {

  // greetings
  if (text.includes("hello") || text.includes("hi")) {
    reply([
      "Hello! How can I help you?",
      "Hi there, tell me what you need",
      "Hello, I'm listening"
    ]);
    return;
  }

  // name
  if (text.includes("your name")) {
    reply([
      "My name is Mini Alexa",
      "You can call me your assistant",
      "I am your smart voice helper"
    ]);
    return;
  }

  // time
  if (text.includes("time")) {
    const time = new Date().toLocaleTimeString();
    speak("Current time is " + time);
    return;
  }

  // date
  if (text.includes("date")) {
    const date = new Date().toDateString();
    speak("Today's date is " + date);
    return;
  }

  // creator
  if (text.includes("who made you") || text.includes("created you")) {
    speak("I was created by Raghav using JavaScript");
    return;
  }

  // Kannada
  if (text.includes("kannada")) {
    speak("ನಾನು ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಮಾತನಾಡುತ್ತೇನೆ");
    return;
  }

  // math
  if (text.includes("plus") || text.includes("minus")) {
    try {
      const exp = text
        .replace("plus", "+")
        .replace("minus", "-")
        .replace("into", "*")
        .replace("divide", "/");
      const result = eval(exp.match(/[0-9+\-*/ ]+/)[0]);
      speak("The answer is " + result);
    } catch {
      speak("Sorry, I couldn't calculate that");
    }
    return;
  }

  // fallback (SMART not stupid)
  reply([
    "I heard you, but I am still learning",
    "That sounds interesting, tell me something else",
    "I am not fully trained for that yet"
  ]);
}

function reply(responses) {
  const msg = responses[Math.floor(Math.random() * responses.length)];
  speak(msg);
}
