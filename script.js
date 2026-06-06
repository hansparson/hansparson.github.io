/* 
=========================================
  HANS PARSON PORTFOLIO & BLOG LOGIC
=========================================
*/

document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle Logic
  const themeToggle = document.getElementById("theme-toggle");
  const storedTheme = localStorage.getItem("theme") || "dark";
  
  document.documentElement.setAttribute("data-theme", storedTheme);
  updateThemeIcon(storedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === "dark" ? "☀️" : "🌙";
  }

  // Mobile Navigation Menu Toggle
  const navToggleBtn = document.getElementById("nav-toggle-btn");
  const navMenu = document.getElementById("nav-menu");

  navToggleBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    navToggleBtn.innerHTML = navMenu.classList.contains("open") ? "✕" : "☰";
  });

  // Close Mobile Menu on clicking links
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggleBtn.innerHTML = "☰";
    });
  });

  // Active Link Tracking on Scroll
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
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

  // Skill Filtering & Display (guard: only if old grid exists)
  const skillsGrid = document.getElementById("skills-grid");
  if (skillsGrid) {
    const skills = {
      backend: [
        { name: "Go (Golang)", icon: "🐹" }, { name: "Python", icon: "🐍" },
        { name: "PHP", icon: "🐘" }, { name: "Java", icon: "☕" },
        { name: "PostgreSQL", icon: "🐘" }, { name: "MySQL", icon: "🐬" },
        { name: "MongoDB", icon: "🍃" }, { name: "Redis", icon: "📦" }
      ],
      frontend: [
        { name: "React", icon: "⚛️" }, { name: "Flutter", icon: "💙" },
        { name: "HTML5 & CSS3", icon: "🌐" }, { name: "JavaScript (ES6)", icon: "⚡" },
        { name: "Tailwind CSS", icon: "🎨" }
      ],
      devops: [
        { name: "Docker", icon: "🐳" }, { name: "Nginx", icon: "⚙️" },
        { name: "Git & GitLab", icon: "🦊" }, { name: "Linux (Ubuntu)", icon: "🐧" },
        { name: "VPS Server", icon: "☁️" }
      ],
      iot: [
        { name: "Embedded Systems", icon: "📟" }, { name: "Arduino & NodeMCU", icon: "🔌" },
        { name: "LoRa Networks", icon: "📡" }, { name: "PLC Programming", icon: "🤖" }
      ]
    };
    const categoryButtons = document.querySelectorAll(".skills-category-btn");
    function renderSkills(category) {
      skillsGrid.innerHTML = "";
      const skillsList = category === "all"
        ? [...skills.backend, ...skills.frontend, ...skills.devops, ...skills.iot]
        : skills[category];
      skillsList.forEach(skill => {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.innerHTML = `<span class="skill-icon">${skill.icon}</span><h4 class="skill-name">${skill.name}</h4>`;
        skillsGrid.appendChild(card);
      });
    }
    categoryButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        categoryButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderSkills(btn.dataset.category);
      });
    });
    renderSkills("all");
  }

  // Load Projects Database dynamically
  const projectsGrid = document.getElementById("projects-grid");
  const projectFilterBtns = document.querySelectorAll(".project-filter-btn");
  let allProjects = [];

  function getCategoryIcon(cat) {
    const icons = { iot: "📡", ai: "🤖", backend: "⚙️", fullstack: "🌐", hardware: "🔩" };
    return icons[cat] || "💻";
  }

  function renderProjects(projects) {
    projectsGrid.innerHTML = "";
    projects.forEach(project => {
      const icon = getCategoryIcon(project.category);
      const card = document.createElement("div");
      
      if (project.image) {
        card.className = "project-card has-image";
        card.innerHTML = `
          <div class="project-mockup-header">
            <span class="mockup-dot mockup-red"></span>
            <span class="mockup-dot mockup-yellow"></span>
            <span class="mockup-dot mockup-green"></span>
            <span class="mockup-url">hansparson.dev/${project.id}</span>
          </div>
          <div class="project-img-wrap">
            <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" onerror="this.parentElement.style.display='none'">
          </div>
          <div class="project-top">
            <span class="project-icon">${icon}</span>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <div class="project-tech-list">
              ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join("")}
            </div>
          </div>
          <a href="${project.link}" target="_blank" class="project-link">View Project ↗</a>
        `;
      } else {
        card.className = "project-card terminal-card";
        card.innerHTML = `
          <div class="project-terminal-header">
            <div class="terminal-dots">
              <span class="mockup-dot mockup-red"></span>
              <span class="mockup-dot mockup-yellow"></span>
              <span class="mockup-dot mockup-green"></span>
            </div>
            <span class="terminal-title">bash - hans@server:~/${project.id}</span>
          </div>
          <div class="project-top">
            <span class="project-icon">${icon}</span>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-desc">${project.description}</p>
            <div class="project-tech-list">
              ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join("")}
            </div>
          </div>
          <a href="${project.link}" target="_blank" class="project-link">View Project ↗</a>
        `;
      }
      projectsGrid.appendChild(card);
    });
  }

  fetch("projects.json")
    .then(res => res.json())
    .then(projects => {
      allProjects = projects;
      renderProjects(allProjects);

      // Bind project filter buttons
      projectFilterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          projectFilterBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const cat = btn.dataset.cat;
          const filtered = cat === "all" ? allProjects : allProjects.filter(p => p.category === cat);
          renderProjects(filtered);
        });
      });
    })
    .catch(err => console.error("Error loading projects:", err));

  // Load Blog Database dynamically
  const blogGrid = document.getElementById("blog-grid");
  const modalOverlay = document.getElementById("modal-overlay");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalMeta = document.getElementById("modal-meta");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");

  let blogPosts = [];

  fetch("blog.json")
    .then(res => res.json())
    .then(posts => {
      blogPosts = posts;
      blogGrid.innerHTML = "";
      posts.forEach(post => {
        const row = document.createElement("div");
        row.className = "blog-row";
        row.innerHTML = `
          <div class="blog-row-left">
            <span class="blog-row-date">${post.date}</span>
            <span class="blog-row-time">⏱️ ${post.readTime}</span>
          </div>
          <div class="blog-row-center">
            <h3 class="blog-row-title">${post.title}</h3>
            <p class="blog-row-summary">${post.summary}</p>
          </div>
          <div class="blog-row-right">
            <span class="blog-row-action" data-id="${post.id}">Read Article ↗</span>
          </div>
        `;
        blogGrid.appendChild(row);
      });

      // Bind article modal triggers
      document.querySelectorAll(".blog-row").forEach(row => {
        row.addEventListener("click", () => {
          const actionBtn = row.querySelector(".blog-row-action");
          const postId = actionBtn.dataset.id;
          const post = blogPosts.find(p => p.id === postId);
          if (post) {
            modalMeta.innerText = `${post.date} • ${post.readTime}`;
            modalTitle.innerText = post.title;
            modalBody.innerHTML = post.content;
            modalOverlay.classList.add("active");
            document.body.style.overflow = "hidden"; // disable scroll
          }
        });
      });
    })
    .catch(err => console.error("Error loading blog posts:", err));

  // Load Certificates Database dynamically
  const certsGrid = document.getElementById("certificates-grid");
  const certModalOverlay = document.getElementById("cert-modal-overlay");
  const certModalCloseBtn = document.getElementById("cert-modal-close-btn");
  const certModalTitle = document.getElementById("cert-modal-title");
  const certModalViewer = document.getElementById("cert-modal-viewer");
  
  const prevBtn = document.getElementById("cert-prev-btn");
  const nextBtn = document.getElementById("cert-next-btn");
  const dotsContainer = document.getElementById("cert-carousel-dots");

  let certificatesList = [];
  let currentIndex = 0;

  function getItemsPerPage() {
    if (window.innerWidth <= 650) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function updateCarousel() {
    const itemsPerPage = getItemsPerPage();
    const totalItems = certificatesList.length;
    const maxIndex = Math.max(0, totalItems - itemsPerPage);
    
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const offset = -(currentIndex * (100 / itemsPerPage));
    certsGrid.style.transform = `translateX(${offset}%)`;

    // Update Dots
    const dots = dotsContainer.querySelectorAll(".carousel-dot-indicator");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === Math.min(idx, currentIndex));
    });
  }

  fetch("certificates.json")
    .then(res => res.json())
    .then(certs => {
      certificatesList = certs;
      certsGrid.innerHTML = "";
      certs.forEach(cert => {
        const card = document.createElement("div");
        card.className = "cert-card";
        const icon = cert.type === "pdf" ? "📄" : "🖼️";
        card.innerHTML = `
          <div class="cert-card-header">
            <span class="cert-type-icon">${icon}</span>
            <span class="cert-date">${cert.date}</span>
          </div>
          <h3 class="cert-title">${cert.title}</h3>
          <span class="cert-issuer">🏢 ${cert.issuer}</span>
          <p class="cert-desc">${cert.description}</p>
          <button class="btn btn-outline cert-view-btn" data-id="${cert.id}" style="width:100%; padding: 8px 16px; font-size: 0.85rem; margin-top: 15px;">View Certificate</button>
        `;
        certsGrid.appendChild(card);
      });

      // Generate Dots
      dotsContainer.innerHTML = "";
      const totalItems = certs.length;
      for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement("span");
        dot.className = "carousel-dot-indicator";
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
          currentIndex = Math.min(i, totalItems - getItemsPerPage());
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }

      // Initialize Carousel
      updateCarousel();
      window.addEventListener("resize", updateCarousel);

      // Controls event listeners
      prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = certificatesList.length - getItemsPerPage(); // Wrap around
        }
        updateCarousel();
      });

      nextBtn.addEventListener("click", () => {
        if (currentIndex < certificatesList.length - getItemsPerPage()) {
          currentIndex++;
        } else {
          currentIndex = 0; // Wrap around
        }
        updateCarousel();
      });

      // Bind certificate viewer buttons
      document.querySelectorAll(".cert-view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const certId = btn.dataset.id;
          const cert = certificatesList.find(c => c.id === certId);
          if (cert) {
            certModalTitle.innerText = cert.title;
            if (cert.type === "pdf") {
              certModalViewer.innerHTML = `
                <object data="${cert.file}" type="application/pdf" width="100%" height="500px">
                  <p>Your browser does not support viewing PDFs inline. <a href="${cert.file}" target="_blank" class="project-link">Download PDF instead ↗</a></p>
                </object>
              `;
            } else {
              certModalViewer.innerHTML = `
                <img src="${cert.file}" alt="${cert.title}" style="max-width: 100%; max-height: 500px; display: block; margin: 0 auto; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
              `;
            }
            certModalOverlay.classList.add("active");
            document.body.style.overflow = "hidden"; // disable scroll
          }
        });
      });
    })
    .catch(err => console.error("Error loading certificates:", err));

  // Close Certificate Modal triggers
  certModalCloseBtn.addEventListener("click", closeCertModal);
  certModalOverlay.addEventListener("click", (e) => {
    if (e.target === certModalOverlay) closeCertModal();
  });

  function closeCertModal() {
    certModalOverlay.classList.remove("active");
    certModalViewer.innerHTML = "";
    document.body.style.overflow = "auto"; // restore scroll
  }

  // Close Modal triggers
  modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "auto"; // restore scroll
  }

  // Contact Form — mailto: handler
  const contactForm = document.getElementById("contact-form");
  const toastMsg = document.getElementById("toast-msg");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = contactForm.querySelector("#name").value.trim();
    const email   = contactForm.querySelector("#email").value.trim();
    const message = contactForm.querySelector("#message").value.trim();

    const subject = encodeURIComponent(`[Portfolio] Message from ${name}`);
    const body    = encodeURIComponent(
      `Hi Hans,\n\nYou have a new message from your portfolio contact form:\n\n` +
      `Name   : ${name}\nEmail  : ${email}\n\nMessage:\n${message}\n\n---\nSent via hansparson.github.io`
    );

    const mailtoLink = `mailto:hansparson013@gmail.com?subject=${subject}&body=${body}`;

    // Open email client
    window.location.href = mailtoLink;

    // Reset form & show toast
    contactForm.reset();
    toastMsg.classList.add("active");
    setTimeout(() => toastMsg.classList.remove("active"), 4000);
  });

  // =========================================
  // 1. GRADIENT MESH ANIMATED CANVAS BACKGROUND
  // =========================================
  const canvas = document.getElementById("mesh-canvas");
  const ctx = canvas.getContext("2d");
  let blobs = [];

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const isDark = () => document.documentElement.getAttribute("data-theme") !== "light";

  function createBlobs() {
    blobs = [];
    const colors = [
      [172, 66, 50],   // cyan accent
      [217, 91, 60],   // blue accent
      [280, 70, 60],   // purple
    ];
    for (let i = 0; i < 5; i++) {
      const c = colors[i % colors.length];
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 180 + Math.random() * 140,
        hue: c[0], sat: c[1], lit: c[2],
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }
  }
  createBlobs();

  function drawMesh() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blobs.forEach(b => {
      const alpha = isDark() ? 0.12 : 0.08;
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, ${b.lit}%, ${alpha})`);
      grad.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, ${b.lit}%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();

      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -b.r || b.x > canvas.width + b.r) b.vx *= -1;
      if (b.y < -b.r || b.y > canvas.height + b.r) b.vy *= -1;
    });
    requestAnimationFrame(drawMesh);
  }
  drawMesh();

  // =========================================
  // 2. TYPEWRITER CYCLING ANIMATION
  // =========================================
  const typingEl = document.getElementById("typing-text");
  if (typingEl) {
    const words = ["Backend APIs", "Go Services", "IoT Systems", "AI Solutions", "Fintech Apps"];
    let wordIdx = 0, charIdx = 0, isDeleting = false;

    function typeWriter() {
      const currentWord = words[wordIdx];
      if (!isDeleting) {
        typingEl.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === currentWord.length) {
          setTimeout(() => { isDeleting = true; typeWriter(); }, 1800);
          return;
        }
      } else {
        typingEl.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % words.length;
        }
      }
      setTimeout(typeWriter, isDeleting ? 60 : 100);
    }
    setTimeout(typeWriter, 800);
  }

  // =========================================
  // 3. SCROLL REVEAL ANIMATION
  // =========================================
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  // =========================================
  // 4. ANIMATED STAT COUNTERS
  // =========================================
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsAnimated = false;

  function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start);
      }
    }, 16);
  }

  const statsBar = document.getElementById("stats-bar");
  if (statsBar) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(el => {
          animateCounter(el, parseInt(el.dataset.target));
        });
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsBar);
  }

});

// =========================================
// 5. CUSTOM CURSOR + MOUSE SPOTLIGHT
// (outside DOMContentLoaded — runs globally)
// =========================================
const cursorDot  = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
const spotlight  = document.getElementById("mouse-spotlight");

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot follows instantly
  cursorDot.style.left = mouseX + "px";
  cursorDot.style.top  = mouseY + "px";

  // Spotlight follows with slight smooth delay
  spotlight.style.left = mouseX + "px";
  spotlight.style.top  = mouseY + "px";
});

// Ring follows with lerp lag for premium feel
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + "px";
  cursorRing.style.top  = ringY + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover effect on interactive elements
const interactiveEls = document.querySelectorAll(
  "a, button, .bento-card, .project-card, .blog-card, .skill-card, .btn"
);
interactiveEls.forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursorRing.classList.add("hover");
    cursorDot.style.transform = "translate(-50%, -50%) scale(1.5)";
  });
  el.addEventListener("mouseleave", () => {
    cursorRing.classList.remove("hover");
    cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
  });
});

// Click effect
document.addEventListener("mousedown", () => cursorDot.classList.add("click"));
document.addEventListener("mouseup",   () => cursorDot.classList.remove("click"));
