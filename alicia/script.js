/* 
=========================================
  ALICIA HANNA GRACIELLA LOGIC
=========================================
*/

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Menu Toggle
  const toggleBtn = document.getElementById("alicia-toggle-btn");
  const navMenu = document.getElementById("alicia-menu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      toggleBtn.innerHTML = navMenu.classList.contains("open") ? "✕" : "☰";
    });

    // Close Mobile Menu on clicking links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        toggleBtn.innerHTML = "☰";
      });
    });
  }

  // Active Link Tracking on Scroll
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Scroll Reveal Animations
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // Contact Form — mailto: handler
  const contactForm = document.getElementById("alicia-contact-form");
  const toastMsg = document.getElementById("alicia-toast");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.querySelector("#name").value.trim();
      const email = contactForm.querySelector("#email").value.trim();
      const message = contactForm.querySelector("#message").value.trim();

      const subject = encodeURIComponent(`[Portfolio] Message from ${name}`);
      const body = encodeURIComponent(
        `Hi Alicia,\n\nYou have a new message from your portfolio contact form:\n\n` +
        `Name   : ${name}\nEmail  : ${email}\n\nMessage:\n${message}\n\n---\nSent via alicia portfolio`
      );

      const mailtoLink = `mailto:aliciahanna0511@gmail.com?subject=${subject}&body=${body}`;

      // Open email client
      window.location.href = mailtoLink;

      // Reset form & show toast
      contactForm.reset();
      if (toastMsg) {
        toastMsg.classList.add("active");
        setTimeout(() => toastMsg.classList.remove("active"), 4000);
      }
    });
  }
});
