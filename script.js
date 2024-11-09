function scrollLeft(sliderId) {
    const slider = document.getElementById(sliderId);
    if (slider) {
        slider.scrollBy({
            left: -slider.clientWidth * 0.6, // Scroll more to enhance responsiveness on mobile
            behavior: 'smooth' // Smooth scrolling for a better user experience
        });
    }
}

function scrollRight(sliderId) {
    const slider = document.getElementById(sliderId);
    if (slider) {
        slider.scrollBy({
            left: slider.clientWidth * 0.6, // Scroll more to enhance responsiveness on mobile
            behavior: 'smooth' // Smooth scrolling for a better user experience
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
        }, 50); // Scroll every 50 milliseconds for a more responsive feel

        button.addEventListener('mouseup', () => {
            this.isHeld = false;
        });

        button.addEventListener('mouseleave', () => {
            this.isHeld = false;
        });
    });
});
document.querySelectorAll('.slider-btn').forEach(button => {
    // Handle touch and mouse events
    button.addEventListener('touchstart', function () {
        this.isHeld = true;
        let scrollDirection = this.classList.contains('left') ? 'left' : 'right';
        const sliderId = this.getAttribute('onclick').match(/'(.*?)'/)[1];

        const scrollInterval = setInterval(() => {
            if (this.isHeld) {
                scrollDirection === 'left' ? scrollLeft(sliderId) : scrollRight(sliderId);
            } else {
                clearInterval(scrollInterval);
            }
        }, 100);

        button.addEventListener('touchend', () => {
            this.isHeld = false;
        });

        button.addEventListener('touchcancel', () => {
            this.isHeld = false;
        });
    });

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
        }, 100);

        button.addEventListener('mouseup', () => {
            this.isHeld = false;
        });

        button.addEventListener('mouseleave', () => {
            this.isHeld = false;
        });
    });
});
document.querySelectorAll('.slider-btn').forEach(button => {
    // Handle touch and mouse events
    button.addEventListener('touchstart', function () {
        this.isHeld = true;
        let scrollDirection = this.classList.contains('left') ? 'left' : 'right';
        const sliderId = this.getAttribute('onclick').match(/'(.*?)'/)[1];

        const scrollInterval = setInterval(() => {
            if (this.isHeld) {
                scrollDirection === 'left' ? scrollLeft(sliderId) : scrollRight(sliderId);
            } else {
                clearInterval(scrollInterval);
            }
        }, 100);

        button.addEventListener('touchend', () => {
            this.isHeld = false;
        });

        button.addEventListener('touchcancel', () => {
            this.isHeld = false;
        });
    });

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
        }, 100);

        button.addEventListener('mouseup', () => {
            this.isHeld = false;
        });

        button.addEventListener('mouseleave', () => {
            this.isHeld = false;
        });
    });
});
function scrollLeft(sliderId) {
    const slider = document.getElementById(sliderId);
    if (slider) {
        console.log('Before Scroll:', slider.scrollLeft);
        slider.scrollLeft -= slider.clientWidth * 0.8;
        console.log('After Scroll:', slider.scrollLeft);
    }
}
document.querySelectorAll('.slider-btn').forEach(button => {
    button.addEventListener('click', function () {
        const sliderId = this.getAttribute('onclick').match(/'(.*?)'/)[1];
        if (this.classList.contains('left')) {
            scrollLeft(sliderId);
        } else {
            scrollRight(sliderId);
        }
    });
});

