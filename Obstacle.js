class Obstacle {
    constructor(x, y, width, height) {
      var options = {
        isStatic:false,
       'friction':0.7,
       'density':0.5
      }
      this.body = Matter.Bodies.rectangle(x, y, width, height, options);
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.image = loadImage("images/animal.png");

      World.add(world, this.body);
    }
    display(){
      var pos = this.body.position;
      push();
      translate(pos.x, pos.y-25);
      imageMode(CENTER);
      //strokeWeight(0);
      //fill(100);
      image(this.image,0,0,this.width+50,this.height+50);
      pop();
    }
  }
  