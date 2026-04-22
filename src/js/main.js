// Import CSS
import '../css/main.css'

// Import tab functionality
import { initTabs } from './components/tabs.js'
// import { initGame } from './components/game.js' // Old game system - replaced by game-guide.js
import { initGameGuide } from './components/game-guide.js'

// Main Javascript Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tab navigation
    initTabs();
    
    // Initialize game (old system - commented out)
    // initGame();
    
    // Initialize game guide modal and new game flow
    initGameGuide();
    
    // GSAP and ScrollTrigger logic will be initialized here
    console.log("Zero-Gravity Portfolio Loaded. GSAP ready for initialization.");
});
