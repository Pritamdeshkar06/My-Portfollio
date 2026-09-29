// ========================================
// MOBILE MENU
// ========================================

function toggleMenu() {

    const navLinks =
        document.querySelector(".nav-links");

    navLinks.classList.toggle("active");

}


// ========================================
// CLOSE MENU AFTER CLICK
// ========================================

const navItems =
    document.querySelectorAll(".nav-links a");


navItems.forEach(function(item) {

    item.addEventListener("click", function() {

        document
            .querySelector(".nav-links")
            .classList.remove("active");

    });

});


// ========================================
// SKILL POPUP
// ========================================

function showSkill(skill) {

    const popup =
        document.getElementById("popup");

    const title =
        document.getElementById("popupTitle");

    const text =
        document.getElementById("popupText");


    title.textContent = skill;


    if (skill === "HTML") {

        text.textContent =
            "HTML is used to create the structure and semantic foundation of modern websites.";

    }

    else if (skill === "CSS") {

        text.textContent =
            "CSS is used to create responsive, modern and attractive website designs.";

    }

    else if (skill === "JavaScript") {

        text.textContent =
            "JavaScript is used to create interactive and dynamic web applications.";

    }


    popup.style.display = "flex";

}


// ========================================
// CLOSE POPUP
// ========================================

function closePopup() {

    const popup =
        document.getElementById("popup");

    popup.style.display = "none";

}


// ========================================
// CLOSE POPUP OUTSIDE
// ========================================

window.addEventListener(
    "click",
    function(event) {

        const popup =
            document.getElementById("popup");

        if (event.target === popup) {

            closePopup();

        }

    }
);


// ========================================
// ESC KEY
// ========================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closePopup();

        }

    }
);


// ========================================
// ACTIVE NAVBAR
// ========================================

const sections =
    document.querySelectorAll("section[id]");

const links =
    document.querySelectorAll(".nav-links a");


window.addEventListener(
    "scroll",
    function() {

        let current = "";


        sections.forEach(function(section) {

            const sectionTop =
                section.offsetTop - 150;

            const sectionHeight =
                section.offsetHeight;


            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                sectionTop + sectionHeight
            ) {

                current =
                    section.getAttribute("id");

            }

        });


        links.forEach(function(link) {

            link.classList.remove("active");


            if (
                link.getAttribute("href") ===
                "#" + current
            ) {

                link.classList.add("active");

            }

        });

    }
);


// ========================================
// SCROLL REVEAL
// ========================================

const revealElements =
    document.querySelectorAll(
        ".about, .skills, .languages, .education, .projects, .certificates, .resume, .social, .contact, .skill-card, .language-card, .education-card, .project-card, .certificate-card"
    );


const observer =
    new IntersectionObserver(

        function(entries) {

            entries.forEach(function(entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },

        {
            threshold: 0.15
        }

    );


revealElements.forEach(function(element) {

    element.classList.add("reveal");

    observer.observe(element);

});