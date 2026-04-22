// Game Main Javascript
// import '../css/base/variables.css'
// import '../css/base/reset.css'
// import '../css/components/animations.css'
// import '../css/components/liquid-button.css'
// import '../css/components/game.css'

// Import game guide functionality
import { initGameGuide } from './components/game-guide.js'

// Main Game Initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Game Loaded - Sự thay đổi: Chiến lược kinh tế');
    
    // Initialize game guide modal and game flow
    initGameGuide();
});
