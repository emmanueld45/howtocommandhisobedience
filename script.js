/**
 * HOW TO COMMAND HIS OBEDIENCE - INTERACTIVE SALES ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC COUNTDOWN TIMER
  function initCountdown() {
    const timerElements = document.querySelectorAll('.countdown-timer-value');
    if (!timerElements.length) return;

    // Get or set countdown target (e.g. 14 mins 42 secs from now)
    let countdownMinutes = 14;
    let countdownSeconds = 42;

    const savedTarget = localStorage.getItem('hth_timer_target');
    let targetTime;

    if (savedTarget && parseInt(savedTarget) > Date.now()) {
      targetTime = parseInt(savedTarget);
    } else {
      targetTime = Date.now() + (countdownMinutes * 60 + countdownSeconds) * 1000;
      localStorage.setItem('hth_timer_target', targetTime);
    }

    function updateTimer() {
      const now = Date.now();
      let diff = Math.max(0, Math.floor((targetTime - now) / 1000));

      if (diff <= 0) {
        // Reset to 15 min if expired for continuous urgency
        targetTime = Date.now() + 15 * 60 * 1000;
        localStorage.setItem('hth_timer_target', targetTime);
        diff = 15 * 60;
      }

      const m = Math.floor(diff / 60);
      const s = diff % 60;
      const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

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
        resultDesc.innerHTML = "You have an abundance of warmth (Light Femininity), but you have been inadvertently over-functioning and explaining yourself away. This causes men to treat your requests as negotiable suggestions rather than boundaries. <strong>The Chapter 4 'Soft Authority Voice' and Chapter 6 'Reward Loop' will be your immediate breakthrough.</strong>";
      } else {
        resultTitle.textContent = "Your Pattern: The 'Anxious Performer' Dynamic";
        resultDesc.innerHTML = "You find yourself auditioning for emotional safety and over-analyzing his texting cues and shifts in mood. <strong>Chapter 2 (Dark Feminine Gravity) and Chapter 9 (The Obsession Trigger) will permanently return you to the prize position.</strong>";
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
      // Optional: Close others
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

  // 6. MODALS MANAGEMENT
  const checkoutModal = document.getElementById('checkout-modal');
  const previewModal = document.getElementById('preview-modal');

  window.openCheckout = function(tier = 'master') {
    if (checkoutModal) {
      checkoutModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeCheckout = function() {
    if (checkoutModal) {
      checkoutModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  window.openPreview = function(previewType = 'intro') {
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

  // Close modals on backdrop click
  [checkoutModal, previewModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // 7. DYNAMIC ORDER BUMP CALCULATION
  const bumpCheckbox = document.getElementById('order-bump-check');
  const modalTotal = document.getElementById('modal-total-price');

  if (bumpCheckbox && modalTotal) {
    bumpCheckbox.addEventListener('change', () => {
      if (bumpCheckbox.checked) {
        modalTotal.textContent = '$36.99';
      } else {
        modalTotal.textContent = '$27.00';
      }
    });
  }

  // 8. SIMULATED CHECKOUT FORM SUBMISSION
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutContainer = document.getElementById('checkout-form-container');
  const checkoutSuccess = document.getElementById('checkout-success-container');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Processing Secure Order...</span>`;

      setTimeout(() => {
        if (checkoutContainer && checkoutSuccess) {
          checkoutContainer.style.display = 'none';
          checkoutSuccess.style.display = 'block';
        }
      }, 1200);
    });
  }

  // 9. SMOOTH SCROLL TO ORDER SECTION
  window.scrollToOrder = function() {
    const orderSection = document.getElementById('order-section');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
});
