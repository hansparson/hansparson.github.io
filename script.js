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
      card.className = "project-card";
      const imgHtml = project.image
        ? `<div class="project-img-wrap"><img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" onerror="this.parentElement.style.display='none'"></div>`
        : ``;
      card.innerHTML = `
        ${imgHtml}
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
        const card = document.createElement("div");
        card.className = "blog-card";
        card.innerHTML = `
          <div>
            <div class="blog-meta">
              <span>${post.date}</span>
              <span>${post.readTime}</span>
            </div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-summary">${post.summary}</p>
          </div>
          <span class="blog-readmore" data-id="${post.id}">Read Article ➡️</span>
        `;
        blogGrid.appendChild(card);
      });

      // Bind article modal triggers
      document.querySelectorAll(".blog-readmore").forEach(btn => {
        btn.addEventListener("click", () => {
          const postId = btn.dataset.id;
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

  // Close Modal triggers
  modalCloseBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "auto"; // restore scroll
  }

  // Contact Form Mock Action
  const contactForm = document.getElementById("contact-form");
  const toastMsg = document.getElementById("toast-msg");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending...";

    // Mock network request
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();
      
      // Toast notification animation
      toastMsg.classList.add("active");
      setTimeout(() => {
        toastMsg.classList.remove("active");
      }, 4000);
    }, 1500);
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
