class TerrainGenerator {
    constructor(context, numSafeAreas) {
        this.context = context;
        this.numSafeAreas = numSafeAreas;
        this.vertices = null;
        this.height = this.context.canvas.height;
        this.width = this.context.canvas.width;
        this.maxHieght = this.height - this.height/5; //Actually the lowest point on screen // higher integer means deeper valley
        this.minHeight = this.height - this.height/2;; // actually the highest point on screen //higher integer means 
        this.variationScalar = 2.5; //lower = more variance
        this.safeAreas = [];
        this.safeAreaLength = this.width/14;
        
    }

    generate() {
        // Clear any existing vertices
        this.vertices = null;
        // Generate terrain using Random Midpoint Displacement algorithm
        let start = {
            x:0,
            y:(this.randHeight(this.minHeight,this.maxHieght)),
            safe: false
        };
        let end = {
            x:this.width,
            y:(this.randHeight(this.minHeight,this.maxHieght)),
            safe: false}
        this.vertices = this.generateTerrain(start, end, 8, 50);
        // Sort vertices based on x-coordinate for rendering
        this.vertices.sort((a, b) => a.x - b.x);
        var vertBeg = {x:-100,y:this.height+100, safe:false};
        var vertEnd = {x:this.width +100, y:this.height + 100,safe:false}
        this.vertices.unshift(vertBeg);
        this.vertices.push(vertEnd);
        this.assignSafeAreas();
    }
    generateTerrain(start, end, numIterations, s) {
        let points = [start, end];
        for (let i = 0; i < numIterations; i++) {
            points = this.midpointDisplacement(points, s);
        }
        points.sort((a, b) => a.x - b.x);
        
        return points;
    }  
    midpointDisplacement(points, s) {
        const newPoints = [points[0]];
        for (let i = 0; i < points.length - 1; i++) {
            const a = points[i];
            const b = points[i + 1];
            const midpoint = {
                x: (a.x + b.x) / 2,
                y: (this.computeElevation(a, b,)),
                safe: false
            };
            newPoints.push(midpoint, b);
        }

        return newPoints;
    }

    computeElevation(a, b) {
        var length = b.x - a.x;
        const maxVariation = length/this.variationScalar; // Maximum variation allowed from the previous elevation
        const prevElevation = (a.y + b.y) / 2;
        const minElevation = Math.max(this.minHeight, prevElevation - maxVariation);
        const maxElevation = Math.min(this.maxHieght, prevElevation + maxVariation);
        const elevation = this.randHeight(minElevation, maxElevation);
        return elevation;
    }

    randHeight(min, max) {
        return (Math.random() * (max - min) + min);
    }
    assignSafeAreas() {
        let validAreas = this.vertices.filter(vertex => vertex.x > this.width / 5 && vertex.x < (4 * this.width) / 5);
        for (let i = 0; i < this.numSafeAreas; i++) {
            let area = this.getRandomElement(validAreas);
            this.safeAreas.push(area);
    
            // Remove areas within a certain range from the newly selected area
            validAreas = validAreas.filter(vertex => Math.abs(vertex.x - area.x) >= this.width / 6);
    
            // Iterate through vertices and adjust Y values within the safe area range
            for (let vertex of this.vertices) {
                if (vertex.x >= area.x && vertex.x < area.x + this.safeAreaLength) {
                    vertex.y = area.y;
                    vertex.safe = true; // Set Y value to the safe area's Y value
                }
            }
        }
        console.log("done!");
    }
    getSafeAreas() {
        return this.safeAreas;
    }
    
    getRandomElement(array) {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    draw() {
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(this.vertices[0].x, this.vertices[0].y);
        for (let i = 1; i < this.vertices.length; i++) {
            this.context.lineTo(this.vertices[i].x, this.vertices[i].y);
        }
        this.context.strokeStyle = 'white';
        this.context.lineWidth = 3;
        this.context.closePath();
        this.context.stroke();
        this.context.fillStyle = "grey";
        this.context.fill();
        this.context.restore();
    }

    getVertices() {
        return this.vertices;
    }
    
}
