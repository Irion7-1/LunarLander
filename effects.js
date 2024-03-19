class Effects {
    constructor(options, object, sounds) {
        // Initialize with options
        this.options = options;
        this.object = object;
        this.sounds = sounds;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Other initialization if needed
    }

    // Draw method to render effects
    draw() {
        // Code to draw effects on the canvas
    }

    // Update method to update the state of effects
    update() {
        // Code to update effects' state
    }

    // Method to play sound effects
    playSound(soundName) {
        // Retrieve the audio element from the sounds object
        var audio = this.sounds[soundName];
        audio.crossOrigin = 'anonymous';
    
        // Check if the audio element exists
        if (!audio) {
            console.error("Audio element not found for sound name:", soundName);
            return;
        }
    
        
    
        // Create a new source node and connect it to the audio context's destination
        let source = this.audioContext.createMediaElementSource(audio);
        source.connect(this.audioContext.destination);
    
        // Start playing the audio
        audio.play();
    }
    crashLanding(){
        console.log("crashed")
    }
    
    // Method to create particles
    createParticles() {
        // Code to create particles
    }
}