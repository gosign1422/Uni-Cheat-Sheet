// Ad popup functionality
const promoImages = [ 
];

function getNextImage() {
    let currentIndex = parseInt(localStorage.getItem('promoIndex')) || 0;
    const imageUrl = promoImages[currentIndex];
    currentIndex = (currentIndex + 1) % promoImages.length;
    localStorage.setItem('promoIndex', currentIndex);
    return imageUrl;
}

// Show ad after page load
document.addEventListener('DOMContentLoaded', function() {
    try {
        const overlay = document.getElementById('promoOverlay');
        const promoImage = document.getElementById('promoImage');
        const visitBtn = document.getElementById('visitBtn');
        const directionsBtn = document.getElementById('directionsBtn');
        const menuBtn = document.getElementById('menuBtn');
        const kameHutBtn = document.getElementById('kameHutBtn');
        
        if (!overlay || !promoImage) {
            console.error('Promo elements not found in DOM');
            return;
        }

        const currentPath = window.location.pathname;
        const isSem2TargetPage = currentPath.endsWith('/sem2/lecture.html') || 
                                currentPath.endsWith('/sem2/solutions.html');
        const delay = isSem2TargetPage ? 5000 : 2000;

        setTimeout(() => {
            const imageUrl = getNextImage();
            console.log('Loading promo image:', imageUrl);
            promoImage.onerror = () => console.error('Failed to load promo image:', imageUrl);
            promoImage.onload = () => {
                // Toggle buttons based on image
                if (imageUrl.includes('vj_aasghy.jpg')) {
                    visitBtn.style.display = 'none';
                    directionsBtn.style.display = 'block';
                    menuBtn.style.display = 'none';
                    kameHutBtn.style.display = 'none';
                } else if (imageUrl.includes('turskishc1_ixrujw.jpg')) {
                    visitBtn.href = 'https://bit.ly/3aPqNsG';
                    visitBtn.textContent = 'Learn More';
                    visitBtn.style.display = 'block';
                    directionsBtn.style.display = 'none';
                    menuBtn.style.display = 'none';
                    kameHutBtn.style.display = 'none';
                } else if (imageUrl.includes('flats_2_s1jqdx.jpg')) {
                    visitBtn.href = 'https://buyfromuni.com/#/accommodations';
                    visitBtn.textContent = 'Find Accommodation';
                    visitBtn.style.display = 'block';
                    directionsBtn.style.display = 'none';
                    menuBtn.style.display = 'none';
                    kameHutBtn.style.display = 'none';
                } else if (imageUrl.includes('exchange_g2uvhp.jpg')) {
                    visitBtn.href = 'https://buyfromuni.com/#/exchange';
                    visitBtn.textContent = 'Exchange Goods';
                    visitBtn.style.display = 'block';
                    directionsBtn.style.display = 'none';
                    menuBtn.style.display = 'none';
                    kameHutBtn.style.display = 'none';
                } else {
                    visitBtn.style.display = 'block';
                    directionsBtn.style.display = 'none';
                    menuBtn.style.display = 'none';
                    kameHutBtn.style.display = 'none';
                }
                console.log('Promo image loaded successfully');
                overlay.style.display = 'flex';
            };
            promoImage.src = imageUrl;
        }, delay);
    } catch (error) {
        console.error('Error showing promo:', error);
    }
});

window.closePromo = function() {
    const overlay = document.getElementById('promoOverlay');
    if (overlay) overlay.style.display = 'none';
};