/* ===============================
   PARTICLE SYSTEM
================================ */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let particles = [];

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(120,200,255,0.8)";
    ctx.fill();
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===============================
   SPEECH + AI
================================ */
const statusText = document.getElementById("status");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";

let speaking = false;

/* 🔴 INSERT YOUR API KEY HERE */
const OPENAI_API_KEY = "AIzaSyAwlOx7do3D4ICerT1TXSuJaR9vNH7Hg_4";

/* SPEAK */
function speak(text) {
  speaking = true;
  recognition.stop();

  statusText.textContent = "Speaking...";

  const msg = new SpeechSynthesisUtterance(text);
  msg.volume = 1;
  msg.rate = 1;
  msg.pitch = 1;

  msg.onend = () => {
    speaking = false;
    statusText.textContent = "Listening...";
    recognition.start();
  };

  speechSynthesis.speak(msg);
}

/* CHATGPT REQUEST */
async function askAI(prompt) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful futuristic voice assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err) {
    return "I am having trouble connecting to my brain right now.";
  }
}

/* COMMAND HANDLER */
async function handleCommand(text) {
  text = text.toLowerCase();

  if (text.includes("stop listening")) {
    speak("Okay. I will pause.");
    return;
  }

  statusText.textContent = "Thinking...";
  const reply = await askAI(text);
  speak(reply);
}

/* LISTEN */
recognition.onresult = (e) => {
  if (speaking) return;

  const transcript = e.results[e.results.length - 1][0].transcript;
  statusText.textContent = "You said: " + transcript;

  handleCommand(transcript);
};

recognition.onend = () => {
  if (!speaking) recognition.start();
};

recognition.onerror = () => {
  if (!speaking) recognition.start();
};

recognition.start();