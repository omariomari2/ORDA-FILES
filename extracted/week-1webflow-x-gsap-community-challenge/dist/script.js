gsap.registerPlugin(SplitText, ScrambleTextPlugin);

let splitHeader = SplitText.create(".headerText", {
  type: "chars",
  mask: "chars",
});

let splitP = SplitText.create(".p", {
  type: "lines",
  mask: "lines", 
});

const tl = gsap.timeline({
  repeat: 12,
  repeatDelay: 1,
  yoyo: true,
});

tl.from (splitHeader.chars, {
  filter: "blur(6px)",
  y: "-15%",
  opacity: 0,
  scale: 0.95,
  duration: 1.2,
  scrambleText: {
    text: "#",
    speed: 0.15,
  },
  stagger: {
    each: 0.3,
    from: "left"
  },
  ease: "power2.out",
})
.from (splitP.lines, {
  filter: "blur(10px)",
  delay: 0.55,
  opacity: 0,
  scale: 0.95,
  y: "100%",
  duration: 0.55,
  ease: "power1.out",
})
.to(splitHeader.chars, {
  opacity: 100,
  y: "0%",
  duration: 0.2,
})