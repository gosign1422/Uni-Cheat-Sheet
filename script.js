function scrollLeft(sliderId) {
    const slider = document.getElementById(sliderId);
    if (slider) {
        slider.scrollBy({
            left: -slider.clientWidth * 0.8, // Scroll slightly less than one full width for better responsiveness
            behavior: 'auto' // Faster transition for increased sensitivity
        });
    }
}

function scrollRight(sliderId) {
    const slider = document.getElementById(sliderId);
    if (slider) {
        slider.scrollBy({
            left: slider.clientWidth * 0.8, // Scroll slightly less than one full width for better responsiveness
            behavior: 'auto' // Faster transition for increased sensitivity
        });
    }
}

// Adding event listeners for holding down the button for quick scrolling
document.querySelectorAll('.slider-btn').forEach(button => {
    button.addEventListener('mousedown', function () {
        this.isHeld = true;
        let scrollDirection = this.classList.contains('left') ? 'left' : 'right';
        const sliderId = this.getAttribute('onclick').match(/'(.*?)'/)[1];

        const scrollInterval = setInterval(() => {
            if (this.isHeld) {
                scrollDirection === 'left' ? scrollLeft(sliderId) : scrollRight(sliderId);
            } else {
                clearInterval(scrollInterval);
            }
        }, 100); // Scroll every 100 milliseconds for a more responsive feel

        button.addEventListener('mouseup', () => {
            this.isHeld = false;
        });

        button.addEventListener('mouseleave', () => {
            this.isHeld = false;
        });
    });
});
