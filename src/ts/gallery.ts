const track = document.getElementById("track") as HTMLElement;
const slides = Array.from(track.children) as HTMLElement[];
const nextBtn = document.getElementById("next") as HTMLButtonElement;
const prevBtn = document.getElementById("prev") as HTMLButtonElement;

let currentIndex = 0;

let startX = 0;
let currentX = 0;
let isDragging = false;
let moved = false;

function goToSlide(index: number) {
    currentIndex = index;
    track.style.transition = "transform 0.4s ease";
    track.style.transform = `translateX(-${index * 25}%)`;
}

export function initGallery() {
    // Buttons
    nextBtn.addEventListener("click", () => {
        goToSlide((currentIndex + 1) % slides.length);
    });

    prevBtn.addEventListener("click", () => {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
    });
    // Touch events
    track.addEventListener("touchstart", (e) => {
        onStart(e.touches[0].clientX);
    });

    track.addEventListener("touchmove", (e) => {
        onMove(e.touches[0].clientX);
    });

    track.addEventListener("touchend", onEnd);

    // Mouse events
    track.addEventListener("mousedown", (e) => {
        e.preventDefault();
        onStart(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
        onMove(e.clientX);
    });

    window.addEventListener("mouseup", onEnd);

    // Prevent click after drag
    track.addEventListener("click", (e) => {
        if (moved) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

// --- Swipe / Drag Logic ---
function onStart(x: number) {
    startX = x;
    isDragging = true;
    moved = false;
    track.style.transition = "none";
}

function onMove(x: number) {
    if (!isDragging) return;

    currentX = x;
    const delta = currentX - startX;

    if (Math.abs(delta) > 5) moved = true;

    const percent = delta / track.offsetWidth * 25;
    track.style.transform = `translateX(calc(-${currentIndex * 25}% + ${percent}%))`;
}

function onEnd() {
    if (!isDragging) return;

    isDragging = false;

    const delta = currentX - startX;
    const threshold = track.offsetWidth * 0.2;

    if (delta < -threshold) {
        goToSlide((currentIndex + 1) % slides.length);
    } else if (delta > threshold) {
        goToSlide((currentIndex - 1 + slides.length) % slides.length);
    } else {
        goToSlide(currentIndex);
    }
}
