/* ---- Loader ---- */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 1000);
  preloadGalleries();
});

/* ---- Custom cursor ---- */
const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
let mx = 0,
  my = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
  ring.style.left = mx + "px";
  ring.style.top = my + "px";
});

document.querySelectorAll("a, button, .fence-card").forEach((el) => {
  el.addEventListener("mouseenter", () => ring.classList.add("expand"));
  el.addEventListener("mouseleave", () => ring.classList.remove("expand"));
});

/* Hide cursor on touch devices */
if ("ontouchstart" in window) {
  dot.style.display = ring.style.display = "none";
}

/* ---- Scroll: nav & back-top & reveal ---- */
const nav = document.getElementById("nav");
const backTop = document.getElementById("back-top");

const revealEls = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right",
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
);

revealEls.forEach((el) => observer.observe(el));

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 60);
  backTop.classList.toggle("show", y > 400);
});

backTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  const open = hamburger.classList.toggle("open");
  mobileMenu.classList.toggle("open", open);
  hamburger.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

/* ---- Gallery modal ---- */
const modal = document.getElementById("gallery-modal");
const modalTitle = document.getElementById("modal-title-text");
const modalGallery = document.getElementById("modal-gallery");
const modalClose = document.getElementById("modal-close");
const modalBack = document.getElementById("modal-backdrop");

const folderNames = [
  "klizne-kapije",
  "balkonske-ograde",
  "demiri",
  "dvorisne-ograde",
  "krilne-kapije",
  "stubisne-ograde",
];

const MAX_IMAGES_PER_FOLDER = 50;
// Get the base path (e.g., "/ograde-music/")
const basePath = window.location.pathname.endsWith("/")
  ? window.location.pathname
  : window.location.pathname.split("/").slice(0, -1).join("/") + "/";

const preloadedGalleries = {};

async function preloadGalleries() {
  for (const folder of folderNames) {
    const imgs = [];
    for (let i = 1; i <= MAX_IMAGES_PER_FOLDER; i++) {
      const imgPath = `${basePath}assets/images/${folder}/${i}.jpg`;
      const exists = await checkImageExists(imgPath);
      if (exists) {
        const imgWrapper = document.createElement("div");
        imgWrapper.className = "modal-gallery-item";
        imgWrapper.innerHTML = `<img src="${imgPath}" loading="lazy" alt="${folder} ${i}">`;
        imgs.push(imgWrapper);
      } else {
        break;
      }
    }
    preloadedGalleries[folder] = imgs;
  }
}

async function checkImageExists(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return (
      response.ok && response.headers.get("content-type")?.includes("image")
    );
  } catch (error) {
    return false;
  }
}
document.querySelectorAll(".fence-card").forEach((card) => {
  card.addEventListener("click", () => {
    const type = card.dataset.type;
    if (!folderNames.includes(type)) return; // Security check to prevent arbitrary folder access
    modalTitle.textContent = card.querySelector("h3").textContent;
    modalGallery.innerHTML = "";
    const imgs = preloadedGalleries[type] || [];
    imgs.forEach((img) => modalGallery.appendChild(img.cloneNode(true)));
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});
function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}
modalClose.addEventListener("click", closeModal);
modalBack.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

document
  .getElementById("modal-quote-link")
  .addEventListener("click", closeModal);

/* ---- Contact form submit ---- */
document.getElementById("form-submit-btn").addEventListener("click", () => {
  const name = document.getElementById("f-name").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const type = document.getElementById("f-type").value;
  const msg = document.getElementById("f-message").value.trim();

  if (!name || !email || !type || !msg) {
    [
      ["f-name", name],
      ["f-email", email],
      ["f-type", type],
      ["f-message", msg],
    ].forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (!val) {
        el.style.borderColor = "#c0392b";
        el.addEventListener(
          "input",
          () => {
            el.style.borderColor = "";
          },
          { once: true },
        );
      }
    });
    return;
  }

  emailjs.sendForm("service_q5suqyb", "template_n6wwlze", "#contact-form").then(
    (response) => {
      document.getElementById("form-fields").style.display = "none";
      document.getElementById("form-success").classList.add("show");
      console.log("SUCCESS!", response.status, response.text);
    },
    (error) => {
      document.getElementById("form-fields").style.display = "none";
      document.getElementById("form-failure").classList.add("show");
      console.log("FAILED...", error);
    },
  );
});

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ---- Parallax subtle on hero ---- */
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const heroContent = document.querySelector(".hero-content");
});
