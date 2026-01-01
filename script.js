
const statusText = document.getElementById("status");
const orb = document.querySelector(".orb");
const video = document.getElementById("camera");

let speaking = false;

// CAMERA ACCESS
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(() => {
    statusText.textContent = "Camera permission denied";
  });

// SPEECH SETUP
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";

// SPEAK FUNCTION
function speak(text) {
  speaking = true;
  recognition.stop();

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;

  utter.onend = () => {
    speaking = false;
    recognition.start();
  };

  speechSynthesis.speak(utter);
}

// COMMAND HANDLER
function handleCommand(command) {
  command = command.toLowerCase();

  if (command.includes("hello")) {
    speak("Hello. I am your mini assistant.");
  }

  else if (command.includes("time")) {
    speak("The time is " + new Date().toLocaleTimeString());
  }

  else if (command.includes("date")) {
    speak("Today is " + new Date().toDateString());
  }

  else if (command.includes("open google")) {
    speak("Opening Google");
    window.open("https://google.com", "_blank");
  }

  else {
    speak("I heard you, but I am still learning.");
  }
}

// LISTENING
recognition.onresult = (event) => {
  if (speaking) return;

  const transcript = event.results[event.results.length - 1][0].transcript;
  statusText.textContent = "You said: " + transcript;

  handleCommand(transcript);
};

recognition.onerror = () => {
  if (!speaking) recognition.start();
};

recognition.onend = () => {
  if (!speaking) recognition.start();
};

// START AUTOMATICALLY
recognition.start();