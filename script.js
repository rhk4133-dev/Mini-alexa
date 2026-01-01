const statusText = document.getElementById("status");
const orb = document.querySelector(".orb");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";
recognition.interimResults = false;

let speaking = false;

/* SPEAK FUNCTION */
function speak(text) {
  speaking = true;
  recognition.stop();

  statusText.textContent = "Speaking...";

  const msg = new SpeechSynthesisUtterance(text);
  msg.volume = 1;   // MAX volume
  msg.rate = 1;
  msg.pitch = 1;

  msg.onend = () => {
    speaking = false;
    statusText.textContent = "Listening...";
    recognition.start();
  };

  speechSynthesis.speak(msg);
}

/* COMMAND LOGIC */
function handleCommand(command) {
  command = command.toLowerCase();

  if (command.includes("hello") || command.includes("hi")) {
    speak("Hello. I am your mini assistant.");
  }

  else if (command.includes("your name")) {
    speak("You can call me Nova.");
  }

  else if (command.includes("time")) {
    speak("The current time is " + new Date().toLocaleTimeString());
  }

  else if (command.includes("date")) {
    speak("Today is " + new Date().toDateString());
  }

  else if (command.includes("how are you")) {
    speak("I am running perfectly and ready to help you.");
  }

  else if (command.includes("open google")) {
    speak("Opening Google.");
    window.open("https://google.com", "_blank");
  }

  else if (command.includes("open youtube")) {
    speak("Opening YouTube.");
    window.open("https://youtube.com", "_blank");
  }

  else if (command.includes("who made you")) {
    speak("You created me using JavaScript and imagination.");
  }

  else if (command.includes("joke")) {
    const jokes = [
      "Why do programmers hate nature? Too many bugs.",
      "I tried to catch a bug, but it was a feature.",
      "Why did JavaScript break up with HTML? Too many tags.",
      "Debugging is like being a detective in your own crime."
    ];
    speak(jokes[Math.floor(Math.random() * jokes.length)]);
  }

  else if (command.includes("stop")) {
    speak("Okay. I will stay silent.");
  }

  else {
    speak("I heard you, but I am still learning new commands.");
  }
}

/* LISTENING EVENTS */
recognition.onresult = (event) => {
  if (speaking) return;

  const last = event.results[event.results.length - 1][0].transcript;
  statusText.textContent = "You said: " + last;

  handleCommand(last);
};

recognition.onerror = () => {
  if (!speaking) recognition.start();
};

recognition.onend = () => {
  if (!speaking) recognition.start();
};

// AUTO START
recognition.start();