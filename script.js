// Elements
const envelope = document.getElementById('envelope');
const seal = document.getElementById('seal');
const parchment = document.getElementById('parchment');
const messageElement = document.getElementById('message');
const choicesContainer = document.getElementById('choices');

// Messages (randomized)
const messages = [
  "I’ve known you since February, and these months have meant so much. You bring joy simply by being yourself, and I’ve started smiling more when we hang out—something I rarely did before. I love your kindness, your laugh, and your heart. It would be a true honor to be your boyfriend this year and make you as happy as you make me. ❤️",
  "Hey princess 👑 — this might be a little bold, but I can’t hide it. Spending time with you makes everything brighter. I still smile remembering our movie night with The Nun. Would you grant me the honor of being your boyfriend this year and making more memories together? 💖",
  "These past months, I’ve realized how much you mean to me. Your presence makes ordinary moments special and I find myself smiling more than I used to. I would be honored to be your boyfriend this year and share the little and big moments with you. 💙❤️",
  "I can’t help but smile when I think of our time together. You’re thoughtful, sweet, and so beautiful. If you’d let me, I’d be honored to be your boyfriend this year—let’s laugh, explore, and make memories. 😄💖",
  "Princess 👑, I’ve wanted to tell you for a while: you make me happier just by being you. I cherish our little moments, like that movie night. I would truly be honored if I could be your boyfriend this year and see where this takes us. ❤️💙"
];

// state
let currentMessage = '';
let isTyping = false;
let opened = false;

// stable quill-style typewriter (no overlaps)
function typeWriter(text, callback = null) {
  if (isTyping) return;
  isTyping = true;
  const chars = Array.from(text);
  let i = 0;
  messageElement.innerHTML = '';

  function step() {
    if (i < chars.length) {
      const ch = chars[i];
      messageElement.innerHTML += (ch === '\n') ? '<br>' : ch;
      i++;
      const delay = 18 + Math.random() * 60; // natural quill feel
      setTimeout(step, delay);
    } else {
      isTyping = false;
      if (callback) callback();
    }
  }
  step();
}

// open envelope animation and reveal parchment + type
function openLetter() {
  if (opened) return;
  opened = true;

  // animate seal "breaking"
  seal.classList.add('broken');
  // open flap + show parchment by adding open class
  envelope.classList.add('open');

  // pick a random message
  currentMessage = messages[Math.floor(Math.random() * messages.length)];

  // start typing after short delay so the paper scene feels natural
  setTimeout(() => {
    parchment.setAttribute('aria-hidden', 'false');
    typeWriter(currentMessage, () => {
      // reveal choices once typing finishes
      choicesContainer.classList.remove('hidden');
    });
  }, 650);
}

// reset to unopened state (used when retry)
function resetToClosed(callback = null) {
  // hide choices, clear message
  choicesContainer.classList.add('hidden');
  messageElement.innerHTML = '';

  // reverse animations
  envelope.classList.remove('open');
  // bring back seal (brief delay for aesthetic)
  setTimeout(() => {
    seal.classList.remove('broken');
    opened = false;
    if (callback) callback();
  }, 450);
}

// Attach click to seal + keyboard accessibility (Enter/Space)
seal.classList.add('animate'); // start heartbeat
seal.addEventListener('click', openLetter);
seal.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') openLetter();
});

// Event delegation for choice buttons
choicesContainer.addEventListener('click', (e) => {
  if (!e.target.classList.contains('choice-btn') || isTyping) return;
  const choice = e.target.dataset.choice;
  choicesContainer.classList.add('hidden');

  if (choice === 'yes') {
    // heartfelt confirmation
    typeWriter("Yay! 💖 I’m so happy. I promise I’ll do my best to make you smile every day. 😍");
  } else if (choice === 'no') {
    // gentle response, then show retry/exit
    typeWriter("Aw… 😢 That's okay. If you'd like, you can try again or maybe later.",  () => {
      // give two options
      choicesContainer.innerHTML = `
        <button class="choice-btn" data-choice="retry">Try Again 🔄</button>
        <button class="choice-btn" data-choice="exit">Maybe Later ❌</button>
      `;
      choicesContainer.classList.remove('hidden');
    });
  } else if (choice === 'retry') {
    // close, pick new message, open again
    resetToClosed(() => {
      // tiny delay then reopen
      setTimeout(() => {
        openLetter();
        // restore original yes/no markup for next time (keeps markup clean)
        choicesContainer.innerHTML = `
          <button class="choice-btn" data-choice="yes">Yes 💖</button>
          <button class="choice-btn" data-choice="no">No 😢</button>
        `;
      }, 220);
    });
  } else if (choice === 'exit') {
    typeWriter("Okay… maybe another time. Thank you for reading. 💙");
  }
});
