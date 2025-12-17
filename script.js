document.addEventListener("DOMContentLoaded", () => {
  const talkBtn = document.getElementById("talkBtn");
  const log = document.getElementById("log");

  let recognition;
  let listening = false;
  let speaking = false;

  // List of commands with keywords, reply (or function), and optional action
  const commands = [
    {
      keys: ["hello", "hi", "hey"],
      reply: "Hey there! How can I assist you today?",
    },
    {
      keys: ["how are you", "how are you doing"],
      reply: "I'm just code, but I'm doing great! Thanks for asking.",
    },
    {
      keys: ["your name"],
      reply: "I'm Mini Alexa, your voice assistant.",
    },
    {
      keys: ["time"],
      reply: () => `It's currently ${new Date().toLocaleTimeString()}.`,
    },
    {
      keys: ["date"],
      reply: () => `Today is ${new Date().toDateString()}.`,
    },
    {
      keys: ["open google"],
      reply: "Opening Google for you.",
      action: () => window.open("https://google.com", "_blank"),
    },
    {
      keys: ["open youtube"],
      reply: "Opening YouTube.",
      action: () => window.open("https://youtube.com", "_blank"),
    },
    {
      keys: ["thank you", "thanks"],
      reply: "You're welcome!",
    },
    {
      keys: ["stop listening", "stop"],
      reply: "Okay, I will stop listening now.",
      stopListening: true,
    },
  ];

  const fallbackReplies = [
    "I didn't catch that, could you say it again?",
    "Please try rephrasing that.",
    "I'm still learning, tell me something else.",
    "Sorry, I don't understand that yet.",
  ];

  function speak(text) {
    return new Promise((resolve) => {
      speaking = true;
      updateButtonState();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

      utterance.onend = () => {
        speaking = false;
        updateButtonState();
        resolve();
      };

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    });
  }

  function updateButtonState() {
    if (speaking) {
      talkBtn.disabled = true;
      talkBtn.textContent = "Speaking...";
    } else if (listening) {
      talkBtn.disabled = true;
      talkBtn.textContent = "Listening...";
    } else {
      talkBtn.disabled = false;
      talkBtn.textContent = "Talk";
    }
  }

  function initRecognition() {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser.");
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();

    recog.lang = "en-US";
    recog.continuous = false; // We'll restart manually for better control
    recog.interimResults = false;

    recog.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      log.textContent = "You said: " + transcript;

      recognition.stop();
      listening = false;
      updateButtonState();

      await processCommand(transcript);

      // Restart listening after reply
      if (!speaking) {
        startListening();
      }
    };

    recog.onend = () => {
      listening = false;
      updateButtonState();

      // Auto-restart recognition unless speaking or stopped
      if (!speaking && !stoppedByUser) {
        startListening();
      }
    };

    recog.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      listening = false;
      updateButtonState();

      // Try restarting on some errors
      if (event.error === "no-speech" || event.error === "aborted") {
        if (!stoppedByUser) startListening();
      }
    };

    return recog;
  }

  let stoppedByUser = false;

  async function processCommand(text) {
    for (const cmd of commands) {
      for (const key of cmd.keys) {
        if (text.includes(key)) {
          const reply = typeof cmd.reply === "function" ? cmd.reply() : cmd.reply;
          await speak(reply);
          if (cmd.action) cmd.action();
          if (cmd.stopListening) {
            stoppedByUser = true;
            recognition.stop();
            listening = false;
            updateButtonState();
          }
          return;
        }
      }
    }
    // Fallback reply
    const fallback = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    await speak(fallback);
  }

  function startListening() {
    if (listening || speaking) return;
    stoppedByUser = false;

    if (!recognition) recognition = initRecognition();
    if (!recognition) return;

    recognition.start();
    listening = true;
    updateButtonState();
    log.textContent = "Listening... Speak now.";
  }

  talkBtn.addEventListener("click", () => {
    if (!listening && !speaking) {
      startListening();
    }
  });

  // Initial button state
  updateButtonState();
});
