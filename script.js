document.getElementById("year").textContent = new Date().getFullYear();

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwm9005jtQjDHfkkZP-WlkoOvZmn8Cz764a6K26dnI4rRRT3NREVmIT8_q7c2RWaHGC/exec";

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

      // With no-cors, we can't read the response. If it didn't throw, assume success.
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
