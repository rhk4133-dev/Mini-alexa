document.addEventListener("DOMContentLoaded", () => {
  const talkBtn = document.getElementById("talkBtn");
  const speakingBall = document.getElementById("speakingBall");
  const log = document.getElementById("log");

  let recognition;
  let listening = false;
  let speaking = false;

  // Speech Synthesis wrapper
  function speak(text) {
    return new Promise((resolve) => {
      speaking = true;
      updateSpeakingAnimation();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      // When speaking ends
      utterance.onend = () => {
        speaking = false;
        updateSpeakingAnimation();
        resolve();
      };

      // Cancel any current speech and speak new text
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    });
  }

  // Show or hide speaking animation
  function updateSpeakingAnimation() {
    if (speaking) {
      speakingBall.classList.add("active");
      talkBtn.disabled = true;
      talkBtn.style.cursor = "not-allowed";
    } else {
      speakingBall.classList.remove("active");
      talkBtn.disabled = false;
      talkBtn.style.cursor = "pointer";
    }
  }

  // Initialize Speech Recognition
  function initRecognition() {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition");
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();

    recog.lang = "en-US";
    recog.continuous = false; // single utterance, avoid confusion
    recog.interimResults = false;

    return recog;
  }

  // Start listening function
  async function startListening() {
    if (listening || speaking) return;

    recognition = initRecognition();
    if (!recognition) return;

    listening = true;
    log.textContent = "Listening... Speak now.";
    recognition.start();

    recognition.onresult = async (event) => {
      let transcript = event.results[0][0].transcript.toLowerCase();
      log.textContent = "You said: " + transcript;

      recognition.stop();
      listening = false;

      await processCommand(transcript);
    };

    recognition.onerror = (event) => {
      log.textContent = "Error occurred: " + event.error;
      listening = false;
    };

    recognition.onend = () => {
      listening = false;
      if (!speaking) log.textContent = "Press TALK and speak";
    };
  }

  // Handle recognized text
  async function processCommand(text) {
    if (text.includes("hello") || text.includes("hi")) {
      await speak("Hello! How can I help you?");
    } else if (text.includes("time")) {
      const now = new Date();
      await speak(`The time is ${now.toLocaleTimeString()}`);
    } else if (text.includes("date")) {
      const today = new Date();
      await speak(`Today is ${today.toDateString()}`);
    } else if (text.includes("open google")) {
      await speak("Opening Google for you");
      window.open("https://google.com", "_blank");
    } else if (text.includes("open youtube")) {
      await speak("Opening YouTube for you");
      window.open("https://youtube.com", "_blank");
    } else if (text.includes("stop") || text.includes("bye")) {
      await speak("Goodbye!");
    } else {
      await speak("I did not understand that. Please try again.");
    }

    log.textContent = "Press TALK and speak";
  }

  // Button click
  talkBtn.addEventListener("click", () => {
    startListening();
  });
});
