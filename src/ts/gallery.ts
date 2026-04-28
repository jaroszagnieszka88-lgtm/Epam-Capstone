let track: HTMLElement | null = null;
let slides: HTMLElement[] = [];
let currentIndex = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let moved = false;

function goToSlide(index: number) {
    if (!track) return;
    currentIndex = index;
    track.style.transition = "transform 0.4s ease";
    track.style.transform = `translateX(-${index * 25}%)`;
}

export function initGallery() {
    track = document.getElementById("track");
    if (!track) return;

    slides = Array.from(track.children) as HTMLElement[];
    if (slides.length === 0) return;

    track.addEventListener("touchstart", (e) => {
        onStart(e.touches[0].clientX);
    });

    track.addEventListener("touchmove", (e) => {
        onMove(e.touches[0].clientX);
    });

    track.addEventListener("touchend", onEnd);

    track.addEventListener("mousedown", (e) => {
        e.preventDefault();
        onStart(e.clientX);
    });

    window.addEventListener("mousemove", (e) => {
        onMove(e.clientX);
    });

    window.addEventListener("mouseup", onEnd);

    track.addEventListener("click", (e) => {
        if (moved) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

function onStart(x: number) {  
    if (!track) return;
    startX = x;
    isDragging = true;
    moved = false;
    track.style.transition = "none";
}

function onMove(x: number) {
    if (!isDragging || !track) return;

    currentX = x;
    const delta = currentX - startX;

    if (Math.abs(delta) > 5) moved = true;

    const percent = delta / track.offsetWidth * 25;
    track.style.transform = `translateX(calc(-${currentIndex * 25}% + ${percent}%))`;
}

function onEnd() {
    if (!isDragging || !track) return;

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
