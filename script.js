document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('#navbar');
    const closeBtn = document.querySelector('.close-btn');
    const menuItems = document.querySelectorAll('.nav-link.has-submenu');
    const menuText = hamburger.querySelector('.menu-text');
    const menuIcon = hamburger.querySelector('i');
    const menuTriggers = document.querySelectorAll('.menu-trigger');
    const navItems = document.querySelector('.nav-items');
    const sliders = document.querySelectorAll('.slider');
    const searchTrigger = document.querySelector('.search-trigger');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const closeSearch = document.querySelector('.close-search');
    const searchResults = document.querySelector('.search-results');
    
    // Function to open menu and trigger specific item
    function setMenuButtonState(isOpen) {
        if (isOpen) {
            menuText.textContent = 'Close';
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
            hamburger.classList.add('is-open');
        } else {
            menuText.textContent = 'Menu';
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
            hamburger.classList.remove('is-open');
        }
    }

    function openMenuAndTriggerItem(itemName) {
        // First open the navbar
        navbar.classList.add('active');
        setMenuButtonState(true);
        
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
        navbar.classList.toggle('active');
        setMenuButtonState(navbar.classList.contains('active'));
    });
    
    // Close button click
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navbar.classList.remove('active');
        setMenuButtonState(false);
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
            setMenuButtonState(false);
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

    // Comprehensive content mapping for search
    const contentMap = [
        
        // Semester 1 Content
        {
            title: 'AEM-1 (Mathematics)',
            description: 'Applied Engineering Mathematics 1 lecture notes and study material',
            url: './sem1/lecture.html#aem1'
        },
        {
            title: 'Physics',
            description: 'Engineering Physics lecture notes and study material',
            url: './sem2/lecture.html#physics'
        },
        {
            title: 'Programming in C',
            description: 'C programming language lecture notes and examples',
            url: './sem1/lecture.html#c-programming'
        },
        {
            title: 'Linux',
            description: 'Linux operating system fundamentals and commands',
            url: './sem1/lecture.html#linux'
        },
        {
            title: 'Problem Solving',
            description: 'Problem-solving techniques and methodologies',
            url: './sem1/lecture.html#problem-solving'
        },
        {
            title: 'EVS',
            description: 'Environmental Studies lecture notes',
            url: './sem1/lecture.html#evs'
        },
        
        // Semester 1 Solutions
        {
            title: 'AEM-1 Solutions',
            description: 'Solutions for Mathematics practice sets and tutorials',
            url: './sem1/solutions.html#aem1-solutions'
        },
        {
            title: 'C Programming Solutions',
            description: 'Solutions for C programming assignments and practice problems',
            url: './sem1/solutions.html#c-solutions'
        },
        {
            title: 'Linux Solutions',
            description: 'Solutions for Linux assignments and command exercises',
            url: './sem1/solutions.html#linux-solutions'
        },
        {
            title: 'Problem Solving Solutions',
            description: 'Solutions for problem-solving exercises and case studies',
            url: './sem1/solutions.html#problem-solving-solutions'
        },
        {
            title: 'EVS Solutions',
            description: 'Solutions for Environmental Studies assignments and projects',
            url: './sem1/solutions.html#evs-solutions'
        },
        
        // Semester 1 PYQs
        {
            title: 'AEM-1 PYQs',
            description: 'Previous year questions for Applied Engineering Mathematics 1',
            url: './sem1/pyqs.html#aem1-pyqs'
        },
        {
            title: 'Physics PYQs',
            description: 'Previous year questions for Engineering Physics',
            url: './sem1/pyqs.html#physics-pyqs'
        },
        {
            title: 'C Programming PYQs',
            description: 'Previous year questions for Programming in C',
            url: './sem1/pyqs.html#c-pyqs'
        },
        {
            title: 'Linux PYQs',
            description: 'Previous year questions for Linux Operating System',
            url: './sem1/pyqs.html#linux-pyqs'
        },
        {
            title: 'Problem Solving PYQs',
            description: 'Previous year questions for Problem Solving',
            url: './sem1/pyqs.html#problem-solving-pyqs'
        },
        {
            title: 'EVS PYQs',
            description: 'Previous year questions for Environmental Studies',
            url: './sem1/pyqs.html#evs-pyqs'
        },
        
        // About Page
        {
            title: 'About UPES CheatSheet',
            description: 'Learn about our mission and the team behind UPES CheatSheet',
            url: './about.html'
        }
    ];

    // Semester 2 Content Mapping
    const semester2Content = [
        // AEM-2 Content
        {
            title: 'AEM-2 Course Content',
            description: 'Applied Engineering Mathematics 2 course outline and syllabus',
            url: './sem2/lecture.html#aem2'
        },
        {
            title: 'AEM-2 Tutorial Solutions',
            description: 'Solutions for AEM-2 tutorial sheets and practice problems',
            url: './sem2/solutions.html#aem2-solutions'
        },
        {
            title: 'AEM-2 Practice Set Solutions',
            description: 'Detailed solutions for AEM-2 practice sets',
            url: './sem2/solutions.html#aem2-practice'
        },
        {
            title: 'AEM-2 PYQs',
            description: 'Previous year questions for Applied Engineering Mathematics 2',
            url: './sem2/pyqs.html#aem2-pyqs'
        },

        // Digital Electronics
        {
            title: 'Digital Electronics(DE) Lecture Notes',
            description: 'Complete lecture notes for Digital Electronics',
            url: './sem2/lecture.html#de'
        },
        {
            title: 'Digital Electronics(DE) Solutions',
            description: 'Solutions for Digital Electronics assignments and practice problems',
            url: './sem2/solutions.html#de-solutions'
        },
        {
            title: 'Digital Electronics(DE) Practice Questions',
            description: 'Practice questions and solutions for Digital Electronics',
            url: './sem2/solutions.html#de-practice'
        },
        {
            title: 'Digital Electronics PYQs',
            description: 'Previous year questions for Digital Electronics',
            url: './sem2/pyqs.html#de-pyqs'
        },

        // Data Structures
        {
            title: 'Data Structures(DSA) Course Content',
            description: 'Lecture notes and materials for Data Structures',
            url: './sem2/lecture.html#ds'
        },
        {
            title: 'Data Structures(DSA) Solutions',
            description: 'Solutions for Data Structures assignments and practice problems',
            url: './sem2/solutions.html#ds-solutions'
        },
        {
            title: 'Data Structures PYQs',
            description: 'Previous year questions for Data Structures',
            url: './sem2/pyqs.html#ds-pyqs'
        },

        // Python Content
        {
            title: 'Python Programming',
            description: 'Python programming language lecture notes and course content',
            url: './sem2/lecture.html#python'
        },
        {
            title: 'Python Theory Course Content',
            description: 'Theory content and syllabus for Python programming',
            url: './sem2/lecture.html#python-theory'
        },
        {
            title: 'Python Lab Content',
            description: 'Laboratory exercises and practical content for Python programming',
            url: './sem2/lecture.html#python-lab'
        },
        {
            title: 'Python Solutions',
            description: 'Solutions for Python assignments and practice problems',
            url: './sem2/solutions.html#python-solutions'
        },
        {
            title: 'Python PYQs',
            description: 'Previous year questions for Python Programming',
            url: './sem2/pyqs.html#python-pyqs'
        },

        // Physics (Semester 2)
        {
            title: 'Physics Theory (Semester 2)',
            description: 'Physics theory lectures and course materials',
            url: './sem2/lecture.html#physics-theory'
        },
        {
            title: 'Physics Lab (Semester 2)',
            description: 'Physics laboratory experiments and manuals',
            url: './sem2/lecture.html#physics-lab'
        },
        {
            title: 'Physics Solutions (Semester 2)',
            description: 'Solutions for Physics assignments and practice problems',
            url: './sem2/solutions.html#physics-solutions'
        },
        {
            title: 'Physics PYQs (Semester 2)',
            description: 'Previous year questions for Semester 2 Physics',
            url: './sem2/pyqs.html#physics-pyqs'
        },

        // Computer Organization & Architecture
        {
            title: 'Computer Organisation & Architecture',
            description: 'COA lecture notes and course content',
            url: './sem2/lecture.html#coa'
        },
        {
            title: 'COA Course Content',
            description: 'Complete syllabus and course materials for Computer Organisation',
            url: './sem2/lecture.html#coa'
        },
        {
            title: 'COA Solutions',
            description: 'Solutions for Computer Organization assignments and problems',
            url: './sem2/solutions.html#coa-solutions'
        },
        {
            title: 'COA PYQs',
            description: 'Previous year questions for Computer Organization',
            url: './sem2/pyqs.html#coa-pyqs'
        },

        // Time Management & Priority Setting
        {
            title: 'Time Management & Priority Setting',
            description: 'Course materials for Time Management and Priority Setting',
            url: './sem2/lecture.html#tmps'
        },
        {
            title: 'TMPS Workbook',
            description: 'Workbook and exercises for Time Management course',
            url: './sem2/lecture.html#tmps'
        },
        {
            title: 'TMPS Solutions',
            description: 'Solutions for Time Management assignments and activities',
            url: './sem2/solutions.html#tmps-solutions'
        },
        {
            title: 'TMPS PYQs',
            description: 'Previous year questions for Time Management course',
            url: './sem2/pyqs.html#tmps-pyqs'
        },

        // EVS Living Lab
        {
            title: 'EVS Living Lab',
            description: 'Environmental Studies laboratory activities and projects',
            url: './sem2/lecture.html#evs-lab'
        },
        {
            title: 'EVS Class Activities',
            description: 'Class activities and group projects for Environmental Studies',
            url: './sem2/lecture.html#evs-lab'
        },
        {
            title: 'EVS Lab Solutions',
            description: 'Solutions for EVS Living Lab activities and projects',
            url: './sem2/solutions.html#evs-lab-solutions'
        },
        {
            title: 'EVS Lab PYQs',
            description: 'Previous year questions for EVS Living Lab',
            url: './sem2/pyqs.html#evs-lab-pyqs'
        }
    ];

    // Semester 3 Content Mapping
    const semester3Content = [
        // Discreet Mathematical Structures
        {
            title: 'Discreet Mathematical Structures',
            description: 'Lecture notes and course content for Discreet Mathematical Structures',
            url: './sem3/lecture.html#aem2'
        },
        {
            title: 'Discreet Mathematical Structures Solutions',
            description: 'Solutions for Discreet Mathematical Structures practice problems',
            url: './sem3/solutions.html#aem2-solutions'
        },
        {
            title: 'Discreet Mathematical Structures PYQs',
            description: 'Previous year questions for Discreet Mathematical Structures',
            url: './sem3/pyqs.html#aem2-solutions'
        },

        // Operating Systems
        {
            title: 'Operating Systems',
            description: 'Lecture notes and course content for Operating Systems',
            url: './sem3/lecture.html#physics-theory'
        },
        {
            title: 'Operating Systems Solutions',
            description: 'Solutions for Operating Systems assignments and practice problems',
            url: './sem3/solutions.html#physics-solutions'
        },
        {
            title: 'Operating Systems PYQs',
            description: 'Previous year questions for Operating Systems',
            url: './sem3/pyqs.html#physics-solutions'
        },

        // Elements of AIML
        {
            title: 'Elements of AIML',
            description: 'Lecture notes and course content for Elements of AIML',
            url: './sem3/lecture.html#de'
        },
        {
            title: 'Elements of AIML Solutions',
            description: 'Solutions for Elements of AIML assignments and practice problems',
            url: './sem3/solutions.html#de-solutions'
        },
        {
            title: 'Elements of AIML PYQs',
            description: 'Previous year questions for Elements of AIML',
            url: './sem3/pyqs.html#de-solutions'
        },

        // Database Management Systems
        {
            title: 'Database Management Systems',
            description: 'Lecture notes and course content for Database Management Systems',
            url: './sem3/lecture.html#coa'
        },
        {
            title: 'DBMS Solutions',
            description: 'Solutions for Database Management Systems assignments and practice problems',
            url: './sem3/solutions.html#coa-solutions'
        },
        {
            title: 'DBMS PYQs',
            description: 'Previous year questions for Database Management Systems',
            url: './sem3/pyqs.html#coa-solutions'
        },

        // Design & Analysis of Algorithms
        {
            title: 'Design & Analysis of Algorithms (Theory)',
            description: 'Lecture notes and course content for DAA theory',
            url: './sem3/lecture.html#python'
        },
        {
            title: 'Design & Analysis of Algorithms (Lab)',
            description: 'Lab content and practicals for DAA',
            url: './sem3/lecture.html#python1'
        },
        {
            title: 'DAA Solutions',
            description: 'Solutions for Design & Analysis of Algorithms practice problems',
            url: './sem3/solutions.html#dsa-solutions'
        },
        {
            title: 'DAA PYQs',
            description: 'Previous year questions for Design & Analysis of Algorithms',
            url: './sem3/pyqs.html#daa-solutions'
        }
    ];

    // Semester 4 Content Mapping
    const semester4Content = [
        // Linear Algebra
        {
            title: 'Linear Algebra',
            description: 'Lecture notes and course content for Linear Algebra',
            url: './sem4/lecture.html#aem2'
        },
        {
            title: 'Linear Algebra Solutions',
            description: 'Solutions for Linear Algebra assignments and practice problems',
            url: './sem4/solutions.html#aem2-solutions'
        },
        {
            title: 'Linear Algebra PYQs',
            description: 'Previous year questions for Linear Algebra',
            url: './sem4/pyqs.html#aem2-solutions'
        },

        // Information Technology and Cyber Security
        {
            title: 'Information Technology and Cyber Security',
            description: 'Lecture notes and course content for IT and Cyber Security',
            url: './sem4/lecture.html#physics-theory'
        },
        {
            title: 'IT and Cyber Security Solutions',
            description: 'Solutions for IT and Cyber Security assignments and practice problems',
            url: './sem4/solutions.html#physics-solutions'
        },
        {
            title: 'IT and Cyber Security PYQs',
            description: 'Previous year questions for IT and Cyber Security',
            url: './sem4/pyqs.html#physics-solutions'
        },

        // Data Communication and Networks
        {
            title: 'Data Communication and Networks',
            description: 'Lecture notes and course content for Data Communication and Networks',
            url: './sem4/lecture.html#de'
        },
        {
            title: 'Data Communication and Networks Solutions',
            description: 'Solutions for Data Communication and Networks assignments and practice problems',
            url: './sem4/solutions.html#de-solutions'
        },
        {
            title: 'Data Communication and Networks PYQs',
            description: 'Previous year questions for Data Communication and Networks',
            url: './sem4/pyqs.html#de-solutions'
        },

        // Software Engineering
        {
            title: 'Software Engineering',
            description: 'Lecture notes and course content for Software Engineering',
            url: './sem4/lecture.html#coa'
        },
        {
            title: 'Software Engineering Solutions',
            description: 'Solutions for Software Engineering assignments and practice problems',
            url: './sem4/solutions.html#coa-solutions'
        },
        {
            title: 'Software Engineering PYQs',
            description: 'Previous year questions for Software Engineering',
            url: './sem4/pyqs.html#coa-solutions'
        },

        // Object Oriented Programming
        {
            title: 'Object Oriented Programming',
            description: 'Lecture notes and course content for Object Oriented Programming',
            url: './sem4/lecture.html#python'
        },
        {
            title: 'Object Oriented Programming Solutions',
            description: 'Solutions for Object Oriented Programming assignments and practice problems',
            url: './sem4/solutions.html#dsa-solutions'
        },
        {
            title: 'Object Oriented Programming PYQs',
            description: 'Previous year questions for Object Oriented Programming',
            url: './sem4/pyqs.html#daa-solutions'
        }
    ];

    // Add this to your existing contentMap array
    contentMap.push(...semester2Content);
    contentMap.push(...semester3Content);
    contentMap.push(...semester4Content);

    searchTrigger.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
        }
    });

    // Search functionality
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.toLowerCase();
        const results = contentMap.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );
        
        displayResults(results);
    }, 300));

    function displayResults(results) {
        if (!results.length) {
            searchResults.innerHTML = '<p>No results found</p>';
            return;
        }

        searchResults.innerHTML = results.map(item => `
            <div class="search-result-item">
                <a href="${item.url}">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </a>
            </div>
        `).join('');
    }

    // Debounce helper function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize quotes
    displayQuote();
    setupMidnightCheck();

    // Store initial quote date
    localStorage.setItem('lastQuoteDate', new Date().toDateString());
});
