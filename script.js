// Elements
const envelope = document.getElementById('envelope');
const seal = document.getElementById('seal');
const parchmentWrap = document.getElementById('parchmentWrap');
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

// stable typewriter
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
      const delay = 18 + Math.random() * 50;
      setTimeout(step, delay);
    } else {
      isTyping = false;
      if (callback) callback();
    }
  }
  step();
}

// open letter sequence
function openLetter() {
  if (opened || isTyping) return;
  opened = true;

  // break seal (fade out)
  seal.classList.add('broken');

  // after a short delay lift the flap and slide up parchment
  setTimeout(() => {
    envelope.classList.add('open');

    // reveal parchment wrapper (smooth opacity)
    parchmentWrap.setAttribute('aria-hidden', 'false');

    // pick random message
    currentMessage = messages[Math.floor(Math.random() * messages.length)];

    // type after slight delay so animation feels natural
    setTimeout(() => {
      typeWriter(currentMessage, () => {
        choicesContainer.classList.remove('hidden');
        choicesContainer.setAttribute('aria-hidden', 'false');
      });
    }, 460);
  }, 280);

  // fully hide the envelope visually after open (so it "disappears")
  setTimeout(() => {
    envelope.classList.add('hidden');
  }, 900);
}

// reset (used on retry)
function resetToClosed(callback = null) {
  // hide choices, clear message
  choicesContainer.classList.add('hidden');
  choicesContainer.setAttribute('aria-hidden', 'true');
  messageElement.innerHTML = '';

  // show envelope again
  envelope.classList.remove('hidden');
  envelope.classList.remove('open');
  envelope.setAttribute('aria-hidden', 'false');

  // restore seal (small delay for aesthetics)
  setTimeout(() => {
    seal.classList.remove('broken');
    opened = false;
    if (callback) callback();
  }, 420);
}

// attach seal heartbeat and click
seal.classList.add('animate');
seal.addEventListener('click', openLetter);
seal.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') openLetter();
});

// event delegation for choices
choicesContainer.addEventListener('click', (e) => {
  if (!e.target.classList.contains('choice-btn') || isTyping) return;
  const choice = e.target.dataset.choice;

  // hide choices while we respond
  choicesContainer.classList.add('hidden');
  choicesContainer.setAttribute('aria-hidden', 'true');

  if (choice === 'yes') {
    typeWriter("Yay! 💖 I’m so happy. I promise I’ll do my best to make you smile every day. 😍");
  } else if (choice === 'no') {
    typeWriter("Aw… 😢 That's okay. If you'd like, you can try again or maybe later.", () => {
      // show retry/exit
      choicesContainer.innerHTML = `
        <button class="choice-btn" data-choice="retry">Try Again 🔄</button>
        <button class="choice-btn" data-choice="exit">Maybe Later ❌</button>
      `;
      choicesContainer.classList.remove('hidden');
      choicesContainer.setAttribute('aria-hidden', 'false');
    });
  } else if (choice === 'retry') {
    // reset and reopen with new message
    resetToClosed(() => {
      setTimeout(() => {
        openLetter();
        // restore original yes/no buttons markup
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
