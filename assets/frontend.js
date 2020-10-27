const tl = gsap.timeline({ repeat :-1});
$(document).ready(


tl.to("#cloud1", { duration: "random(50,70)", x: window.innerWidth + 200, ease:"none" },"-=20"),
tl.to("#cloud2", { duration: "random(50,70)", x: window.innerWidth + 200, ease:"none" },"-=42"),
tl.to("#cloud3", { duration: "random(50,70)", x: window.innerWidth + 200, ease:"none" },"-=47"),
tl.to("#cloud4", { duration: "random(50,70)", x: window.innerWidth + 200, ease:"none" },"-=65"),
tl.to("#cloud5", { duration: "random(50,70)", x: window.innerWidth + 200, ease: "none" }, "-=55"),
tl.to("#cloud6", { duration: "random(50,60)", x: window.innerWidth + 200, ease:"none" },"-=50"),

)