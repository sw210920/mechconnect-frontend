// footer.js
(function () {
  // fill current year
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // newsletter submit handling (fake - demo only)
  const form = document.getElementById('footerNewsletterForm');
  const emailInput = document.getElementById('footerNewsletterEmail');
  const msg = document.getElementById('footerNewsletterMessage');

  if (form && emailInput && msg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value && emailInput.value.trim();
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        msg.textContent = 'Please enter a valid email address.';
        msg.style.color = '#fecaca'; // error
        return;
      }
      // simulate send
      msg.textContent = 'Thanks for subscribing! We’ll be in touch.';
      msg.style.color = '#bbf7d0'; // success
      emailInput.value = '';
      // if you have a backend endpoint, send it with fetch here.
      // fetch('/api/subscribe', { method:'POST', body: JSON.stringify({email}), headers:{'Content-Type':'application/json'}})...
    });
  }

  // back to top
  const backBtn = document.getElementById('backToTopBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // show/hide on scroll (optional)
    const onScroll = () => {
      if (window.scrollY > 300) backBtn.style.opacity = '1';
      else backBtn.style.opacity = '0.4';
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
  }

  // Accessibility: remove outline only on mouse (not keyboard)
  (function () {
    const body = document.body;
    function handleMouse() {
      body.classList.add('using-mouse');
      window.removeEventListener('mousedown', handleMouse);
    }
    window.addEventListener('mousedown', handleMouse);
  })();
})();




// f-loader.js
(function () {

  const footerPlaceholder = document.querySelector("#footer");
  if (!footerPlaceholder) return;

  const scriptEl = document.currentScript;
  const base = scriptEl.src.replace(/\/[^\/]*$/, '/');
  const footerUrl = base + "footer.html";

  fetch(footerUrl, { cache: "no-store" })
    .then(res => res.text())
    .then(html => {
      footerPlaceholder.innerHTML = html;
      console.log("FOOTER LOADED");

      // Dispatch event to notify footer is inserted
      window.dispatchEvent(new Event("footer-loaded"));
    })
    .catch(err => console.error("Footer load error:", err));
})();
