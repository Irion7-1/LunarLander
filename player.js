class Player {
    constructor(spriteSrc, initialX, initialY, context) {
        this.sprite = new Image();
        this.sprite.src = spriteSrc;
        
        this.thrust = .06;
        this.velocityLimit = 15;
        this.velocity = 0;
        this.fuel = 100;
        
        this.rotation = 0; // Initial rotation value (in degrees)
        this.direction = { // Initial direction vector
            x: 0, // Horizontal component
            y: 0 // Vertical component
        };
        this.x = initialX; // Initial X position
        this.y = initialY; // Initial Y position
        
        this.context = context;
        this.spriteHeight = this.context.canvas.width/14/3
        this.spriteWidth = this.context.canvas.width/14/3
        this.circle = {
            radius: Math.sqrt((this.spriteWidth ** 2 )+ (this.spriteHeight ** 2)) /2,
            center: {
                x: this.x, 
                y: this.y
            }
        }
        this.collided = false;
        this.crashed = false;
    }

    move() {
        if (!this.collided){
         this.x += this.direction.x
         this.y += this.direction.y
        
         if (this.x > this.context.canvas.width){
            this.x = 10;
         }
         if (this.x < 0){
            this.x = this.context.canvas.width;
         }
         this.circle.center.x = this.x;
         this.circle.center.y = this.y -10;
        }
         
         
         
         
         //console.log(this.x, this.y)

        
    }
    updateDir(movevector){
        
        var mag = Math.sqrt(((this.direction.x += movevector.x) ** 2) + ((this.direction.y += movevector.y) ** 2))
        if (mag < this.velocityLimit){
        this.direction.x += movevector.x;
        this.direction.y += movevector.y;
        }
        else {
            this.direction.x -= movevector.x /2;
            this.direction.y -= movevector.y /2;
        }
        this.velocity = mag;
        
    
        
    }

    rotate(degrees) {
        // Rotate the player
        this.rotation += degrees;
    }

    draw() {
        // Draw the player sprite on the canvas context
        this.context.save();
        
        var centerX = this.x;
        var centerY = this.y;
        
        this.context.translate(centerX, centerY);
        this.context.rotate((Math.PI / 180) * this.rotation);
        
        
        this.context.drawImage(this.sprite, -this.spriteWidth/2, -this.spriteHeight/2, this.spriteWidth, this.spriteHeight);
        this.context.translate(-centerX, -centerY);1
        this.context.restore();
    }
 
    
}
