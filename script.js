// Office Design - Main site interactions + Supabase contact form
(() => {
  "use strict";

  const SUPABASE_URL = "https://bgdexjxkdvltorcvkpvq.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Cb_uRCVqJk1x3drkGuuTwQ__a4aOha1";
  let supabaseClient = null;

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
  const reviewTrack = document.getElementById("testimonialTrack");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");
  const contactForm = document.querySelector(".contact-form");

  // Hide the page loader safely.
  window.addEventListener("load", () => {
    window.setTimeout(() => loader?.classList.add("hide"), 500);
  });

  // Mobile navigation.
  navToggle?.addEventListener("click", () => navLinks?.classList.toggle("show"));
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => navLinks?.classList.remove("show"));
  });

  // Theme preference.
  try {
    const storedTheme = localStorage.getItem("theme");
    const isDarkDefault = storedTheme ? storedTheme === "dark" : true;
    document.body.classList.toggle("dark", isDarkDefault);

    if (themeToggle) {
      themeToggle.textContent = isDarkDefault ? "☀️" : "🌙";
      themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        themeToggle.textContent = isDark ? "☀️" : "🌙";
        try {
          localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch (error) {
          console.warn("Could not save theme preference:", error);
        }
      });
    }
  } catch (error) {
    console.warn("Theme preference is unavailable:", error);
  }

  // Reveal animations and animated statistics.
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach((element) => revealObserver.observe(element));

    let counterStarted = false;
    const counterSection = document.querySelector(".stats");
    if (counterSection && counters.length) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !counterStarted) {
            counterStarted = true;
            counters.forEach(animateCounter);
            observer.disconnect();
          }
        });
      }, { threshold: 0.35 });
      counterObserver.observe(counterSection);
    }
  } else {
    reveals.forEach((element) => element.classList.add("visible"));
  }

  function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    if (!Number.isFinite(target)) return;
    const duration = 1600;
    const stepTime = 16;
    const totalSteps = Math.ceil(duration / stepTime);
    let currentStep = 0;
    const timer = window.setInterval(() => {
      currentStep += 1;
      const progress = Math.min(currentStep / totalSteps, 1);
      counter.textContent = Math.floor(target * easeOutCubic(progress)).toLocaleString();
      if (currentStep >= totalSteps) {
        counter.textContent = target.toLocaleString();
        window.clearInterval(timer);
      }
    }, stepTime);
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  // Back-to-top button.
  window.addEventListener("scroll", () => {
    backToTop?.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Delegated lightbox handler supports images injected after page load.
  function openLightbox(image) {
    if (!lightbox || !lightboxImg || !image) return;
    lightboxImg.src = image.currentSrc || image.src;
    lightboxImg.alt = image.alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
  }

  document.addEventListener("click", (event) => {
    const image = event.target.closest?.(".lightbox-trigger");
    if (image) openLightbox(image);
  });
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  // Testimonials slider.
  function scrollReviews(direction = 1) {
    if (!reviewTrack) return;
    const card = reviewTrack.querySelector(".review-shot");
    const step = card ? card.offsetWidth + 14 : 320;
    reviewTrack.scrollBy({ left: direction * step, behavior: "smooth" });
  }
  nextBtn?.addEventListener("click", () => scrollReviews(1));
  prevBtn?.addEventListener("click", () => scrollReviews(-1));
  if (reviewTrack) window.setInterval(() => scrollReviews(1), 4500);

  // Initialize Supabase only when the contact form is submitted.
  function getSupabaseClient() {
    if (supabaseClient) return supabaseClient;
    if (!window.supabase?.createClient) {
      throw new Error("تعذر تحميل خدمة الاتصال. حدّث الصفحة وحاول مرة أخرى.");
    }
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    return supabaseClient;
  }

  function showFormMessage(form, message, isError = false) {
    let status = form.querySelector(".form-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "form-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      form.appendChild(status);
    }
    status.textContent = message;
    status.style.color = isError ? "#c0392b" : "#218838";
  }

  // Save contact requests in Supabase; show success only after database confirmation.
  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const submitButton = contactForm.querySelector('button[type="submit"], input[type="submit"]');
    const originalButtonText = submitButton?.textContent || "إرسال الطلب";
    const formData = new FormData(contactForm);
    const customerName = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!customerName || !phone || !message) {
      showFormMessage(contactForm, "من فضلك أكمل الاسم ورقم الهاتف والرسالة.", true);
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "جارٍ إرسال الطلب...";
    }

    try {
      const db = getSupabaseClient();
      const { error } = await db.from("service_requests").insert([{
        customer_name: customerName,
        phone,
        email: email || null,
        service_type: "استفسار عام",
        description: message,
        status: "new",
        source: "website"
      }]);
      if (error) throw error;

      showFormMessage(contactForm, "تم استلام طلبك بنجاح. سنتواصل معك في أقرب وقت.");
      contactForm.reset();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      const messageText = error?.message?.includes("تعذر تحميل")
        ? error.message
        : "لم نتمكن من إرسال طلبك الآن. حاول مرة أخرى أو تواصل معنا عبر الهاتف أو واتساب.";
      showFormMessage(contactForm, messageText, true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
})();
