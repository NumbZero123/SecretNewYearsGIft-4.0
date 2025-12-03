const envelope = document.getElementById('envelope');
const seal = document.getElementById('seal');
const letterWrap = document.getElementById('letterWrap');
const messageElement = document.getElementById('message');
const signatureElement = document.getElementById('signature');
const choicesContainer = document.getElementById('choices');

const messages = [
  "I’ve known you since February, and these months have meant so much. You bring joy simply by being yourself, and I’ve started smiling more when we hang out—something I rarely did before. I love your kindness, your laugh, and your heart. It would be a true honor to be your boyfriend this year and make you as happy as you make me. ❤️",
  "Hey princess 👑 — this might be a little bold, but I can’t hide it. Spending time with you makes everything brighter. I still smile remembering our movie night with The Nun. Would you grant me the honor of being your boyfriend this year and making more memories together? 💖",
  "These past months, I’ve realized how much you mean to me. Your presence makes ordinary moments special and I find myself smiling more than I used to. I would be honored to be your boyfriend this year and share the little and big moments with you. 💙❤️",
  "I can’t help but smile when I think of our time together. You’re thoughtful, sweet, and so beautiful. If you’d let me, I’d be honored to be your boyfriend this year—let’s laugh, explore, and make memories. 😄💖",
  "Princess 👑, I’ve wanted to tell you for a while: you make me happier just by being you. I cherish our little moments, like that movie night. I would truly be honored if I could be your boyfriend this year and see where this takes us. ❤️💙"
];

let isTyping=false;
let opened=false;

function typeWriter(text, callback=null){
  if(isTyping) return;
  isTyping=true;
  messageElement.innerHTML='';
  signatureElement.classList.add('hidden');
  const chars=Array.from(text);
  let i=0;
  function step(){
    if(i<chars.length){
      messageElement.innerHTML += (chars[i]==='\n'?'<br>':chars[i]);
      i++;
      setTimeout(step,18+Math.random()*50);
    } else {
      isTyping=false;
      signatureElement.classList.remove('hidden');
      if(callback) callback();
    }
  }
  step();
}

function openLetter(){
  if(opened||isTyping) return;
  opened=true;
  envelope.classList.add('hidden');
  seal.classList.add('broken');
  setTimeout(()=>{
    letterWrap.classList.add('active');
    const msg = messages[Math.floor(Math.random()*messages.length)];
    setTimeout(()=>typeWriter(msg,()=>choicesContainer.classList.remove('hidden')),300);
  },400);
}

function resetLetter(callback=null){
  choicesContainer.classList.add('hidden');
  messageElement.innerHTML='';
  signatureElement.classList.add('hidden');
  letterWrap.classList.remove('active');
  envelope.classList.remove('hidden');
  seal.classList.remove('broken');
  opened=false;
  if(callback) setTimeout(callback,400);
}

seal.classList.add('animate');
seal.addEventListener('click',openLetter);
seal.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' ')openLetter();});

choicesContainer.addEventListener('click',(e)=>{
  if(!e.target.classList.contains('choice-btn')||isTyping) return;
  const choice=e.target.dataset.choice;
  choicesContainer.classList.add('hidden');

  if(choice==='yes'){
    typeWriter("Yay! 💖 I’m so happy. I promise I’ll do my best to make you smile every day. 😍");
  } else if(choice==='no'){
    typeWriter("Aw… 😢 That's okay. If you'd like, you can try again or maybe later.",()=>{
      choicesContainer.innerHTML=`
        <button class="choice-btn" data-choice="retry">Try Again 🔄</button>
        <button class="choice-btn" data-choice="exit">Maybe Later ❌</button>`;
      choicesContainer.classList.remove('hidden');
    });
  } else if(choice==='retry'){
    resetLetter(()=>{setTimeout(openLetter,250); choicesContainer.innerHTML=`
      <button class="choice-btn" data-choice="yes">Yes 💖</button>
      <button class="choice-btn" data-choice="no">No 😢</button>`;
    });
  } else if(choice==='exit'){
    typeWriter("Okay… maybe another time. Thank you for reading. 💙");
  }
});
