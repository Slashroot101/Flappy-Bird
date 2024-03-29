let lastHolePosition;

let mainState = {
  preload: function () {
    game.load.image('bird', 'assets/bird.png');
    this.pipes = game.add.group();
    game.cache.addSound('jump', 'assets/jump.wav', game.load.audio('jump', 'assets/jump.wav'));
    game.load.image('pipe', 'assets/pipe.png');
  },
  create: function () {
    this.jumpSound = game.add.audio('jump');
    game.stage.backgroundColor = '#71c5cf';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bird = game.add.sprite(100, 245, 'bird');
    this.bird.scale.set(.85, .85);
    game.physics.arcade.enable(this.bird);
    this.bird.body.gravity.y = 1000;
    let spaceKey = game.input.keyboard.addKey(
        Phaser.Keyboard.SPACEBAR);
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0",
        { font: "30px Arial", fill: "#ffffff" });
    spaceKey.onDown.add(this.jump, this);
    game.input.onDown.add(this.jump, this);
    this.timer = game.time.events.loop(1750, this.addRowOfPipes, this);
  },
  update: function() {
    if (this.bird.angle < 20)
      this.bird.angle += 1;
    if (this.bird.y < 0 || this.bird.y > window.innerHeight *  window.devicePixelRatio)
      this.restartGame();
    game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);
  },
  jump: function() {
    if (this.bird.alive == false)
      return;
    this.jumpSound.play();
    this.bird.body.velocity.y = -350;
    let animation = game.add.tween(this.bird);
    animation.to({angle: -20}, 100);
    animation.start();
  },
  restartGame: function() {
    lastHolePosition = undefined;
    game.state.start('main');
  },
  addOnePipe: function(x, y){
    const pipe = game.add.sprite(x,y, 'pipe');
    this.pipes.add(pipe);
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = -200;
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },
  addRowOfPipes: function() {
    let hole;
    if(lastHolePosition === undefined){
      hole = Math.floor(Math.random() * 3 * window.devicePixelRatio) + 6;
    } else {
      hole = Math.floor(Math.random() * lastHolePosition + 3) + (lastHolePosition - 6 < 0 ? lastHolePosition - 0 : lastHolePosition - 6);
      if(hole >= (8 * (Math.floor(window.innerHeight + 490 / 490)))){
        hole = (8 * (Math.floor(window.innerHeight + 490 / 490))) - 4;
      }
    }
    lastHolePosition = hole;
    for (let i = 0; i < 8 * (Math.floor(window.innerHeight + 490 / 490)); i++)
      if (i !== hole && i !== hole + 1)
        this.addOnePipe(400, i * 60 + 10);
    this.score += 1;
    this.labelScore.text = this.score;
  },
  hitPipe: function() {
    if (this.bird.alive == false)
      return;
    this.bird.alive = false;
    game.time.events.remove(this.timer);
    this.pipes.forEach(function(p){
      p.body.velocity.x = 0;
    }, this);
  },
};

let game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS);
game.state.add('main', mainState);
game.state.start('main');
