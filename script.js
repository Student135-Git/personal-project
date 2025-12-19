/* ===== Footer Year (safe) ===== */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== Contact Form → Google Sheets ===== */
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxCSXdOTO-OGZfxEdbrYUY2zSrs03izkYGJGe5b854yE5Noe6QGkq6N6SUyW4Nytw1h/exec";

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("contactStatus");

if (form && statusEl) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusEl.textContent = "Sending...";
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    const payload = {
      name: form.elements.name?.value?.trim() || "",
      email: form.elements.email?.value?.trim() || "",
      message: form.elements.message?.value?.trim() || "",
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(payload),
      });

      statusEl.textContent = "✅ Sent! Thanks for reaching out.";
      form.reset();
    } catch (err) {
      statusEl.textContent =
        "❌ Could not send. Please try again later or email me directly.";
      console.error(err);
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}

/* ===== Shuffle Text Effect (Vanilla JS) ===== */
(function () {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const els = document.querySelectorAll(".shuffle");
  if (!els.length) return;

  const randChar = (set) => set[Math.floor(Math.random() * set.length)];

  const shuffleOnce = (el) => {
    if (prefersReduced) return;

    const finalText = el.dataset.text || el.textContent || "";
    const charset = el.dataset.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const duration = Number(el.dataset.duration || 1200);

    const start = performance.now();
    el.classList.add("is-shuffling");

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const lockCount = Math.floor(finalText.length * t);

      let out = "";
      for (let i = 0; i < finalText.length; i++) {
        const real = finalText[i];
        if (real === " ") out += " ";
        else out += i < lockCount ? real : randChar(charset);
      }

      el.textContent = out;

      if (t < 1) requestAnimationFrame(tick);
      else {
        el.textContent = finalText;
        el.classList.remove("is-shuffling");
      }
    };

    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        shuffleOnce(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );

  els.forEach((el) => {
    if (!el.dataset.text) el.dataset.text = el.textContent.trim();
    io.observe(el);
    el.addEventListener("mouseenter", () => shuffleOnce(el));
  });
})();

/* ===== Avatar Modal ===== */
const avatarThumb = document.getElementById("avatarThumb");
const avatarModal = document.getElementById("avatarModal");
const avatarModalClose = document.getElementById("avatarModalClose");

if (avatarThumb && avatarModal) {
  const closeModal = () => {
    avatarModal.classList.remove("active");
    avatarModal.setAttribute("aria-hidden", "true");
  };

  avatarThumb.addEventListener("click", () => {
    avatarModal.classList.add("active");
    avatarModal.setAttribute("aria-hidden", "false");
  });

  if (avatarModalClose) {
    avatarModalClose.addEventListener("click", closeModal);
  }

  avatarModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("avatar-modal-backdrop")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

