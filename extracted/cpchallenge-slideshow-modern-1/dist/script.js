let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const totalSlides = slides.length;
let isScrolling = false;

const portfolioData = [
	{
		number: "01 / 05",
		title: "Creative Design Studio",
		description:
			"Innovative digital experiences that captivate and inspire. We blend creativity with cutting-edge technology."
	},
	{
		number: "02 / 05",
		title: "Brand Identity Design",
		description:
			"Crafting memorable brand identities that resonate with your audience and stand the test of time."
	},
	{
		number: "03 / 05",
		title: "Web Development",
		description:
			"Modern, responsive websites built with the latest technologies for optimal performance and user experience."
	},
	{
		number: "04 / 05",
		title: "Mobile Applications",
		description:
			"Native and cross-platform mobile apps that deliver seamless functionality across all devices."
	},
	{
		number: "05 / 05",
		title: "Digital Marketing",
		description:
			"Strategic digital marketing campaigns that drive engagement and deliver measurable results."
	}
];

function updateContent(index) {
	const data = portfolioData[index];
	const elements = ["portfolioNumber", "portfolioTitle", "portfolioDescription"];
	const portfolioButton = document.querySelector(".portfolio-button");

	// Add exit animation to current content
	elements.forEach((id) => {
		document.getElementById(id).style.animation =
			"fadeOutDown 0.4s ease-in forwards";
	});
	portfolioButton.style.animation = "fadeOutDown 0.4s ease-in forwards";

	// Update content and trigger enter animations after exit
	setTimeout(() => {
		document.getElementById("portfolioNumber").textContent = data.number;
		document.getElementById("portfolioTitle").textContent = data.title;
		document.getElementById("portfolioDescription").textContent =
			data.description;

		// Reset and trigger enter animations
		document.getElementById("portfolioNumber").style.animation =
			"slideInFromTop 0.8s ease-out 0.2s forwards";
		document.getElementById("portfolioTitle").style.animation =
			"bounceIn 1s ease-out 0.4s forwards";
		document.getElementById("portfolioDescription").style.animation =
			"fadeInUp 0.8s ease-out 0.6s forwards";
		portfolioButton.style.animation = "floatIn 0.8s ease-out 0.8s forwards";
	}, 400);
}

function showSlide(index) {
	// Hide all slides
	slides.forEach((slide) => slide.classList.remove("active"));
	dots.forEach((dot) => dot.classList.remove("active"));

	// Show current slide
	slides[index].classList.add("active");
	dots[index].classList.add("active");

	// Update content
	updateContent(index);

	currentSlide = index;
}

function nextSlide() {
	const next = (currentSlide + 1) % totalSlides;
	showSlide(next);
}

function prevSlide() {
	const prev = (currentSlide - 1 + totalSlides) % totalSlides;
	showSlide(prev);
}

// Scroll event handling
window.addEventListener("wheel", (e) => {
	if (isScrolling) return;

	isScrolling = true;

	if (e.deltaY > 0) {
		nextSlide();
	} else {
		prevSlide();
	}

	setTimeout(() => {
		isScrolling = false;
	}, 800);
});

// Touch events for mobile
let touchStartY = 0;

window.addEventListener("touchstart", (e) => {
	touchStartY = e.touches[0].clientY;
});

window.addEventListener("touchend", (e) => {
	if (isScrolling) return;

	const touchEndY = e.changedTouches[0].clientY;
	const diff = touchStartY - touchEndY;

	if (Math.abs(diff) > 50) {
		isScrolling = true;

		if (diff > 0) {
			nextSlide();
		} else {
			prevSlide();
		}

		setTimeout(() => {
			isScrolling = false;
		}, 800);
	}
});

// Dot navigation
dots.forEach((dot, index) => {
	dot.addEventListener("click", () => {
		if (!isScrolling) {
			showSlide(index);
		}
	});
});

// Keyboard navigation
window.addEventListener("keydown", (e) => {
	if (isScrolling) return;

	if (e.key === "ArrowDown" || e.key === "ArrowRight") {
		nextSlide();
	} else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
		prevSlide();
	}
});

// Auto-advance slideshow (optional)
setInterval(nextSlide, 3000);