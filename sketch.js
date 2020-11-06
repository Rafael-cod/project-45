const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var player, bgImg, bg;
var ground1, ground2, ground3;
var obsImg, obstacle, obstacleGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var health = 100;
var hunger = 100;
var radiation = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var rd, hg, foodGroup, apple, banana, garlic, meat, potato, water;
var rdImg, hgImg, appleImg, bananaImg, garlicImg, meatImg, potatoImg, waterImg;
var gameOver, reset, gameOverImg, resetImg;

function preload(){
  bgImg = loadImage("images/bg.jpg");
  hgImg = loadImage("images/hunger.png");
  rdImg = loadImage("images/rd.png");
  obsImg = loadImage("images/animal.png");
  appleImg = loadImage("images/apple.png");
  bananaImg = loadImage("images/banana.png");
  garlicImg = loadImage("images/garlic.png");
  meatImg = loadImage("images/meat.png");
  potatoImg = loadImage("images/potato.png");
  waterImg = loadImage("images/water.png");
  gameOverImg = loadImage("images/gameOver.png");
  resetImg = loadImage("images/reset.png");

}

function setup() {
  createCanvas(displayWidth, 710);

  bg = createSprite(width/2,height/2,600,600);
  bg.addImage(bgImg);
  bg.x = bg.width/2;
  bg.scale = 1

  hg = createSprite(50,60);
  hg.addImage(hgImg);
  hg.scale = 0.015;

  rd = createSprite(50,110);
  rd.addImage(rdImg);
  rd.scale = 0.03;

  foodGroup = new Group();
  obstacleGroup = new Group();
  
  //engine = Engine.create();
	//world = engine.world;
  
  ground1 = createSprite(displayWidth/2,700,displayWidth*2,20);
  ground2 = createSprite(displayWidth/2,450,displayWidth*2,20);
  ground3 = createSprite(displayWidth/2,250,displayWidth*2,20);

  player = createSprite(200,450,50,50);
  player.shapeColor = "black";

  gameOver = createSprite(displayWidth/2,300);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;

  reset = createSprite(displayWidth/2,450);
  reset.addImage(resetImg);
  reset.scale = 0.05;
  reset.visible = false;
  
	//Engine.run(engine);
}

function draw() {
  background(255);

  if(mouseX === 50 && mouseY === 60){
    text("Hunger",mouseX, mouseY);
  }

  if(player.y > 220){
    player.x = 200;
  }

  player.collide(ground1);
  player.collide(ground2);
  player.collide(ground3);
  
  obstacleGroup.collide(ground1);
  obstacleGroup.collide(ground2);
  obstacleGroup.collide(ground3);

  if(gameState === PLAY){

    bg.velocityX = -3;
    if(bg.x < 0){
      bg.x = bg.width/2;
    }
    
    console.log(player.y)
    //moving player
    if(player.position.y <= 220){
      if(keyDown("LEFT")){
        player.x -= 4;
      }
      if(keyDown("RIGHT")){
        player.x += 4;
      }
    }
    if(player.position.y === 415){
      if(keyDown("UP")){
        player.shapeColor = "red";
        player.y = 205;
      }
    }
    if(player.position.y === 665){
      if(keyDown("UP")){
        player.shapeColor = "black";
        player.y = 405;
      }
    }
    if(player.position.y === 215){
      if(keyDown("DOWN")){
        player.y = 405;
        player.shapeColor = "black";
      }
    } 
    if(player.position.y === 415){
      if(keyDown("DOWN")){
        player.y = 655;
        player.shapeColor = "blue";
      }
    }

    //making player jump
    if(keyDown("SPACE")){
      player.velocityY = -10;
      //Matter.Body.applyForce(player.body,player.body.position,{x:0,y:-10});
    }
  
    //add gravity
    player.velocityY = player.velocityY + 0.5;

    //creating wild animal
    //Matter.Body.applyForce(obstacle.body,obstacle.body.position,{x:-2,y:0});
    /*if(frameCount % 150 === 0){
      obstacle = new Obstacle(displayWidth+20,random(225,685),50,50);
    }*/

    if(frameCount % 15 === 0 && health >= 1 && radiation === 100){
      health -= 1;
    }

    if(frameCount % 100 === 0){
      hunger -= 1;
    }

    if(frameCount % 150 === 0 && radiation <= 99){
      radiation += 1;
    }

    if(foodGroup.isTouching(player)){
      hunger += 5;
      foodGroup.destroyEach();
      player.shapeColor = "yellow"
    }

    if(health === 0){
      gameState = END;
    }

    if(hunger >= 100){
      hunger = 100;
    }

    if(player.isTouching(obstacleGroup)){
      health = Math.round(health-50);
    }
    
  spawnFoods();
  spawnObstacles();

  }else if(gameState === END){
    foodGroup.setVelocityXEach(0);
    foodGroup.setLifetimeEach(-1);
    bg.velocityX = 0;
    
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
   
    player.setVelocity(0,0);

    gameOver.visible = true;
    reset.visible = true;

    if(mousePressedOver(reset)){
      restart();
    }

  }
  
  /*ground1.display();
  ground2.display();
  ground3.display();
  player.display();
  obstacle.display();*/

  drawSprites();

  stroke(25);
  strokeWeight(3);
	textSize(30);
	fill(255,100,100);
  text("Health:  " + health, 25, 25);
  text(hunger, 85, 70);

	fill(100,255,100);
  text(radiation, 85, 120);

  if(mouseIsOver(hg)){
    textSize(15);
    fill(200);
    text("Hunger", mouseX, mouseY);
  }

  if(mouseIsOver(rd)){
    textSize(15);
    fill(200);
    text("Radiation", mouseX, mouseY);
  }

  /*if(gameState === END){
    textSize(75);
    fill(250,50,50);
    text("Game Over",displayWidth/2 -100,displayHeight/2);
  }*/

}

function spawnFoods() {
  if(frameCount % 120 === 0) {
    var food = createSprite(width,random(200,685));
    food.velocityX  = -4;
    //- (6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: food.addImage(appleImg);        
      food.scale = 0.07;
              break;
      case 2: food.addImage(bananaImg);        
      food.scale = 0.04;
              break;
      case 3: food.addImage(garlicImg);        
      food.scale = 0.05;
              break;
      case 4: food.addImage(meatImg);        
      food.scale = 0.05;
              break;
      case 5: food.addImage(potatoImg);        
      food.scale = 0.03;
              break;
      case 6: food.addImage(waterImg);        
      food.scale = 0.1;
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle   
    food.lifetime = width/4;
    foodGroup.add(food);
  }
}

function spawnObstacles() {
  if(frameCount % 150 === 0) {
    var obstacle = createSprite(width,random(210,685),50,50);
    obstacle.velocityX  = -4;
    obstacle.velocityY  = 4;

    obstacle.addImage(obsImg);
    obstacle.scale = 0.2;
    
    //assign scale and lifetime to the obstacle   
    obstacle.lifetime = width/4;
    obstacleGroup.add(obstacle);
  }
}

function restart(){
  gameState = PLAY;
  player.x = 200;
  player.y = 425;
  foodGroup.destroyEach();
  obstacleGroup.destroyEach();
  gameOver.visible = false;
  reset.visible = false;
  health = 100;
  hunger = 100;
  radiation = 0;

}