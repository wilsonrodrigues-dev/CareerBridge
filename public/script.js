document.addEventListener("DOMContentLoaded", function () {
console.log("JS is running");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  // Toggle menu
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close when link clicked
  navItems.forEach(function(link) {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // SCROLL ANIMATIONS
  observeElements();
  
  // AUTO-INCREMENT STATS
  initStatsCounter();

});

document.getElementById("studentBtn").addEventListener("click", () => {
  window.location.href = "/student_dashboard/login.html";
});

document.getElementById("officerBtn").addEventListener("click", () => {
  window.location.href = "/admin_dashboard/adminlogin.html";
});

// Scroll Animation Observer
function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      const animationType = entry.target.dataset.animation || 'fade-in';
      
      if (entry.isIntersecting) {
        // Add animation classes when element enters view
        entry.target.classList.add(animationType);
      } else {
        // Remove animation classes when element leaves view to allow re-triggering
        entry.target.classList.remove(animationType);
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  const animatedElements = document.querySelectorAll('[data-animation]');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Auto-increment Stats Counter
function initStatsCounter() {
  const statsSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let isAnimating = false;

  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isAnimating) {
        isAnimating = true;
        animateNumbers(statNumbers);
        
        // Reset flag after animation completes
        setTimeout(() => {
          isAnimating = false;
        }, 2000);
      }
    });
  }, {
    threshold: 0.5
  });

  if (statsSection) {
    counterObserver.observe(statsSection);
  }
}

function animateNumbers(elements) {
  elements.forEach(element => {
    // Get the original value from data attribute or element content
    const originalValue = element.dataset.originalValue || element.textContent;
    element.dataset.originalValue = originalValue;
    
    const finalValue = originalValue;
    
    // Extract numeric value and suffix
    const match = finalValue.match(/(\d+)/);
    if (!match) return;
    
    const numericValue = parseInt(match[1]);
    const suffix = finalValue.replace(/\d+/g, '');
    
    const duration = 2500; // 2.5 seconds for smoother animation
    const startTime = Date.now();
    
    // Easing function for smooth animation
    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

    function updateCount() {
      const currentTime = Date.now() - startTime;
      const progress = Math.min(currentTime / duration, 1);
      const easeProgress = easeOutQuad(progress);
      
      const currentValue = Math.floor(easeProgress * numericValue);
      element.textContent = currentValue + '+' + suffix.replace('+', '');
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = finalValue;
      }
    }

    updateCount();
  });
}

