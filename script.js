document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('#navbar');
    const closeBtn = document.querySelector('.close-btn');
    const menuItems = document.querySelectorAll('.nav-link.has-submenu');
    const menuTriggers = document.querySelectorAll('.menu-trigger');
    const navItems = document.querySelector('.nav-items');
    const sliders = document.querySelectorAll('.slider');
    
    // Function to open menu and trigger specific item
    function openMenuAndTriggerItem(itemName) {
        // First open the navbar
        navbar.classList.add('active');
        hamburger.classList.add('hide');
        
        // Find and trigger the corresponding menu item
        menuItems.forEach(item => {
            const itemText = item.querySelector('.nav-text').textContent.trim();
            if (itemText === itemName) {
                // Remove active class from all items
                document.querySelectorAll('.nav-item.active').forEach(active => {
                    active.classList.remove('active');
                });
                
                // Add active class to parent
                const parent = item.parentElement;
                parent.classList.add('active');
                
                // Add has-active class to nav-items
                navItems.classList.add('has-active');
            }
        });
    }
    
    // Service card click handlers
    menuTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const menuItem = this.getAttribute('data-menu-item');
            openMenuAndTriggerItem(menuItem);
        });
    });
    
    // Hamburger menu click
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        navbar.classList.add('active');
        hamburger.classList.add('hide');
    });
    
    // Close button click
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navbar.classList.remove('active');
        hamburger.classList.remove('hide');
        // Remove active states
        document.querySelectorAll('.nav-item.active').forEach(item => {
            item.classList.remove('active');
        });
        navItems.classList.remove('has-active');
    });
    
    // Menu item click handlers
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parent = this.parentElement;
            
            // Remove active class from all items
            document.querySelectorAll('.nav-item.active').forEach(active => {
                if (active !== parent) {
                    active.classList.remove('active');
                }
            });
            
            // Toggle current item
            parent.classList.toggle('active');
            
            // Toggle has-active class
            if (document.querySelector('.nav-item.active')) {
                navItems.classList.add('has-active');
            } else {
                navItems.classList.remove('has-active');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && !hamburger.contains(e.target)) {
            navbar.classList.remove('active');
            hamburger.classList.remove('hide');
            document.querySelectorAll('.nav-item.active').forEach(item => {
                item.classList.remove('active');
            });
            navItems.classList.remove('has-active');
        }
    });
    
    // Slider functionality
    function scrollLeft(sliderId) {
        const slider = document.getElementById(sliderId);
        slider.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    }

    function scrollRight(sliderId) {
        const slider = document.getElementById(sliderId);
        slider.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    }

    // Add event listeners after DOM is loaded
    const leftButtons = document.querySelectorAll('.slider-btn.left');
    const rightButtons = document.querySelectorAll('.slider-btn.right');

    leftButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sliderId = this.parentElement.querySelector('.slider').id;
            scrollLeft(sliderId);
        });
    });

    rightButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sliderId = this.parentElement.querySelector('.slider').id;
            scrollRight(sliderId);
        });
    });

    let lastScrollTop = 0;
    const logo = document.querySelector('.fixed-logo');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            logo.style.opacity = '0';
        } else {
            // Scrolling up
            logo.style.opacity = '1';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });
});
