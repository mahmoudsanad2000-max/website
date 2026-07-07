const loader = document.getElementById("loader");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const reveals = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxTriggers = document.querySelectorAll(".lightbox-trigger");
const reviewTrack = document.getElementById("testimonialTrack");
const prevBtn = document.getElementById("prevTestimonial");
const nextBtn = document.getElementById("nextTestimonial");
const contactForm = document.querySelector(".contact-form");

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hide"), 500);
});

navToggle?.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("show"));
});

const storedTheme = localStorage.getItem("theme");
const isDarkDefault = storedTheme ? storedTheme === "dark" : true;
if (isDarkDefault) {
  document.body.classList.add("dark");
}
themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((el) => revealObserver.observe(el));

let counterStarted = false;
const counterSection = document.querySelector(".stats");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !counterStarted) {
        counterStarted = true;
        counters.forEach((counter) => animateCounter(counter));
      }
    });
  },
  { threshold: 0.35 }
);

if (counterSection) counterObserver.observe(counterSection);

function animateCounter(counter) {
  const target = +counter.dataset.target;
  const duration = 1600;
  const stepTime = 16;
  const totalSteps = Math.ceil(duration / stepTime);
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    const progress = currentStep / totalSteps;
    const value = Math.floor(target * easeOutCubic(progress));
    counter.textContent = value.toLocaleString();

    if (currentStep >= totalSteps) {
      counter.textContent = target.toLocaleString();
      clearInterval(timer);
    }
  }, stepTime);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

lightboxTriggers.forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

function scrollReviews(direction = 1) {
  if (!reviewTrack) return;
  const card = reviewTrack.querySelector(".review-shot");
  const step = card ? card.offsetWidth + 14 : 320;
  reviewTrack.scrollBy({
    left: direction * step,
    behavior: "smooth",
  });
}

nextBtn?.addEventListener("click", () => scrollReviews(1));
prevBtn?.addEventListener("click", () => scrollReviews(-1));

setInterval(() => scrollReviews(1), 4500);

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you! Your request has been sent successfully.");
  contactForm.reset();
});
