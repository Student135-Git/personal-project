/* ===== Footer Year ===== */
document.getElementById("year").textContent = new Date().getFullYear();

/* ===== Contact Form → Google Sheets ===== */
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxeNadm44QlFtHZSTNJKppQR6SkGwCK4ThI5fYpPHkWSL7dah3Qyi4S84h3VgX3cZ-9/exec";

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("contactStatus");

if (form && statusEl) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusEl.textContent = "Sending...";
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      message: form.elements.message.value.trim(),
    };

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    const charset =
      el.dataset.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const duration = Number(el.dataset.duration || 650);

    const start = performance.now();
    el.classList.add("is-shuffling");

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const lockCount = Math.floor(finalText.length * t);

      let out = "";
      for (let i = 0; i < finalText.length; i++) {
        const real = finalText[i];
        if (real === " ") {
          out += " ";
          continue;
        }
        out += i < lockCount ? real : randChar(charset);
      }

      el.textContent = out;

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = finalText;
        el.classList.remove("is-shuffling");
      }
    };

    requestAnimationFrame(tick);
  };

  // Trigger once on scroll
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
