/* i18next owns the language resources; this DOM adapter preserves icons,
   form values, listeners and layout when changing language. */
(() => {
  'use strict';
  const toggle = document.querySelector('#language-toggle');
  const options = document.querySelector('#language-options');
  const code = toggle.querySelector('.language-code');
  const textState = new WeakMap();
  const attrState = new WeakMap();
  let observer;
  let pending = false;
  let language = 'fr';
  try { language = localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'fr'; } catch {}
  const translate = text => i18next.t(text, { defaultValue: text });
  const attributes = ['aria-label', 'placeholder', 'alt'];
  const isExcluded = node => node.parentElement?.closest('script,style,noscript,#language-options,.language-code');
  function applyLanguage() {
    observer?.disconnect();
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (isExcluded(node) || !node.nodeValue.trim()) continue;
      let state = textState.get(node);
      if (!state || node.nodeValue !== state.rendered) state = { source: node.nodeValue };
      const source = state.source.trim();
      const output = translate(source);
      state.rendered = state.source.replace(source, () => output);
      if (node.nodeValue !== state.rendered) node.nodeValue = state.rendered;
      textState.set(node, state);
    }
    document.querySelectorAll('[aria-label],[placeholder],[alt],meta[name="description"]').forEach(element => {
      if (element.closest('#language-options')) return;
      let states = attrState.get(element) || {};
      const names = element.matches('meta[name="description"]') ? ['content'] : attributes;
      names.forEach(name => {
        const value = element.getAttribute(name);
        if (!value) return;
        let state = states[name];
        if (!state || value !== state.rendered) state = { source: value };
        state.rendered = translate(state.source);
        if (value !== state.rendered) element.setAttribute(name, state.rendered);
        states[name] = state;
      });
      attrState.set(element, states);
    });
    document.documentElement.lang = i18next.language;
    code.textContent = i18next.language.toUpperCase();
    toggle.setAttribute('aria-label', i18next.language === 'en' ? 'Choose language' : 'Choisir la langue');
    options.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === i18next.language)));
    observer?.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: [...attributes, 'content'] });
  }
  function closeMenu(restoreFocus = false) {
    options.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    options.hidden = !options.hidden;
    toggle.setAttribute('aria-expanded', String(!options.hidden));
  });
  toggle.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); options.hidden = false; toggle.setAttribute('aria-expanded','true'); options.querySelector('button').focus(); }
  });
  options.addEventListener('keydown', event => {
    const buttons = [...options.querySelectorAll('button')];
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); const direction = event.key === 'ArrowDown' ? 1 : -1;
      buttons[(buttons.indexOf(document.activeElement) + direction + buttons.length) % buttons.length].focus();
    }
  });
  document.addEventListener('click', event => { if (!event.target.closest('.language-switch')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !options.hidden) closeMenu(true); });
  document.addEventListener('focusin', event => { if (!event.target.closest('.language-switch')) closeMenu(); });
  options.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', async () => {
    await i18next.changeLanguage(button.dataset.language);
    try { localStorage.setItem('portfolio-language', i18next.language); } catch {}
    closeMenu(true);
  }));
  i18next.init({ lng: language, fallbackLng: 'fr', supportedLngs: ['fr','en'], resources: window.portfolioLocales, keySeparator: false, nsSeparator: false, interpolation: { escapeValue: false } }).then(() => {
    observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; applyLanguage(); });
    });
    i18next.on('languageChanged', applyLanguage);
    applyLanguage();
  });
})();
