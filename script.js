// Guia da esteira de mídia — comportamento compartilhado (index.html + duvidas.html)

document.addEventListener('DOMContentLoaded', () => {
  setupActiveNav();
  setupCopyButtons();
});

// Marca no menu lateral qual etapa está visível na tela
function setupActiveNav() {
  const stages = document.querySelectorAll('[data-observe]');
  const links = document.querySelectorAll('.nav-col a');
  if (!stages.length || !links.length || !('IntersectionObserver' in window)) return;

  const linkById = {};
  links.forEach(a => {
    const id = a.getAttribute('href').replace('#', '');
    linkById[id] = a;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = linkById[id];
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  stages.forEach(s => observer.observe(s));
}

// Botão de copiar nos blocos de texto exato (APROVADO [x] / REPROVADO [x]: motivo)
function setupCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const targetSelector = btn.getAttribute('data-copy-target');
      const target = document.querySelector(targetSelector);
      if (!target) return;
      const text = target.innerText.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e2) { /* sem sorte */ }
        document.body.removeChild(ta);
      }
      const original = btn.textContent;
      btn.textContent = '✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1400);
    });
  });
}
