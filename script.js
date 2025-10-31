// ===== MENU LATERAL =====
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-btn');

if (menuBtn && sidebar && closeBtn) {
  menuBtn.addEventListener('click', () => sidebar.classList.add('open'));
  closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));
}

// ===== ACORDEÃO =====
document.addEventListener('DOMContentLoaded', () => {
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const contentId = button.getAttribute('data-periodo');
      const content = document.getElementById(contentId);

      content.classList.toggle('active');
      button.classList.toggle('active');

      accordionButtons.forEach(other => {
        const otherId = other.getAttribute('data-periodo');
        const otherContent = document.getElementById(otherId);
        if (other !== button && other.classList.contains('active')) {
          otherContent.classList.remove('active');
          other.classList.remove('active');
        }
      });
    });
  });
});

// ===== TROCA DE IDIOMA =====
document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('lang-toggle-btn');
  if (!langBtn) return;

  const langText = document.getElementById('lang-text');
  const path = window.location.pathname.toLowerCase();
  const isEnglish = path.includes('_en.html');
  const file = path.split('/').pop().replace('.html', '').replace('_en', '');
  const target = isEnglish ? `${file}.html` : `${file}_en.html`;

  if (isEnglish) {
    langText.textContent = 'Versão em Português';
  } else {
    langText.textContent = 'English Version';
  }

  langBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const base = path.includes('/assets/topicos/') ? './' : './';
    window.location.href = base + target;
  });
});

// --- Animação da "lâmpada" no logo ---
document.addEventListener('DOMContentLoaded', () => {
    const lampLogo = document.getElementById('lampLogo');
    if (!lampLogo) return;

    // Detecta o caminho certo de acordo com a página
    let basePath;
    if (window.location.pathname.includes('/topicos/')) {
        basePath = '../images/'; // subpáginas
    } else {
        basePath = './assets/images/'; // página inicial
    }

    const frames = [
        `${basePath}logo.png`,
        `${basePath}logo1.png`,
        `${basePath}logo2.png`,
        `${basePath}logo3.png`
    ];

    let currentFrame = 0;
    let intervalId;

    function animateForward() {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (currentFrame < frames.length - 1) {
                currentFrame++;
                lampLogo.src = frames[currentFrame];
            } else {
                clearInterval(intervalId);
            }
        }, 150);
    }

    function animateBackward() {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (currentFrame > 0) {
                currentFrame--;
                lampLogo.src = frames[currentFrame];
            } else {
                clearInterval(intervalId);
            }
        }, 150);
    }

    lampLogo.addEventListener('mouseenter', animateForward);
    lampLogo.addEventListener('mouseleave', animateBackward);
});


// ===== MODO ESCURO BOTÃO TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {

  const toggleBtn = document.getElementById('dark-mode-toggle'); 
  
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  };
  
  if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleDarkMode); 
  }

  // Inicialização
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }
});

// ===== MENU DE ACESSIBILIDADE =====
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('accessibility-btn');
  const menu = document.getElementById('accessibility-menu');
  const inc = document.getElementById('increase-font');
  const dec = document.getElementById('decrease-font');
  const reset = document.getElementById('reset-accessibility');
  const left = document.getElementById('align-left');
  const center = document.getElementById('align-center');
  const justify = document.getElementById('align-justify');
  const right = document.getElementById('align-right');

  // === Exibir / Ocultar menu ===
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('visible');
    });

    document.addEventListener('click', (e) => {

      const isClickInsideButton = btn.contains(e.target);
      
      if (!menu.contains(e.target) && !isClickInsideButton) {
        menu.classList.remove('visible');
      }
    });
  }

  // === Controle de Fonte ===
  let fontSizePercent = parseInt(localStorage.getItem('fontSizePercent'), 10);
  if (isNaN(fontSizePercent)) fontSizePercent = 100;

  const MIN_FONT = 70;
  const MAX_FONT = 160;

 
  const getTextElements = () => {
    const all = Array.from(document.querySelectorAll(`
      p, li, span, a, strong, em, h1, h2, h3, h4, h5, h6,
      .centralizar, .recursos-site-container, .recursos-cards, 
      .periodos-grid-container, .periodos, .periodo, .card,
      .elemento1, .titulo, .desc, .header, footer, .copy
    `));

    return all.filter(el =>
      !menu.contains(el) &&
      !el.closest('#sidebar') &&
      getComputedStyle(el).visibility !== 'hidden'
    );
  };

  // Salva tamanhos originais
  function initOriginalFonts() {
    const els = getTextElements();
    els.forEach(el => {
      if (!el.dataset.origFont) {
        const size = parseFloat(getComputedStyle(el).fontSize);
        el.dataset.origFont = size;
      }
    });
  }

  // Aplica fator de escala
  function applyFontScale() {
    const els = getTextElements();
    els.forEach(el => {
      const orig = parseFloat(el.dataset.origFont) || 16;
      el.style.fontSize = (orig * fontSizePercent / 100) + 'px';
    });
  }

  // Funções principais
  function increaseFont() {
    fontSizePercent = Math.min(MAX_FONT, fontSizePercent + 10);
    applyFontScale();
    localStorage.setItem('fontSizePercent', fontSizePercent);
  }

  function decreaseFont() {
    fontSizePercent = Math.max(MIN_FONT, fontSizePercent - 10);
    applyFontScale();
    localStorage.setItem('fontSizePercent', fontSizePercent);
  }

  function resetFont() {
    fontSizePercent = 100;
    const els = getTextElements();
    els.forEach(el => {
      el.style.fontSize = '';
    });
    localStorage.removeItem('fontSizePercent');
    document.body.classList.remove('align-left', 'align-center', 'align-justify', 'align-right');
  }

  // Alinhamento
  function alinhar(tipo) {
    document.body.classList.remove('align-left', 'align-center', 'align-justify', 'align-right');
    document.body.classList.add(`align-${tipo}`);
  }

  // Eventos
  if (inc) inc.addEventListener('click', increaseFont);
  if (dec) dec.addEventListener('click', decreaseFont);
  if (reset) reset.addEventListener('click', resetFont);
  if (left) left.addEventListener('click', () => alinhar('left'));
  if (center) center.addEventListener('click', () => alinhar('center'));
  if (justify) justify.addEventListener('click', () => alinhar('justify'));
  if (right) right.addEventListener('click', () => alinhar('right'));

  // Inicialização
  setTimeout(() => {
    initOriginalFonts();
    applyFontScale();
  }, 400);
});
