/**
 * HOW TO COMMAND HIS OBEDIENCE - INTERACTIVE SALES ENGINE
 */

// ==========================================================================
// 🔗 CONFIGURATION: SET YOUR SELAR PRODUCT LINK HERE
// ==========================================================================
const SELAR_CHECKOUT_URL = "https://selar.com/9v9203v295";

document.addEventListener('DOMContentLoaded', () => {
  // Update all Selar links automatically from configuration
  const selarLinks = document.querySelectorAll('.selar-link');
  selarLinks.forEach(link => {
    if (SELAR_CHECKOUT_URL && SELAR_CHECKOUT_URL !== "https://selar.com/9v9203v295") {
      link.setAttribute('href', SELAR_CHECKOUT_URL);
    }
  });

  // 1. DYNAMIC COUNTDOWN TIMER (Midnight / End of Day Urgency)
  function initCountdown() {
    const timerElements = document.querySelectorAll('.countdown-timer-value');
    if (!timerElements.length) return;

    function updateTimer() {
      const now = new Date();
      // Target is midnight tonight
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);

      let diff = Math.max(0, Math.floor((midnight - now) / 1000));

      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      const formatted = `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;

      timerElements.forEach(el => {
        el.textContent = formatted;
      });
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }
  initCountdown();

  // 2. INTERACTIVE QUIZ / DIAGNOSTIC
  const quizSteps = document.querySelectorAll('.quiz-step');
  const quizProgress = document.querySelector('.quiz-progress-fill');
  let currentStep = 1;
  let userResponses = [];

  window.selectQuizOption = function(step, score, type) {
    userResponses.push({ step, score, type });
    if (step < 3) {
      document.getElementById(`quiz-step-${step}`).classList.remove('active');
      currentStep = step + 1;
      document.getElementById(`quiz-step-${currentStep}`).classList.add('active');
      if (quizProgress) {
        quizProgress.style.width = `${(currentStep / 3) * 100}%`;
      }
    } else {
      // Calculate Result
      document.getElementById(`quiz-step-3`).classList.remove('active');
      document.getElementById('quiz-step-result').classList.add('active');
      if (quizProgress) quizProgress.style.width = '100%';

      const resultTitle = document.getElementById('quiz-result-title');
      const resultDesc = document.getElementById('quiz-result-desc');

      if (score >= 2) {
        resultTitle.textContent = "Your Pattern: The 'Over-Accommodating Negotiator' Dynamic";
        resultDesc.innerHTML = "You have an abundance of warmth, but in dating or relationships you have been inadvertently over-functioning, giving too much too early, or explaining yourself away. This causes men to treat your requests as negotiable suggestions. <strong>Chapter 4 ('The Soft Authority Voice') and Chapter 6 ('The Devotion Reward Loop') will be your immediate breakthrough.</strong>";
      } else {
        resultTitle.textContent = "Your Pattern: The 'Anxious Performer' Dynamic";
        resultDesc.innerHTML = "You find yourself auditioning for emotional safety, second-guessing communication cues, and letting men set the pace. <strong>Chapter 2 ('Dark Feminine Gravity') and Chapter 9 ('The Obsession Trigger') will permanently establish you in the prize position from day one.</strong>";
      }
    }
  };

  window.restartQuiz = function() {
    userResponses = [];
    currentStep = 1;
    quizSteps.forEach(s => s.classList.remove('active'));
    document.getElementById('quiz-step-1').classList.add('active');
    if (quizProgress) quizProgress.style.width = '33%';
  };

  // 3. CHAPTER ACCORDION
  const chapterItems = document.querySelectorAll('.chapter-item');
  chapterItems.forEach(item => {
    const header = item.querySelector('.chapter-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      chapterItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 5. FLOATING BOTTOM CTA BAR
  const floatingBar = document.getElementById('floating-bar');
  const heroSection = document.getElementById('hero');

  window.addEventListener('scroll', () => {
    if (!floatingBar || !heroSection) return;
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    if (window.scrollY > heroBottom - 100) {
      floatingBar.classList.add('visible');
    } else {
      floatingBar.classList.remove('visible');
    }
  });

  // 6. SAMPLE PREVIEW MODAL
  const previewModal = document.getElementById('preview-modal');

  window.openPreview = function() {
    if (previewModal) {
      previewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closePreview = function() {
    if (previewModal) {
      previewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (previewModal) {
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) {
        previewModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
});
