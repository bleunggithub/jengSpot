//cloud animation(timeline setup)
const tl = gsap.timeline({ repeat: -1 });
// smooth scroll
var scroll = new SmoothScroll('a[href*="#"]', { speed: 1600 });

$(document).ready(

//cloud animation
tl.to("#cloud1", { duration: "random(50,70)", x: window.innerWidth + 200, ease:"none" },"-=20"),
tl.to("#cloud2", { duration: "random(50,70)", x: window.innerWidth + 200, ease:"none" },"-=42"),
tl.to("#cloud3", { duration: "random(50,70)", x: window.innerWidth + 200, ease:"none" },"-=47"),
tl.to("#cloud4", { duration: "random(50,70)", x: window.innerWidth + 200, ease:"none" },"-=65"),
tl.to("#cloud5", { duration: "random(50,70)", x: window.innerWidth + 200, ease: "none" }, "-=55"),
tl.to("#cloud6", { duration: "random(50,60)", x: window.innerWidth + 200, ease:"none" },"-=50"),
)