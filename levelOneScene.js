class levelOneScene extends Scene {
    constructor(gameCanvas, gameState) {
        super(gameCanvas, gameState);
        this.name = "Level One";
        this.player = null;
        this.terrain = null;
        this.gravity = {x:0,y:0.05};
        this.playerEffects = null;
        this.terrainMap = null;
        this.safeAreas = null;
        this.playCountDown = false;
        this.countDownStart = null;
        
    }

    draw() {
            if(!this.playCountDown){
            this.context.drawImage(this.gameState.backgroundImage, 0, 0, this.gameCanvas.width , this.gameCanvas.height );
            this.terrain.draw();
            this.particleManager.draw();
            this.player.draw();
            this.context.font = '16px Arial';
                let yPosition = 30; // Initial y position for the text
                // Velocity
                this.context.fillStyle = this.player.velocity < 4 ? 'green' : 'red';
                this.context.fillText(`Velocity: ${this.player.velocity.toFixed(2)} m/s`, 10, yPosition);
                yPosition += 20; // Increment y position for the next line
                // Fuel
                this.context.fillStyle = this.player.fuel > 0 ? 'green' : 'red';
                this.context.fillText(`Fuel: ${this.player.fuel.toFixed(2)}`, 10, yPosition);
                yPosition += 20; // Increment y position for the next line
                // Rotation
                this.context.fillStyle = (this.player.rotation > -5 && this.player.rotation < 5) ? 'green' : 'red';
                this.context.fillText(`Rotation: ${this.player.rotation.toFixed(2)} deg`, 10, yPosition);
        }
        
        else if (this.playCountDown){
            this.context.drawImage(this.gameState.backgroundImage, 0, 0, this.gameCanvas.width , this.gameCanvas.height );
            this.particleManager.draw();
            this.terrain.draw();
            if (!this.player.crashed) {
                this.player.draw();
                this.context.fillStyle = 'white';
                let beforeFont = this.context.font;
                this.context.font = "50px serif";
                this.context.fillText( "Next Stage In ...", this.context.canvas.width /2 - 150, 200);
                this.context.font = beforeFont;
                // Draw ship status text
                
            }
            if(this.player.crashed){
                this.context.fillStyle = 'white';
                let beforeFont = this.context.font;
                this.context.font = "50px serif";
                this.context.fillText( "YOU LOSE MAIN MENU IN ...", this.context.canvas.width /2 - 300, 200);
                this.context.font = beforeFont;
            }
                this.context.font = '16px Arial';
                let yPosition = 30; // Initial y position for the text
                // Velocity
                this.context.fillStyle = this.player.velocity < 4 ? 'green' : 'red';
                this.context.fillText(`Velocity: ${this.player.velocity.toFixed(2)} m/s`, 10, yPosition);
                yPosition += 20; // Increment y position for the next line
                // Fuel
                this.context.fillStyle = this.player.fuel > 0 ? 'green' : 'red';
                this.context.fillText(`Fuel: ${this.player.fuel.toFixed(2)}`, 10, yPosition);
                yPosition += 20; // Increment y position for the next line
                // Rotation
                this.context.fillStyle = (this.player.rotation > -5 && this.player.rotation < 5) ? 'green' : 'red';
                this.context.fillText(`Rotation: ${this.player.rotation.toFixed(2)} + deg`, 10, yPosition);


                //Countdown
                this.context.fillStyle = 'white';
                let beforeFont = this.context.font;
                this.context.font = "50px serif";
                
                this.context.fillText( (3 - Math.floor((this.gameState.totalTime - this.countDownStart) / 1000)), this.context.canvas.width /2, this.context.canvas.height /2);
                this.context.font = beforeFont;
        }
        
        
            
    }

    onKeyPress(event) {
        if(!this.player.collided){
        var moveVector = {}
        if (event === this.gameState.controls.up) {
            if (this.player.fuel > 0){
            var directionAngle = this.player.rotation * Math.PI / 180; 
            var dirY = Math.cos(directionAngle);
            var dirX = -(Math.sin(directionAngle));

            dirY = dirY * -this.player.thrust;
            dirX = dirX * -this.player.thrust /2;
            moveVector = {x:dirX,y:dirY}
            this.player.updateDir(moveVector);
            this.player.fuel -= 0.1;
            if (!this.player.collided){
            this.particleManager.shipThrust(this.player);
            //this.playerEffects.playSound("thrust_audio");
            }
        }
        if(this.player.fuel < 0){
        this.player.fuel = 0;
        }
        }
        if (event === this.gameState.controls.left){
            
            this.player.rotation += -.3;
            
        }
        if (event === this.gameState.controls.right){
            
                this.player.rotation += .3;
                }
        }
    }

    update() {
        if(!this.playCountDown){
        this.player.updateDir(this.gravity);
        }
        this.player.move();
        
        this.particleManager.update();
        //check for collision
        if (!this.player.collided){
        for (let x = 1; x < this.terrainMap.length - 2; x++){
            let collision = lineCircleIntersection(this.terrainMap[x], this.terrainMap[x+1], this.player.circle)
            if(collision.intersect){
                if(collision.safe && (this.player.velocity < 4) && (this.player.rotation <= 5) && (this.player.rotation >= -5)) {
                    this.endGame(false);
                    return;
                    
                }
                else {
                    this.endGame(true);
                    return;
                    
                    
                }
            }
        }
    }
    if(this.playCountDown){
        if (( this.countDownStart + 3000 - this.gameState.totalTime ) < 0){
            if(this.player.crashed){
            this.gameState.score = 0;
            this.gameState.changeScene(new MainMenuScene("gameSpace", gameState));
            }
            if(!this.player.crashed){
            this.gameState.score += this.player.fuel;
            this.gameState.changeScene(new levelTwoScene("gameSpace", gameState));
            }
        }
    }
    }

    onLoad(){
        const gameSpace = document.getElementById("gameSpace");
        this.gameCanvas = document.createElement("canvas");
        this.gameCanvas.id = "gameCanvas";
        this.gameCanvas.width = window.innerWidth;
        this.gameCanvas.height = window.innerHeight;
        this.context = this.gameCanvas.getContext('2d');
        gameSpace.appendChild(this.gameCanvas);
        this.player = new Player("./LunarLander.png", this.gameCanvas.width / 2, 0, this.context);
        this.terrain = new TerrainGenerator(this.context, 2);
        this.terrain.generate();
        this.playerEffects = new Effects([], this.player, this.gameState.resources.audio)
        this.terrainMap = this.terrain.getVertices();
        this.safeAreas = this.terrain.getSafeAreas();
        this.particleManager = new ParticleManager(this.context, this.gameState);

    }
    
    endGame(crashed){
        if (!crashed){
            this.player.collided = true;
            this.player.crashed = false;
            //particles.celebrate
            this.playCountDown = true;
            this.countDownStart = this.gameState.totalTime;
        }
        if (crashed){
            this.player.collided = true;
            this.player.crashed = true;
            this.particleManager.shipCrash(this.player);
            this.playCountDown = true;
            this.countDownStart = this.gameState.totalTime;
            //this.mainmenutransition
        }
    }
}
