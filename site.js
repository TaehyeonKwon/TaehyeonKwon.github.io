// Preserve links to sections of the former single-page homepage.
const formerSections = {
  research: 'research.html',
  publications: 'publications.html',
  conferences: 'experience.html',
  teaching: 'experience.html',
  cv: 'cv.html',
  contact: 'contact.html',
};

function followFormerSection() {
  const filename = window.location.pathname.split('/').pop();
  const destination = formerSections[window.location.hash.slice(1)];
  if ((!filename || filename === 'index.html') && destination) {
    window.location.replace(destination + window.location.hash);
  }
}

window.addEventListener('hashchange', followFormerSection);
followFormerSection();

// Animate the research keywords without changing the text read by screen readers.
const writer = document.querySelector('[data-typewriter]');
if (writer) {
  const line = writer.closest('.typing-line');
  const toggle = line.querySelector('.typing-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const words = ['Power system optimization', 'Artificial intelligence', 'Scalable algorithms'];
  let wordIndex = 0;
  let characterCount = 0;
  let deleting = false;
  let paused = false;
  let timer;
  writer.textContent = '';

  function typeNext() {
    if (paused || document.hidden || reducedMotion.matches) return;
    const word = words[wordIndex];
    characterCount += deleting ? -1 : 1;
    characterCount = Math.max(0, Math.min(characterCount, word.length));
    writer.textContent = word.slice(0, characterCount);
    let delay = deleting ? 35 : 65;

    if (!deleting && characterCount === word.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && characterCount === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }
    timer = window.setTimeout(typeNext, delay);
  }

  function syncTypingState() {
    window.clearTimeout(timer);
    toggle.hidden = reducedMotion.matches;
    if (reducedMotion.matches) {
      writer.textContent = words[0];
      wordIndex = 0;
      characterCount = words[0].length;
      deleting = true;
      line.dataset.state = 'static';
      return;
    }

    toggle.dataset.paused = String(paused);
    toggle.setAttribute('aria-pressed', String(paused));
    const label = paused ? 'Resume typing animation' : 'Pause typing animation';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    line.dataset.state = paused || document.hidden ? 'paused' : 'playing';
    if (!paused && !document.hidden) timer = window.setTimeout(typeNext, 500);
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    syncTypingState();
  });
  reducedMotion.addEventListener('change', syncTypingState);
  document.addEventListener('visibilitychange', syncTypingState);
  syncTypingState();
}
