class Player {
    constructor(x, y) {
      var options = {
           isStatic:false,
          'friction':10.0,
          'density':0.1
      }
      this.body = Bodies.rectangle(x, y, 50, 50, options);
      this.width = 50;
      this.height = 50;
      
      World.add(world, this.body);
    }
    display(){
      var pos = this.body.position;
      push();
      translate(pos.x, pos.y);
      rectMode(CENTER);
      strokeWeight(3);
      stroke("grey");
      fill("red");
      rect(0, 0, this.width, this.height);
      pop();
    }
  }
  