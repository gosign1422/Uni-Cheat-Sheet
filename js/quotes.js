// Array of quotes
const quotes = [
    "Shit don't change till you get up and wash your ass. -Kendrick Lamar",
    "All squares are rectangles, but all rectangles are not squares. - Ansh Yadav",
    "Your desire to create must be greater than your fear of it.",
    "Since when did it become Not Cool to Try? Relentlessly try everything that interests you. - Gosign",
    "Don't dismiss idea in your mind. It's a disservice to the art. The only way to truly know if an idea is good is to try it. - Rick Rubin",
    "Physics is like sex: sure, it may give some practical results, but that's not why we do it. - Richard Feynman",
    "Shit don't change till you get up and wash your ass. -Kendrick Lamar",
    "A person should not be too honest. Straight trees are cut first, and honest people are screwed first. - Chanakya",
    "Education is the best friend. An educated person is respected everywhere. Education beats the beauty and the youth. - Chanakya",
    "You can't cross the sea merely by standing and staring at the water. - Rabindranath Tagore",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible. - Richard Feynman",
    "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Since when did it become Not Cool to Try? Relentlessly try everything that interests you. - Gosign",
    "No matter the magnitude, as long your vector is in the right direction, you’re sorted  -Ansh Yadav",
    "Shit don't change till you get up and wash your ass. -Kendrick Lamar",
    "Don't dismiss idea in your mind. It's a disservice to the art. The only way to truly know if an idea is good is to try it. - Rick Rubin",
    "The only person who is educated is the one who has learned how to learn and change. - Carl Rogers",
    "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible. - Richard Feynman",
    "Fall in love with some activity and do it! Nobody ever figures out what life is all about, and it doesn't matter. - Richard Feynman",
    "Physics is like sex: sure, it may give some practical results, but that's not why we do it. - Richard Feynman",
    "Shit don't change till you get up and wash your ass. -Kendrick Lamar",
    "Good habits create good art. The way we do anything is the way we do everything. - Rick Rubin",
    "You are the only audience that matters. Make what you love, not what others expect. - Rick Rubin",
    "The best art divides the audience. If everyone likes it, you probably haven’t gone far enough. - Rick Rubin",
    "Follow your passion, even if it changes course. - Rick Rubin",
    "Physics is like sex: sure, it may give some practical results, but that's not why we do it. - Richard Feynman",
    "Focus on creating something you love, and your mission is accomplished. - Rick Rubin",
    "What you have to offer is already inside of you. - Rick Rubin",
    "Since when did it become Not Cool to Try? Relentlessly try everything that interests you. - Gosign",
    "Don't dismiss idea in your mind. It's a disservice to the art. The only way to truly know if an idea is good is to try it. - Rick Rubin",
    // Add more quotes here...
];

// Function to get today's quote
function getTodaysQuote() {
    // Get current date (reset time to midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Use the date as a seed for selecting quote
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const quoteIndex = daysSinceEpoch % quotes.length;
    
    return quotes[quoteIndex];
}

// Function to display quote in floating element
function displayQuote() {
    const quote = getTodaysQuote();
    
    // Check if we're on the home page
    const isHomePage = window.location.pathname === '/' || 
                      window.location.pathname === '/index.html' ||
                      window.location.pathname.endsWith('index.html');
    
    // Create floating quote element if it doesn't exist
    if (!document.querySelector('.floating-quote')) {
        const floatingQuote = document.createElement('div');
        floatingQuote.className = 'floating-quote';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-float';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => {
            floatingQuote.style.display = 'none';
            reopenButton.style.display = 'flex';
            // Only store in localStorage if not on home page
            if (!isHomePage) {
                localStorage.setItem('quoteClosedDate', new Date().toDateString());
            }
        };
        
        floatingQuote.appendChild(closeButton);
        
        // Add quote text container
        const quoteText = document.createElement('p');
        quoteText.className = 'quote-text';
        floatingQuote.appendChild(quoteText);
        
        document.body.appendChild(floatingQuote);
    }

    // Create reopen button if it doesn't exist
    if (!document.querySelector('.reopen-quote')) {
        const reopenButton = document.createElement('button');
        reopenButton.className = 'reopen-quote';
        reopenButton.innerHTML = '📜 Quote';
        reopenButton.onclick = () => {
            const quoteElement = document.querySelector('.floating-quote');
            quoteElement.style.display = 'block';
            reopenButton.style.display = 'none';
        };
        document.body.appendChild(reopenButton);
    }
    
    const quoteElement = document.querySelector('.floating-quote');
    const reopenButton = document.querySelector('.reopen-quote');
    
    if (isHomePage) {
        // Always show quote on home page
        quoteElement.style.display = 'block';
        reopenButton.style.display = 'none';
    } else {
        // Check if quote was closed today for other pages
        const lastClosedDate = localStorage.getItem('quoteClosedDate');
        const today = new Date().toDateString();
        
        if (lastClosedDate !== today) {
            quoteElement.style.display = 'block';
            reopenButton.style.display = 'none';
        } else {
            quoteElement.style.display = 'none';
            reopenButton.style.display = 'flex';
        }
    }
    
    quoteElement.querySelector('.quote-text').textContent = quote;
}

// Function to check and update at midnight
function setupMidnightCheck() {
    // Get time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;

    // Initial setup for midnight check
    setTimeout(() => {
        // Update quote
        const quoteElement = document.querySelector('.floating-quote');
        if (quoteElement) {
            const newQuote = getTodaysQuote();
            quoteElement.querySelector('.quote-text').textContent = newQuote;
            
            // Reset localStorage for the new day
            localStorage.removeItem('quoteClosedDate');
            
            // Show quote if it was hidden
            const isHomePage = window.location.pathname === '/' || 
                             window.location.pathname === '/index.html' ||
                             window.location.pathname.endsWith('index.html');
            
            if (isHomePage || !localStorage.getItem('quoteClosedDate')) {
                quoteElement.style.display = 'block';
                document.querySelector('.reopen-quote').style.display = 'none';
            }
        }

        // Setup for next day
        setupMidnightCheck();
    }, timeUntilMidnight);
}

// Initialize quote display and midnight check when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    displayQuote();
    setupMidnightCheck();

    // Store initial quote date
    localStorage.setItem('lastQuoteDate', new Date().toDateString());
});

// Add check for visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Check if we've crossed midnight while page was hidden
        const now = new Date();
        const lastQuoteDate = localStorage.getItem('lastQuoteDate');
        const today = now.toDateString();
        
        if (lastQuoteDate !== today) {
            const quoteElement = document.querySelector('.floating-quote');
            if (quoteElement) {
                const newQuote = getTodaysQuote();
                quoteElement.querySelector('.quote-text').textContent = newQuote;
                localStorage.setItem('lastQuoteDate', today);
                
                // Reset closed state for new day
                localStorage.removeItem('quoteClosedDate');
                
                // Show quote if appropriate
                const isHomePage = window.location.pathname === '/' || 
                                 window.location.pathname === '/index.html' ||
                                 window.location.pathname.endsWith('index.html');
                
                if (isHomePage || !localStorage.getItem('quoteClosedDate')) {
                    quoteElement.style.display = 'block';
                    document.querySelector('.reopen-quote').style.display = 'none';
                }
            }
        }
    }
});

// Add corresponding CSS
const style = document.createElement('style');
style.textContent = `
    .floating-quote {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #000000;
        color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 1002;
        animation: float 4s ease-in-out infinite;
    }

    .floating-quote .close-float {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: #ffffff;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
    }

    .reopen-quote {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #000000;
        color: #ffffff;
        padding: 10px 15px;
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        font-size: 14px;
        display: none;
        align-items: center;
        gap: 5px;
        z-index: 1002;
        transition: background-color 0.3s ease;
    }

    .reopen-quote:hover {
        background: #1a1a1a;
    }

    .floating-quote .quote-text {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        font-style: italic;
    }

    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
`;

document.head.appendChild(style); 