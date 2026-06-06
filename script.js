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

  // Skill Filtering & Display
  const skills = {
    backend: [
      { name: "Go (Golang)", icon: "🐹" },
      { name: "Python", icon: "🐍" },
      { name: "PHP", icon: "🐘" },
      { name: "Java", icon: "☕" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "MySQL", icon: "🐬" },
      { name: "MongoDB", icon: "🍃" },
      { name: "Redis", icon: "📦" }
    ],
    frontend: [
      { name: "React", icon: "⚛️" },
      { name: "Flutter", icon: "💙" },
      { name: "HTML5 & CSS3", icon: "🌐" },
      { name: "JavaScript (ES6)", icon: "⚡" },
      { name: "Tailwind CSS", icon: "🎨" }
    ],
    devops: [
      { name: "Docker", icon: "🐳" },
      { name: "Nginx", icon: "⚙️" },
      { name: "Git & GitLab", icon: "🦊" },
      { name: "Linux (Ubuntu)", icon: "🐧" },
      { name: "VPS Server", icon: "☁️" }
    ],
    iot: [
      { name: "Embedded Systems", icon: "📟" },
      { name: "Arduino & NodeMCU", icon: "🔌" },
      { name: "LoRa Networks", icon: "📡" },
      { name: "PLC Programming", icon: "🤖" }
    ]
  };

  const skillsGrid = document.getElementById("skills-grid");
  const categoryButtons = document.querySelectorAll(".skills-category-btn");

  function renderSkills(category) {
    skillsGrid.innerHTML = "";
    let skillsList = [];
    
    if (category === "all") {
      skillsList = [...skills.backend, ...skills.frontend, ...skills.devops, ...skills.iot];
    } else {
      skillsList = skills[category];
    }

    skillsList.forEach(skill => {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.innerHTML = `
        <span class="skill-icon">${skill.icon}</span>
        <h4 class="skill-name">${skill.name}</h4>
      `;
      skillsGrid.appendChild(card);
    });
  }

  // Bind category button clicks
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderSkills(button.dataset.category);
    });
  });

  // Initial render of all skills
  renderSkills("all");

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
});
