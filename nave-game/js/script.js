window.onload = function() {
      
    const myCanvas = document.getElementById('my-canvas');
    const ctx = myCanvas.getContext('2d');
    
    const bg = new Image();
    bg.src = "./img/background_space.png";
    //bg.src = "./img/background.png";

    const img = new Image();
    img.src = "./img/nave-aliada.png";
    //img.src = "./img/nave-kelly.png";

    const ene = new Image();
    ene.src = "./img/asteroid.png";

    //let ene = GIF();
    //ene.load("./img/ship.gif");
    //ene.src = "./img/ship.gif";

    let score = 0;
    qtdEnemies = [];
    qtdShoots = [];
    let start = false;

    let myMusic;

      
//////// class Player //////////
    class Player{
      constructor(){
        this.health = 150;
        this.x = 390;
        this.y = 580;
        this.width = 80;
        this.height = 180;
      }       
       
      getHealth(){
        return this.health;
      }
      
      receiveDamage(){
        this.health = this.health - 50;
      }

      shoot() {
        let shoot = new ShootPlayer();  
        qtdShoots.push(shoot);
      }
    }

//////// class Enemy //////////
    class Enemy {
        constructor(){
        this.active = true;
        this.color = "blue";
        this.x = myCanvas.width * Math.random();
        this.y = 0;
        this.width = 50;
        this.height = 50;
        }
  
        enemyDraw() {
            //ctx.save();
            //ctx.rotate(90 * Math.PI / 180);
            ctx.drawImage(ene, this.x, this.y, this.width, this.height);
            //ctx.restore();
            //ctx.fillStyle = this.color;
            //ctx.fillRect(this.x, this.y, this.width, this.height);
        };
  
        enemyDie() {
            this.active = false;
            score += 10;
        };
    }
/////////////////////////////////////////////////////

class ShootPlayer {
    constructor(){
    this.active = true;
    this.color = "yellow";
    this.width = 5;
    this.height = 20;
    this.x = nave.x + 45;
    this.y = nave.y;
  }
  
  shootDraw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  
  shootDie() {
    this.active = false;
  };
}
/////////////////////////////////////////////////////////////////////////////  
    
function startGame() {
  explosionPlayer = new Audio("./music/explosion_player.mp3");
  explosionEnemies = new Audio("./music/explosion_asteroid.mp3");
  shootMusic = new Audio("./music/weapon_player.mp3");
  myMusic = new Audio("./music/game_music.mp3");
  myMusic.play();
}


    let nave = new Player();
     
    let backgroundImage = {
        img: bg,
        y: 0,
        speed: 1,
      
        move: function() {
          this.y += this.speed;
          this.y %= myCanvas.height;
        },
      
        draw: function() {
          ctx.drawImage(this.img, 0, this.y);
          if (this.speed < 0) {
            ctx.drawImage(this.img, 0, this.y + myCanvas.height);
          } else {
            ctx.drawImage(this.img, 0, this.y - myCanvas.height);
          }
        },
      };
  
    function addEnemy(){
      if(getRandom(50) > 49){
        let enemy = new Enemy();
        qtdEnemies.push(enemy);
        enemy.enemyDraw();   
      }
      
    }

    function updatePositions(){
      for(let i = 0; i < qtdEnemies.length; i++){
         if(qtdEnemies[i].active === true){
            qtdEnemies[i].y += 4;
            qtdEnemies[i].x += (getRandom(7)) - 3;
            qtdEnemies[i].enemyDraw();
         }
         if(qtdEnemies[i].y > 800){
            qtdEnemies[i].active = false;
            qtdEnemies.splice(i,1);
         }    
      }
      for(let j = 0; j < qtdShoots.length; j++){
        if(qtdShoots[j].active === true){
            qtdShoots[j].y -= 4;
            qtdShoots[j].shootDraw();
        }
        if(qtdShoots[j].y < 0){
            qtdShoots[j].active = false;
            qtdShoots.splice(j,1);
        }
      }

      ctx.font = "20pt Calibri";
      ctx.fillStyle = "white";
      ctx.fillText(`Score: ${score}`, 5, 30);
      ctx.fillText(`Health: ${nave.getHealth()}`, 5, 60);

    }

    function naveSpace(){
      ctx.drawImage(img, nave.x, nave.y, 100, 200);
    }

    function collisionCheck(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    function collisionOccurs() {
        qtdShoots.forEach(function(shoot) {
            qtdEnemies.forEach(function(enemy) {
              if (collisionCheck(shoot, enemy)) {
                explosionPlayer.play();
                shoot.shootDie();
                enemy.enemyDie();
              }
            });
        });       
    }

    function collisionPlayerOccurs(){
      qtdEnemies.forEach(function(enemy) {
        if (collisionCheck(enemy, nave)) {
          explosionEnemies.play();
          enemy.enemyDie();
          nave.receiveDamage();
        }
      });  
    }
    
    function removeShootEnemy(){
      for(let i = 0; i < qtdEnemies.length; i++){
        if(qtdEnemies[i].active === false){
          qtdEnemies.splice(i,1);
        }
      }
      for(let j = 0; j < qtdShoots.length; j++){
        if(qtdShoots[j].active === false){
          qtdShoots.splice(j,1);
        }
      }  
    }
   
    document.onkeydown = function(e){
      controlPosition(e.keyCode);
    };
    
    function getRandom(value){
       return (Math.random() * value); 
    }

    function controlPosition(key) {
      let result = key;
      if(result === 37){
        if ( nave.x > 10){
          nave.x -= 10;
        }
      }
      if(result === 39) {
        if ( nave.x < 790){
          nave.x += 10;
        }
      }
      if(result === 40){
        if ( nave.y < 600){
          nave.y += 10;
        }
      }
      if(result === 38) {
        if ( nave.y > 10){
          nave.y -= 10;
        }
      }
      if(result === 32) {
        shootMusic.play();
        nave.shoot();
      }
      if(result === 13) {
        start = true;
        startGame();
        animate(); 
      }
      return false; 
    };
    
    function clear(){
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);  
    }

    function animate(){
      backgroundImage.move();
      clear();
      backgroundImage.draw();
      naveSpace();
      controlPosition();
      updatePositions();
      addEnemy();
      collisionOccurs();
      removeShootEnemy();
      collisionPlayerOccurs();
      if (nave.getHealth() < 0) {
        ctx.font = "50pt Calibri";
        ctx.fillText("Game Over", 280, 400);
        return false;
      }
      window.requestAnimationFrame(animate);  
    }
}; 