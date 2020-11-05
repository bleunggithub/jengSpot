var scroll = new SmoothScroll('a[href*="#"]', { speed: 1600 });
const tl = gsap.timeline({ repeat: -1 });

$(document).ready(
    tl.to(".trains", { duration: "8", x: window.innerWidth + 2000, ease: "none" })
    
);