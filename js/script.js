const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let W,
  H,
  particles = [];
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);
class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.4 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.45 + 0.08;
    // Orange/amber palette to match brand
    const colors = ["255,107,0", "255,149,0", "255,210,0", "0,212,161"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
}
for (let i = 0; i < 100; i++) particles.push(new Particle());
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x,
        dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255,107,0,${0.07 * (1 - d / 130)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}
function animParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  drawLines();
  requestAnimationFrame(animParticles);
}
animParticles();

// ── CURSOR GLOW ──
const glow = document.getElementById("cursorGlow");
document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ── NAV SCROLL ──
window.addEventListener("scroll", () => {
  document
    .getElementById("navbar")
    .classList.toggle("scrolled", window.scrollY > 60);
  document
    .getElementById("scrollTop")
    .classList.toggle("visible", window.scrollY > 400);
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.1 },
);
document
  .querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale")
  .forEach((el) => observer.observe(el));

// ── COUNTER ANIMATION ──
function animateCounter(el, target, suffix) {
  let start = 0;
  const dur = 2200;
  const step = 16;
  const inc = target / (dur / step);
  const timer = setInterval(() => {
    start = Math.min(start + inc, target);
    el.textContent = Math.floor(start) + (suffix || "");
    if (start >= target) clearInterval(timer);
  }, step);
}
const statsObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll("[data-target]").forEach((el) => {
          animateCounter(el, parseInt(el.dataset.target), "+");
        });
        statsObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.4 },
);
const statsEl = document.querySelector(".hero-stats");
if (statsEl) statsObs.observe(statsEl);

// ── SERVICE CARD MOUSE GLOW ──
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty(
      "--mx",
      ((e.clientX - r.left) / r.width) * 100 + "%",
    );
    card.style.setProperty(
      "--my",
      ((e.clientY - r.top) / r.height) * 100 + "%",
    );
  });
});

// ── COURSE FILTER ──
function filterCourses(mode, btn) {
  document
    .querySelectorAll(".ctab")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.querySelectorAll("#coursesGrid .course-card").forEach((card) => {
    const cardMode = card.getAttribute("data-mode") || "";
    if (mode === "all" || cardMode.includes(mode)) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

// ── FORM SUBMIT ──
function handleSubmit() {
  const inputs = document.querySelectorAll(
    ".contact-form input, .contact-form select, .contact-form textarea",
  );
  const name = inputs[0].value.trim();
  const phone = inputs[1].value.trim();
  if (!name || !phone) {
    alert("Please fill in your name and phone number.");
    return;
  }
  const msg = encodeURIComponent(
    `Hello Anil Sir! I'm ${name} (+91 ${phone}). I found OKLABS website and would like to enquire about your services/courses.`,
  );
  window.open(`https://wa.me/917999452711?text=${msg}`, "_blank");
}

// ── MOBILE MENU ──
function openMobile() {
  document.getElementById("mobileMenu").classList.add("open");
}
function closeMobile() {
  document.getElementById("mobileMenu").classList.remove("open");
}
