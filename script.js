const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-IN";
recognition.continuous = false;

let lastIntent = null; // conversation memory

function speak(text, lang = "en-IN") {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang;
  speechSynthesis.speak(msg);
}

function startListening() {
  recognition.start();
}

function detectLanguage(text) {
  if (/[ಅ-ಹ]/.test(text)) return "kn-IN";
  if (/[ऀ-ॿ]/.test(text)) return "hi-IN";
  return "en-IN";
}

function getIntent(text) {
  if (/hello|hi|hey|namaste|namaskara/.test(text)) return "greet";
  if (/time|samay|time entu/.test(text)) return "time";
  if (/date|dinank|tarikh/.test(text)) return "date";
  if (/who are you|tum kaun ho|neenu yaaru/.test(text)) return "identity";
  if (/help|madad|sahaya/.test(text)) return "help";
  return "unknown";
}

recognition.onresult = (event) => {
  const text = event.results[0][0].transcript.toLowerCase();
  document.getElementById("output").innerText = text;

  const lang = detectLanguage(text);
  const intent = getIntent(text);
  lastIntent = intent;

  respond(intent, lang);
};

function respond(intent, lang) {
  if (intent === "greet") {
    if (lang === "kn-IN") speak("ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸಹಾಯಕ.", lang);
    else if (lang === "hi-IN") speak("नमस्ते! मैं आपकी मदद के लिए हूँ।", lang);
    else speak("Hello! I am your assistant.", lang);
  }

  else if (intent === "time") {
    speak(new Date().toLocaleTimeString(), lang);
  }

  else if (intent === "date") {
    speak(new Date().toDateString(), lang);
  }

  else if (intent === "identity") {
    if (lang === "kn-IN") speak("ನಾನು ಮಿನಿ ಅಲೆಕ್ಸಾ.", lang);
    else if (lang === "hi-IN") speak("मैं मिनी एलेक्सा हूँ।", lang);
    else speak("I am Mini Alexa.", lang);
  }

  else if (intent === "help") {
    if (lang === "kn-IN")
      speak("ನೀವು ಸಮಯ, ದಿನಾಂಕ ಅಥವಾ ಸಹಾಯ ಕೇಳಬಹುದು.", lang);
    else if (lang === "hi-IN")
      speak("आप समय, तारीख या मदद पूछ सकते हैं।", lang);
    else
      speak("You can ask time, date, or help.", lang);
  }

  else {
    if (lang === "kn-IN")
      speak("ನಾನು ಇನ್ನೂ ಕಲಿಯುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.", lang);
    else if (lang === "hi-IN")
      speak("मैं अभी सीख रहा हूँ। फिर से कोशिश करें।", lang);
    else
      speak("I am still learning. Please try again.", lang);
  }
}
