/* =========================================================
   SKALDARIA AUTOPEÇAS – interações
   ========================================================= */

/* >>> CONFIRMAR COM O CLIENTE os números de WhatsApp de cada loja (formato 55 + DDD + número). <<<
   Por enquanto cada loja usa o próprio telefone fixo (funciona se for WhatsApp Business). */
const WHATSAPP = {
  padrao:     '553131913277',
  esmeraldas: '553131913277',
  ceuazul:    '553134958441',
  santaluzia: '553135153515',
};

const waLink = (msg, unidade = 'padrao') =>
  `https://wa.me/${WHATSAPP[unidade] || WHATSAPP.padrao}?text=${encodeURIComponent(msg)}`;

// Todos os elementos com data-wa viram links de WhatsApp com mensagem pronta
document.querySelectorAll('[data-wa]').forEach((el) => {
  el.href = waLink(el.dataset.wa, el.dataset.unit);
  el.target = '_blank';
  el.rel = 'noopener';
});

// Busca rápida → WhatsApp da unidade escolhida
const quickForm = document.getElementById('quickForm');
quickForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(quickForm);
  const veiculo = (f.get('veiculo') || '').toString().trim();
  const peca = (f.get('peca') || '').toString();
  let msg = 'Olá! Vim pelo site e gostaria de um orçamento';
  msg += peca ? ` de ${peca.toLowerCase()}` : '';
  msg += veiculo ? ` para o veículo: ${veiculo}.` : '.';
  window.open(waLink(msg, f.get('unidade')), '_blank', 'noopener');
});

// Menu mobile
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const closeNav = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });

// Sombra no header ao rolar
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Link ativo do menu conforme a seção
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['inicio', 'sobre', 'pecas', 'lojas', 'contato'].forEach((id) => {
  const s = document.getElementById(id);
  if (s) spy.observe(s);
});

// Animações de entrada
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  io.observe(el);
});

// Filtro de categorias (linha leve / pesada)
const tabs = document.querySelectorAll('.tab');
tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((t) => { t.classList.toggle('is-on', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
  const f = tab.dataset.filter;
  document.querySelectorAll('.card').forEach((card) => {
    const show = f === 'all' || card.dataset.line.split(' ').includes(f);
    card.classList.toggle('is-hidden', !show);
    if (show) card.classList.add('is-in');
  });
}));

// Carrossel de avaliações
const track = document.getElementById('carousel');
const step = () => (track.querySelector('.review')?.offsetWidth || 300) + 16;
const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
const next = () => track.scrollBy({ left: atEnd() ? -track.scrollWidth : step(), behavior: 'smooth' });
document.getElementById('revNext').addEventListener('click', next);
document.getElementById('revPrev').addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let timer;
const play = () => { if (!reduced) timer = setInterval(next, 5500); };
const stop = () => clearInterval(timer);
['mouseenter', 'focusin', 'touchstart'].forEach((ev) => track.addEventListener(ev, stop, { passive: true }));
['mouseleave', 'focusout'].forEach((ev) => track.addEventListener(ev, () => { stop(); play(); }));
play();

// Ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();
