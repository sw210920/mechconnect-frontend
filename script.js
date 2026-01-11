// Global state
let currentPage = 'home';
let selectedVehicle = 'car';
let currentStep = 1;
let currentTestimonial = 0;
let selectedDate = null;
let selectedTime = '';
let bookingData = {
    vehicle: 'car',
    package: '',
    location: 'doorstep',
    date: null,
    time: '',
    vehicleDetails: {
        make: '',
        model: '',
        year: '',
        registration: ''
    },
    customerDetails: {
        name: '',
        phone: '',
        email: '',
        address: ''
    }
};

// DOM elements
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
const mainContent = document.getElementById('main-content');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupCalendar();
    setupTestimonialRotation();
});

function initializeApp() {
    // Set initial page
    showPage('home');
    
    // Update vehicle-related content
    updateVehicleContent();
    
    // Initialize booking form
    updateBookingProgress();
}

function setupEventListeners() {
    // Header scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Vehicle selectors
    document.querySelectorAll('.vehicle-btn').forEach(btn => {
        btn.addEventListener('click', handleVehicleSelection);
    });
    
    document.querySelectorAll('.vehicle-btn-booking').forEach(btn => {
        btn.addEventListener('click', handleBookingVehicleSelection);
    });
    
    // Book now buttons
    // document.getElementById('bookNowBtn').addEventListener('click', () => showPage('book'));
    // document.getElementById('ctaBookBtn').addEventListener('click', () => showPage('book'));
    
    // Package selection buttons
    document.querySelectorAll('.package-btn').forEach(btn => {
        btn.addEventListener('click', () => showPage('book'));
    });
    
    // Booking package cards
    document.querySelectorAll('.package-card-booking').forEach(card => {
        card.addEventListener('click', handlePackageSelection);
    });
    
    // Location selection
    document.querySelectorAll('input[name="location"]').forEach(radio => {
        radio.addEventListener('change', handleLocationSelection);
    });
    
    // Time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', handleTimeSelection);
    });
    
    // Step navigation
    document.getElementById('step1Next').addEventListener('click', () => nextStep());
    document.getElementById('step2Back').addEventListener('click', () => prevStep());
    document.getElementById('step2Next').addEventListener('click', () => nextStep());
    document.getElementById('step3Back').addEventListener('click', () => prevStep());
    document.getElementById('step3Next').addEventListener('click', () => nextStep());
    document.getElementById('step4Back').addEventListener('click', () => prevStep());
    document.getElementById('confirmBooking').addEventListener('click', confirmBooking);
    
    // Form inputs
    document.querySelectorAll('#step3 input').forEach(input => {
        input.addEventListener('input', handleFormInput);
    });
    
    // Testimonial navigation
    document.getElementById('prevTestimonial').addEventListener('click', () => changeTestimonial(-1));
    document.getElementById('nextTestimonial').addEventListener('click', () => changeTestimonial(1));
    
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.addEventListener('click', () => setTestimonial(index));
    });
    
    // Back to home buttons
    document.getElementById('backToHome').addEventListener('click', () => showPage('home'));
    document.getElementById('backToHomeBtn').addEventListener('click', () => showPage('home'));
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header') && mobileNav.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

function handleScroll() {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function toggleMobileMenu() {
    mobileNav.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.className = mobileNav.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
}

function handleNavigation(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    
    if (href === '#home') {
        showPage('home');
    } else if (href === '#book') {
        showPage('book');
    } else {
        // For other links, just scroll to section or show 404
        const sectionId = href.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        } else {
            showPage('404');
        }
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    e.target.classList.add('active');
    
    // Close mobile menu
    if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
    }
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset booking if going to book page
        if (pageId === 'book') {
            resetBooking();
        }
    }
}

function handleVehicleSelection(e) {
    const vehicle = e.currentTarget.dataset.vehicle;
    selectedVehicle = vehicle;
    
    // Update button states
    document.querySelectorAll('.vehicle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    updateVehicleContent();
}

function handleBookingVehicleSelection(e) {
    const vehicle = e.currentTarget.dataset.vehicle;
    bookingData.vehicle = vehicle;
    
    // Update button states
    document.querySelectorAll('.vehicle-btn-booking').forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    updateBookingVehicleContent();
}

function updateVehicleContent() {
    // Update selected vehicle text
    document.getElementById('selectedVehicleText').textContent = selectedVehicle;
    
    // Update package prices
    document.querySelectorAll('.price').forEach(price => {
        const carPrice = price.dataset.car;
        const bikePrice = price.dataset.bike;
        price.textContent = selectedVehicle === 'car' ? carPrice : bikePrice;
    });
}

function updateBookingVehicleContent() {
    // Update booking vehicle type text
    document.getElementById('bookingVehicleType').textContent = bookingData.vehicle;
    
    // Update package prices in booking
    document.querySelectorAll('.packages-grid-booking .price').forEach(price => {
        const carPrice = price.dataset.car;
        const bikePrice = price.dataset.bike;
        price.textContent = bookingData.vehicle === 'car' ? carPrice : bikePrice;
    });
}

function handlePackageSelection(e) {
    const packageId = e.currentTarget.dataset.package;
    bookingData.package = packageId;
    
    // Update visual selection
    document.querySelectorAll('.package-card-booking').forEach(card => {
        card.classList.remove('selected');
    });
    e.currentTarget.classList.add('selected');
    
    // Update radio button
    const radio = e.currentTarget.querySelector('input[type="radio"]');
    if (radio) {
        radio.checked = true;
    }
}

function handleLocationSelection(e) {
    bookingData.location = e.target.value;
    
    // Update address field requirement
    const addressField = document.getElementById('address');
    const addressGroup = addressField.closest('.form-group');
    const label = addressGroup.querySelector('label');
    
    if (bookingData.location === 'doorstep') {
        addressField.required = true;
        label.textContent = 'Address (for doorstep service) *';
    } else {
        addressField.required = false;
        label.textContent = 'Address (optional)';
    }
}

function handleTimeSelection(e) {
    const time = e.currentTarget.dataset.time;
    selectedTime = time;
    bookingData.time = time;
    
    // Update visual selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    e.currentTarget.classList.add('selected');
}

function handleFormInput(e) {
    const field = e.target.id;
    const value = e.target.value;
    
    if (['make', 'model', 'year', 'registration'].includes(field)) {
        bookingData.vehicleDetails[field] = value;
    } else if (['name', 'phone', 'email', 'address'].includes(field)) {
        bookingData.customerDetails[field] = value;
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        currentStep++;
        updateBookingStep();
        updateBookingProgress();
        
        if (currentStep === 4) {
            updateBookingSummary();
        }
    }
}

function prevStep() {
    currentStep--;
    updateBookingStep();
    updateBookingProgress();
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            if (!bookingData.package) {
                alert('Please select a service package.');
                return false;
            }
            return true;
        case 2:
            if (!selectedDate || !selectedTime) {
                alert('Please select both date and time.');
                return false;
            }
            bookingData.date = selectedDate;
            return true;
        case 3:
            const { vehicleDetails, customerDetails } = bookingData;
            if (!vehicleDetails.make || !vehicleDetails.model || !vehicleDetails.year || !vehicleDetails.registration) {
                alert('Please fill in all vehicle details.');
                return false;
            }
            if (!customerDetails.name || !customerDetails.phone || !customerDetails.email) {
                alert('Please fill in all required contact information.');
                return false;
            }
            if (bookingData.location === 'doorstep' && !customerDetails.address) {
                alert('Please provide your address for doorstep service.');
                return false;
            }
            return true;
        default:
            return true;
    }
}

function updateBookingStep() {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateBookingProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Update progress bar
    progressFill.style.width = `${(currentStep / 4) * 100}%`;
    
    // Update step indicators
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.querySelector('.step-circle').textContent = '✓';
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.querySelector('.step-circle').textContent = stepNumber;
        } else {
            step.querySelector('.step-circle').textContent = stepNumber;
        }
    });
}

function updateBookingSummary() {
    const packageData = getPackageData(bookingData.package);
    const price = packageData.price[bookingData.vehicle];
    
    // Update summary content
    document.getElementById('summaryServiceTitle').textContent = packageData.title;
    document.getElementById('summaryVehicleType').textContent = `${bookingData.vehicle.charAt(0).toUpperCase() + bookingData.vehicle.slice(1)} Maintenance`;
    document.getElementById('summaryVehicleIcon').className = bookingData.vehicle === 'car' ? 'fas fa-car' : 'fas fa-motorcycle';
    
    document.getElementById('summaryDate').textContent = formatDate(bookingData.date);
    document.getElementById('summaryTime').textContent = bookingData.time;
    document.getElementById('summaryLocation').textContent = bookingData.location === 'doorstep' ? 'Doorstep Service' : 'Garage Visit';
    document.getElementById('summaryVehicle').textContent = `${bookingData.vehicleDetails.make} ${bookingData.vehicleDetails.model} (${bookingData.vehicleDetails.year})`;
    document.getElementById('summaryRegistration').textContent = bookingData.vehicleDetails.registration;
    document.getElementById('summaryCustomerName').textContent = bookingData.customerDetails.name;
    document.getElementById('summaryPhone').textContent = bookingData.customerDetails.phone;
    document.getElementById('summaryEmail').textContent = bookingData.customerDetails.email;
    document.getElementById('summaryPrice').textContent = price;
    
    // Handle address display
    const addressRow = document.getElementById('summaryAddressRow');
    if (bookingData.location === 'doorstep') {
        addressRow.style.display = 'flex';
        document.getElementById('summaryAddress').textContent = bookingData.customerDetails.address;
    } else {
        addressRow.style.display = 'none';
    }
}

function confirmBooking() {
    // Hide booking steps and progress
    document.getElementById('progressIndicator').style.display = 'none';
    document.querySelector('.booking-steps').style.display = 'none';
    
    // Show completion screen
    const completionScreen = document.getElementById('bookingComplete');
    completionScreen.classList.add('active');
    
    // Update completion details
    const packageData = getPackageData(bookingData.package);
    const bookingRef = generateBookingReference();
    
    document.getElementById('completeVehicleType').textContent = bookingData.vehicle;
    document.getElementById('completeDate').textContent = formatDate(bookingData.date);
    document.getElementById('completeTime').textContent = bookingData.time;
    document.getElementById('completeServiceType').textContent = packageData.title;
    document.getElementById('completeVehicle').textContent = `${bookingData.vehicleDetails.make} ${bookingData.vehicleDetails.model} (${bookingData.vehicleDetails.year})`;
    document.getElementById('completeLocation').textContent = bookingData.location === 'doorstep' ? 'Doorstep Service' : 'Garage Visit';
    document.getElementById('completeRef').textContent = bookingRef;
    document.getElementById('completeEmail').textContent = bookingData.customerDetails.email;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetBooking() {
    currentStep = 1;
    selectedDate = null;
    selectedTime = '';
    bookingData = {
        vehicle: 'car',
        package: '',
        location: 'doorstep',
        date: null,
        time: '',
        vehicleDetails: {
            make: '',
            model: '',
            year: '',
            registration: ''
        },
        customerDetails: {
            name: '',
            phone: '',
            email: '',
            address: ''
        }
    };
    
    // Reset UI
    document.getElementById('progressIndicator').style.display = 'block';
    document.querySelector('.booking-steps').style.display = 'block';
    document.getElementById('bookingComplete').classList.remove('active');
    
    // Reset form fields
    document.querySelectorAll('#step3 input').forEach(input => {
        input.value = '';
    });
    
    // Reset selections
    document.querySelectorAll('.package-card-booking').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Reset vehicle selection
    document.querySelectorAll('.vehicle-btn-booking').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.vehicle-btn-booking[data-vehicle="car"]').classList.add('active');
    
    // Reset location selection
    document.getElementById('doorstep').checked = true;
    
    updateBookingStep();
    updateBookingProgress();
    updateBookingVehicleContent();
}

function getPackageData(packageId) {
    const packages = {
        basic: {
            title: 'Basic Service',
            price: { car: '$79', bike: '$49' }
        },
        standard: {
            title: 'Standard Service',
            price: { car: '$149', bike: '$89' }
        },
        premium: {
            title: 'Premium Service',
            price: { car: '$249', bike: '$129' }
        }
    };
    return packages[packageId] || packages.basic;
}

function formatDate(date) {
    if (!date) return '-';
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function generateBookingReference() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Calendar functionality
function setupCalendar() {
    const calendar = document.getElementById('calendar');
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        calendar.innerHTML = `
            <div class="calendar-header">
                <button class="calendar-nav" id="prevMonth">‹</button>
                <div class="calendar-title">${monthNames[currentMonth]} ${currentYear}</div>
                <button class="calendar-nav" id="nextMonth">›</button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-day-header">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
            </div>
        `;
        
        const grid = calendar.querySelector('.calendar-grid');
        const currentDate = new Date(startDate);
        
        for (let i = 0; i < 42; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = currentDate.getDate();
            
            const isCurrentMonth = currentDate.getMonth() === currentMonth;
            const isPast = currentDate < today;
            const isToday = currentDate.toDateString() === today.toDateString();
            const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();
            
            if (!isCurrentMonth) {
                dayElement.classList.add('other-month');
            }
            
            if (isPast && !isToday) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', () => selectDate(new Date(currentDate)));
            }
            
            if (isSelected) {
                dayElement.classList.add('selected');
            }
            
            grid.appendChild(dayElement);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Add navigation event listeners
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }
    
    function selectDate(date) {
        selectedDate = date;
        renderCalendar();
    }
    
    renderCalendar();
}

// Testimonial functionality
function setupTestimonialRotation() {
    // Auto-rotate testimonials every 5 seconds
    setInterval(() => {
        changeTestimonial(1);
    }, 5000);
}

function changeTestimonial(direction) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    // Update current testimonial index
    currentTestimonial += direction;
    if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1;
    }
    
    setTestimonial(currentTestimonial);
}

function setTestimonial(index) {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    
    currentTestimonial = index;
    
    // Update testimonial cards
    testimonials.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// Utility functions
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

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for buttons
function addLoadingState(button, duration = 2000) {
    const originalText = button.textContent;
    button.textContent = 'Loading...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, duration);
}

// Add form validation feedback
function showValidationError(input, message) {
    input.style.borderColor = '#ef4444';
    
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
    
    // Remove error styling on input
    input.addEventListener('input', function() {
        input.style.borderColor = '';
        if (existingError) {
            existingError.remove();
        }
    }, { once: true });
}

// Initialize animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[class*="animate-"], .feature-card, .package-card, .step-card, .testimonial-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// PAGE NAVIGATION HANDLER
function showPage(id) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// // // BOOK NOW BUTTON → redirect to booking.html
// const bookNowBtn = document.getElementById("bookNowBtn");
// if (bookNowBtn) {
//     bookNowBtn.addEventListener("click", () => {
//         window.location.href = "src/pages/book-service.html";   // << CHANGE PAGE NAME
//     });
// }

// // CTA BOOK BUTTON → redirect to booking.html
// const ctaBookBtn = document.getElementById("ctaBookBtn");
// if (ctaBookBtn) {
//     ctaBookBtn.addEventListener("click", () => {
//         window.location.href = "src/pages/book-service.html";   // << CHANGE PAGE NAME
//     });
// }


// function redirectToBooking() {
//     const user = JSON.parse(localStorage.getItem("mc_user"));

//     if (!user || user.role !== "customer") {
//         // Not logged in OR not customer
//         window.location.href = "src/pages/signIn.html";  
//         return;
//     }

//     // Logged in customer → redirect to booking page
//     window.location.href = "src/pages/book-service.html";
// }

// // BOOK NOW BUTTON
// const bookNowBtn = document.getElementById("bookNowBtn");
// if (bookNowBtn) {
//     bookNowBtn.addEventListener("click", redirectToBooking);
// }

// // CTA BOOK BUTTON
// const ctaBookBtn = document.getElementById("ctaBookBtn");
// if (ctaBookBtn) {
//     ctaBookBtn.addEventListener("click", redirectToBooking);
// }



// -------------------------------
// BOOK NOW BUTTON
// -------------------------------
const bookNowBtn = document.getElementById("bookNowBtn");
if (bookNowBtn) {
    bookNowBtn.addEventListener("click", () => {
        
        const token = localStorage.getItem("mc_token");

        // 1️⃣ Check login status
        if (!token) {
            alert("Please sign in as a CUSTOMER to book a service.");
            window.location.href = "src/pages/signIn.html";
            return;
        }

        // 2️⃣ Decode user role
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role;

        // 3️⃣ If role is not CUSTOMER, block
        if (role !== "CUSTOMER") {
            alert("Service booking is allowed only for customers.");
            return;
        }

        // 4️⃣ Redirect to booking page
        sessionStorage.setItem("hideMechanicLogin", "true");
        window.location.href = "src/pages/booking.html";
    });
}


// -------------------------------
// CTA BOOK BUTTON
// -------------------------------
const ctaBookBtn = document.getElementById("ctaBookBtn");
if (ctaBookBtn) {
    ctaBookBtn.addEventListener("click", () => {

        const token = localStorage.getItem("mc_token");

        // 1️⃣ Check login status
        if (!token) {
            alert("Please sign in as a CUSTOMER to book a service.");
            window.location.href = "src/pages/signIn.html";
            return;
        }

        // 2️⃣ Decode role
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role;

        // 3️⃣ Only customers allowed
        if (role !== "CUSTOMER") {
            alert("Only customers can book a service.");
            return;
        }

        sessionStorage.setItem("hideMechanicLogin", "true");
        window.location.href = "src/pages/booking.html";
    });
}
