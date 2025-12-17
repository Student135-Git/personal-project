document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("year").textContent = new Date().getFullYear();

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwm9005jtQjDHfkkZP-WlkoOvZmn8Cz764a6K26dnI4rRRT3NREVmIT8_q7c2RWaHGC/exec";

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("contactStatus");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    statusEl.textContent = "Sending...";
    const btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    const data = new FormData(form);

    try {
      const res = await fetch(SCRIPT_URL, {
        method: "POST",
        body: data,
      });

      // Some Apps Script setups return opaque responses; treat "ok" as success when possible
      if (!res.ok) throw new Error("Request failed");

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
