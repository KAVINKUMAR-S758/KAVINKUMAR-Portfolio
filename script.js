// Hero terminal multi-line typewriter
const terminalLines = [
  "Web Application Pentesting",
  "Mobile Application Pentesting",
  "API Pentesting",
  "Network Pentesting",
];

const terminalTextEls = document.querySelectorAll(".terminal-text");
let currentTerminalIndex = 0;
let currentCharIndex = 0;
let isErasing = false;

function updateTerminal() {
  if (!terminalTextEls.length) return;

  terminalTextEls.forEach((el) => {
    el.textContent = "";
  });

  const currentText = terminalLines[currentTerminalIndex];
  const visibleChars = currentText.slice(0, currentCharIndex);
  terminalTextEls[currentTerminalIndex].textContent = visibleChars;

  if (!isErasing && currentCharIndex < currentText.length) {
    currentCharIndex++;
  } else if (!isErasing && currentCharIndex === currentText.length) {
    isErasing = true;
    setTimeout(updateTerminal, 1000);
    return;
  } else if (isErasing && currentCharIndex > 0) {
    currentCharIndex--;
  } else if (isErasing && currentCharIndex === 0) {
    isErasing = false;
    currentTerminalIndex = (currentTerminalIndex + 1) % terminalLines.length;
  }

  const speed = isErasing ? 50 : 90;
  setTimeout(updateTerminal, speed);
}

updateTerminal();

// Smooth scroll
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.addEventListener("click", (e) => {
  const scrollBtn = e.target.closest("[data-scroll-to]");
  if (scrollBtn) {
    const target = scrollBtn.getAttribute("data-scroll-to");
    if (target) smoothScrollTo(target);
  }
});

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

document
  .querySelectorAll('.main-nav a[href^="#"]')
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href) smoothScrollTo(href);
      if (navLinks && navToggle) {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

// Mobile nav
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("is-open");
  });
}

// Intersection Observer animations for .observe
const observerOptions = { threshold: 0.15 };
const animatedElements = document.querySelectorAll(".observe");

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay;
      if (delay) el.style.transitionDelay = delay;
      el.classList.add("is-visible");
      io.unobserve(el);
    }
  });
}, observerOptions);

animatedElements.forEach((el) => io.observe(el));

// Expandable About cards
document.querySelectorAll(".expand-card").forEach((card) => {
  const header = card.querySelector(".expand-header");
  const body = card.querySelector(".expand-body");
  const icon = card.querySelector(".expand-icon");
  if (!header || !body || !icon) return;

  header.addEventListener("click", () => {
    const expanded = header.getAttribute("aria-expanded") === "true";
    header.setAttribute("aria-expanded", String(!expanded));
    card.setAttribute("aria-expanded", String(!expanded));

    if (!expanded) {
      body.style.maxHeight = body.scrollHeight + "px";
      body.style.opacity = "1";
      icon.textContent = "–";
    } else {
      body.style.maxHeight = "0";
      body.style.opacity = "0";
      icon.textContent = "+";
    }
  });
});

// Timeline
document.querySelectorAll(".timeline-item").forEach((item) => {
  const header = item.querySelector(".timeline-header");
  const body = item.querySelector(".timeline-body");
  const toggle = item.querySelector(".timeline-toggle");
  if (!header || !body || !toggle) return;

  header.addEventListener("click", () => {
    const expanded = header.getAttribute("aria-expanded") === "true";
    header.setAttribute("aria-expanded", String(!expanded));

    if (!expanded) {
      body.style.maxHeight = body.scrollHeight + "px";
      body.style.opacity = "1";
      toggle.textContent = "–";
    } else {
      body.style.maxHeight = "0";
      body.style.opacity = "0";
      toggle.textContent = "+";
    }
  });
});

// Tools / skills filters
const filterButtons = document.querySelectorAll(".filter-btn");
const skillCards = document.querySelectorAll(".skill-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });

    skillCards.forEach((card) => {
      const scope = (card.dataset.scope || "").split(/\s+/);
      const show = filter === "all" || scope.includes(filter);
      card.style.display = show ? "" : "none";
    });
  });
});

// Modals
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const modals = document.querySelectorAll(".modal");

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal || !modalBackdrop) return;
  modalBackdrop.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModals() {
  if (modalBackdrop) modalBackdrop.hidden = true;
  modals.forEach((m) => m.setAttribute("aria-hidden", "true"));
  document.body.style.overflow = "";
}

document.querySelectorAll(".modal-open").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-modal");
    if (id) openModal(id);
  });
});

document.querySelectorAll(".modal-close").forEach((btn) => {
  btn.addEventListener("click", () => closeModals());
});

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", () => closeModals());
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModals();
});

// Email copy
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = btn.getAttribute("data-copy") || "";
    const label = btn.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(value);
      if (label) label.textContent = "Copied";
      setTimeout(() => {
        if (label) label.textContent = "Copy";
      }, 1500);
    } catch {
      if (label) label.textContent = "Press Ctrl+C";
    }
  });
});

// EmailJS contact form
emailjs.init({
  publicKey: "_dBb5l6bf3jlt8AZ_",
});

const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const statusEl = contactForm.querySelector(".form-status");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = contactForm.elements["from_name"];
    const email = contactForm.elements["reply_to"];
    const message = contactForm.elements["message"];

    let valid = true;

    function setError(field, msg) {
      const wrapper = field.closest(".field");
      if (!wrapper) return;
      const errEl = wrapper.querySelector(".field-error");
      if (errEl) errEl.textContent = msg || "";
    }

    [name, email, message].forEach((f) => setError(f, ""));

    if (!name.value.trim()) {
      setError(name, "Please enter your name.");
      valid = false;
    }

    if (!email.value.trim()) {
      setError(email, "Please enter your email.");
      valid = false;
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) {
      setError(email, "Please enter a valid email address.");
      valid = false;
    }

    if (!message.value.trim()) {
      setError(message, "Please enter a brief message.");
      valid = false;
    }

    if (!valid) {
      statusEl.textContent = "Please fix the highlighted fields and try again.";
      statusEl.style.color = "#f97373";
      return;
    }

    statusEl.textContent = "Sending message…";
    statusEl.style.color = "#9ca3af";

    const SERVICE_ID = "service_vsk0m9p";
    const TEMPLATE_ID = "template_t00r4mg";

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, {
        from_name: name.value.trim(),
        reply_to: email.value.trim(),
        message: message.value.trim(),
      })
      .then(() => {
        statusEl.textContent = "Message sent successfully.";
        statusEl.style.color = "#22c55e";
        contactForm.reset();
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        statusEl.textContent =
          "Unable to send message right now. Please try again in a moment.";
        statusEl.style.color = "#f97373";
      });
  });
}

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
