document.addEventListener('DOMContentLoaded', function() {
    const profilePhoto = document.querySelector('.profile-photo img');
    const originalBlur = '0px';
    let maxBlur = 10; // Maximum blur intensity in pixels
    
    // Set initial blur
    profilePhoto.style.filter = `blur(${originalBlur})`;
    
    // Track mouse position globally
    document.addEventListener('mousemove', function(e) {
        // Get viewport dimensions
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        
        // Calculate cursor position as percentage of viewport
        const xPercent = e.clientX / vw;
        const yPercent = e.clientY / vh;
        
        // Calculate distance from center (0-1 value)
        const distanceFromCenter = Math.sqrt(
            Math.pow(xPercent - 0.5, 2) + 
            Math.pow(yPercent - 0.5, 2)
        ) * 2; // Multiply by 2 to get range 0-1.4 (diagonal corner)
        
        // Calculate blur intensity based on screen position
        const blurIntensity = distanceFromCenter * maxBlur;
        
        // Apply the blur filter
        profilePhoto.style.filter = `blur(${blurIntensity}px)`;
    });
    
    // Reset blur when mouse leaves the window
    document.addEventListener('mouseleave', function() {
        profilePhoto.style.filter = `blur(${originalBlur})`;
    });
});