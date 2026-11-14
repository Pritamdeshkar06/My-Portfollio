/* ========================================
   PORTFOLIO JAVASCRIPT (cleaned up)
======================================== */

const MOBILE_BREAKPOINT = 720;   /* same as CSS @media (max-width: 720px) */
const NAV_OFFSET = 120;          /* header height + a little space */


/* ---------- SMALL HELPERS ---------- */

function $(selector, scope) {
    return (scope || document).querySelector(selector);
}

function $$(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
}


/* ========================================
   MOBILE MENU
======================================== */

function setMenuState(isOpen) {
    const navLinks = $(".nav-links");
    const menuBtn = $(".menu-btn");

    if (!navLinks || !menuBtn) return;

    navLinks.classList.toggle("active", isOpen);

    menuBtn.innerHTML = isOpen
        ? '<i class="fas fa-times" aria-hidden="true"></i>'
        : '<i class="fas fa-bars" aria-hidden="true"></i>';

    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
}

function toggleMenu() {
    const navLinks = $(".nav-links");
    if (!navLinks) return;
    setMenuState(!navLinks.classList.contains("active"));
}

function closeMenu() {
    setMenuState(false);
}


/* ========================================
   MODALS (shared by skill + certificate popups)
   - remembers focus, traps Tab, locks scroll
======================================== */

const modalFocusMap = new WeakMap();

function openModal(popup, focusTarget) {
    if (!popup) return;

    modalFocusMap.set(popup, document.activeElement);

    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    if (focusTarget) focusTarget.focus();
}

function closeModal(popup) {
    if (!popup || !popup.classList.contains("is-open")) return;

    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");

    /* unlock scroll only if no other modal is still open */
    if (!$(".popup.is-open, .certificate-popup.is-open")) {
        document.body.classList.remove("no-scroll");
    }

    const previous = modalFocusMap.get(popup);
    if (previous && typeof previous.focus === "function") previous.focus();
    modalFocusMap.delete(popup);
}

/* keep keyboard focus inside the open modal */
function trapFocus(event) {
    if (event.key !== "Tab") return;

    const popup = $(".popup.is-open, .certificate-popup.is-open");
    if (!popup) return;

    const focusable = $$("button, [href], [tabindex]:not([tabindex='-1'])", popup);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}


/* ========================================
   SKILL POPUP
======================================== */

const skillDescriptions = {
    HTML: "HTML5 is used to create the structure and semantic foundation of modern websites. It helps organize headings, paragraphs, images, links and forms.",
    CSS: "CSS3 is used to style websites. It helps create attractive layouts, colors, animations, responsive designs and modern user interfaces.",
    JavaScript: "JavaScript is used to create interactive and dynamic web applications. It helps add functionality, handle events and update website content."
};

function showSkill(skill) {
    const popup = document.getElementById("popup");
    const title = document.getElementById("popupTitle");
    const text = document.getElementById("popupText");

    if (!popup || !title || !text) return;

    title.textContent = skill;
    text.textContent =
        skillDescriptions[skill] ||
        "More information about this skill will be added soon.";

    openModal(popup, $(".popup-close", popup));
}

function closePopup() {
    closeModal(document.getElementById("popup"));
}


/* ========================================
   PROJECT POPUP
   (edit the text below to change what shows on "Learn More")
======================================== */

const projectData = {
    Portfolio: {
        title: "Portfolio Website",
        text: "My personal developer portfolio, built from scratch with HTML, CSS and JavaScript. It brings my skills, education, projects, certificates and resume together in one modern, fast and fully responsive website.",
        features: [
            "Responsive design for mobile, tablet and desktop",
            "Light / dark theme that remembers your choice",
            "Page loader, scroll progress bar and scroll-reveal animations",
            "Animated skill bars and counting statistics",
            "Popups for skill details, project details and certificate preview",
            "Resume view and download, plus one-click copy email",
            "Back-to-top button and active menu highlight while scrolling",
            "Keyboard friendly with Escape to close and focus kept inside popups"
        ],
        tags: ["HTML", "CSS", "JavaScript"],
        live: "https://pritamdeshkar06.github.io/My-Portfollio/",
        code: "https://github.com/Pritamdeshkar06"
    },
    Clock: {
        title: "Digital Clock & Alarm",
        text: "A real-time digital clock web application that shows the current time and lets you set an alarm.",
        features: [
            "Live time that updates every second",
            "Set an alarm for any time",
            "Simple, clean and easy-to-read interface",
            "Works in any modern browser"
        ],
        tags: ["HTML", "CSS", "JavaScript"],
        live: "https://pritamdeshkar06.github.io/Digital-Clock/",
        code: "https://github.com/Pritamdeshkar06"
    },
    TruckGo: {
        title: "TruckGo",
        text: "A transportation website for TruckGo that presents the company's truck and logistics services in a clear, modern layout.",
        features: [
            "Clean landing page with service details",
            "Responsive design for all screen sizes",
            "Easy navigation and contact options"
        ],
        tags: ["HTML", "CSS", "JavaScript"],
        live: "",
        code: ""
    }
};

function showProject(key) {
    const popup = document.getElementById("projectPopup");
    const data = projectData[key];
    if (!popup || !data) return;

    document.getElementById("projectTitle").textContent = data.title;
    document.getElementById("projectText").textContent = data.text;

    const features = document.getElementById("projectFeatures");
    features.innerHTML = "";
    data.features.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item;
        features.appendChild(li);
    });

    const tags = document.getElementById("projectTags");
    tags.innerHTML = "";
    data.tags.forEach(function (item) {
        const span = document.createElement("span");
        span.textContent = item;
        tags.appendChild(span);
    });

    const actions = document.getElementById("projectActions");
    actions.innerHTML = "";

    function addLink(url, label, iconClass, primary) {
        if (!url) return;
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = primary ? "primary-btn" : "secondary-btn";
        a.innerHTML = '<i class="' + iconClass + '"></i> ' + label;
        actions.appendChild(a);
    }
    addLink(data.live, "Live Demo", "fas fa-external-link-alt", true);
    addLink(data.code, "GitHub", "fab fa-github", false);

    if (!data.live && !data.code) {
        const note = document.createElement("p");
        note.className = "project-note";
        note.textContent = "Live demo and source code links will be added soon.";
        actions.appendChild(note);
    }

    openModal(popup, $(".popup-close", popup));
}

function closeProject() {
    closeModal(document.getElementById("projectPopup"));
}


/* ========================================
   CERTIFICATE POPUP
======================================== */

function showCertificate(imagePath, title) {
    const popup = document.getElementById("certificatePopup");
    const image = document.getElementById("certificateImage");
    const heading = document.getElementById("certificateTitle");

    if (!popup || !image || !heading) return;

    image.src = imagePath;
    image.alt = title;
    heading.textContent = title;

    openModal(popup, $(".certificate-close", popup));
}

function closeCertificate() {
    closeModal(document.getElementById("certificatePopup"));
}


/* ========================================
   ACTIVE NAVIGATION
   Only sections that have a menu link are tracked, so the
   highlight never disappears on Languages / Education / Resume.
======================================== */

function updateActiveNav() {
    const links = $$(".nav-links a[href^='#']");

    const tracked = links
        .map(function (link) {
            return {
                link: link,
                section: document.getElementById(link.getAttribute("href").slice(1))
            };
        })
        .filter(function (item) { return item.section; });

    if (!tracked.length) return;

    const scrollPos = window.scrollY + NAV_OFFSET;
    let current = tracked[0];

    tracked.forEach(function (item) {
        const top = item.section.getBoundingClientRect().top + window.scrollY;
        if (scrollPos >= top) current = item;
    });

    /* at the very bottom of the page, highlight the last link */
    const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = tracked[tracked.length - 1];

    links.forEach(function (link) {
        const isActive = link === current.link;
        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

/* run at most once per animation frame while scrolling */
let navTicking = false;

function onScroll() {
    if (navTicking) return;
    navTicking = true;

    window.requestAnimationFrame(function () {
        updateActiveNav();
        navTicking = false;
    });
}


/* ========================================
   SCROLL REVEAL
======================================== */

function setupScrollReveal() {
    const revealElements = $$(
        ".section-heading, .about-grid, .info-card, .education-card, .project-item, .resume-box, .connect-container"
    );

    if (
        !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
        return; /* leave everything visible */
    }

    const observer = new IntersectionObserver(
        function (entries, currentObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach(function (element) {
        element.classList.add("reveal");
        observer.observe(element);
    });
}


/* ========================================
   INITIALIZE (one single DOMContentLoaded)
======================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* close mobile menu after clicking a link */
    $$(".nav-links a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    /* close mobile menu when clicking outside it */
    document.addEventListener("click", function (event) {
        const navbar = $(".navbar");
        if (navbar && !navbar.contains(event.target)) closeMenu();
    });

    /* reset menu when screen becomes large */
    window.addEventListener("resize", function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
        updateActiveNav();
    });

    /* close popups when clicking the dark backdrop */
    [
        [document.getElementById("popup"), closePopup],
        [document.getElementById("projectPopup"), closeProject],
        [document.getElementById("certificatePopup"), closeCertificate]
    ].forEach(function (pair) {
        const popup = pair[0];
        const closeFn = pair[1];

        if (!popup) return;

        popup.addEventListener("click", function (event) {
            if (event.target === popup) closeFn();
        });
    });

    /* certificate cards: use data-* attributes (no inline JS needed) */
    $$(".certificate-card").forEach(function (card) {
        const open = function () {
            showCertificate(card.dataset.certSrc, card.dataset.certTitle);
        };

        card.addEventListener("click", open);
        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                open();
            }
        });
    });

    /* keyboard: Escape closes things, Tab stays inside popup */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closePopup();
            closeProject();
            closeCertificate();
            closeMenu();
        }
        trapFocus(event);
    });

    /* active navigation */
    window.addEventListener("scroll", onScroll, { passive: true });
    updateActiveNav();

    /* scroll reveal */
    setupScrollReveal();

    /* automatic copyright year */
    const yearElement = document.getElementById("year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();
});


/* ========================================
   EXTRAS: dark mode, typing text, back-to-top, progress bar
======================================== */

/* ---- Dark mode (remembers choice, follows system by default) ---- */
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const btn = $(".theme-btn");
    if (btn) {
        btn.innerHTML = theme === "dark"
            ? '<i class="fas fa-sun" aria-hidden="true"></i>'
            : '<i class="fas fa-moon" aria-hidden="true"></i>';
        btn.setAttribute("aria-label",
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }

    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#17110d" : "#fbf9f7");
}

function toggleTheme() {
    const next =
        document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";

    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* private mode */ }
}

function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) { /* ignore */ }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (prefersDark ? "dark" : "light"));
}

/* ---- Typing animation in hero <h2> ---- */
function initTyping() {
    const el = $(".hero-content h2");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = ["Frontend Developer", "Web Designer", "Problem Solver"];
    el.setAttribute("aria-label", words[0]);

    const textNode = document.createElement("span");
    const cursor = document.createElement("span");
    cursor.className = "typed-cursor";
    cursor.textContent = "|";
    cursor.setAttribute("aria-hidden", "true");
    textNode.setAttribute("aria-hidden", "true");

    el.textContent = "";
    el.append(textNode, cursor);

    let w = 0, i = words[0].length, deleting = true;

    textNode.textContent = words[0];

    (function tick() {
        const word = words[w];
        let delay = deleting ? 45 : 90;

        textNode.textContent = word.slice(0, i);
        i += deleting ? -1 : 1;

        if (!deleting && i > word.length) { deleting = true; delay = 1600; }
        else if (deleting && i < 0) { deleting = false; w = (w + 1) % words.length; i = 0; delay = 350; }

        setTimeout(tick, delay);
    })();
}

/* ---- Back-to-top + scroll progress ---- */
function initScrollExtras() {
    const toTop = $(".to-top");
    const bar = $(".scroll-progress");

    function update() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;

        if (bar) bar.style.width = pct + "%";
        if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
    }

    if (toTop) {
        toTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
}

document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initTyping();
    initScrollExtras();

    const themeBtn = $(".theme-btn");
    if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
});


/* ========================================
   PACK A + B: loader, skill bars, counters, copy email, 
======================================== */

const CONTACT_EMAIL = "deshkarpritam@gmail.com";
skillDescriptions["Git"] = "Git tracks changes in code and GitHub is used to store projects online, collaborate and showcase work to others.";
skillDescriptions["Responsive"] = "Responsive design makes websites look and work well on mobiles, tablets and desktops using flexible layouts and media queries.";
skillDescriptions["Problem"] = "Problem solving means breaking a task into small steps, finding bugs and building clean, logical solutions.";

/* loader */
window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    if (loader) setTimeout(function () { loader.classList.add("hide"); }, 350);
});

/* skill bars + counters animate when visible */
function initCountersAndBars() {
    const bars = $$(".skill-bar");
    const counters = $$("[data-count]");

    function runBar(bar) { $("span", bar).style.width = bar.dataset.level + "%"; }

    function runCounter(el) {
        const target = Number(el.dataset.count);
        const start = performance.now();

        (function step(now) {
            const t = Math.min((now - start) / 1000, 1);
            el.textContent = Math.round(target * t);
            if (t < 1) requestAnimationFrame(step);
        })(start);
    }

    if (!("IntersectionObserver" in window)) {
        bars.forEach(runBar);
        counters.forEach(function (el) { el.textContent = el.dataset.count; });
        return;
    }

    const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            if (entry.target.classList.contains("skill-bar")) runBar(entry.target);
            else runCounter(entry.target);
            io.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    bars.concat(counters).forEach(function (el) { io.observe(el); });
}

/* copy email */
function initCopyEmail() {
    const btn = document.getElementById("copyEmail");
    if (!btn) return;

    btn.addEventListener("click", function () {
        const label = $("span", btn);
        const done = function (msg) {
            label.textContent = msg;
            setTimeout(function () { label.textContent = "Copy"; }, 1800);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(CONTACT_EMAIL).then(
                function () { done("Copied!"); },
                function () { done(CONTACT_EMAIL); }
            );
        } else {
            done(CONTACT_EMAIL);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initCountersAndBars();
    initCopyEmail();
});
