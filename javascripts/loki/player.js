var Loki = Loki || {};

Loki.Player = new Class({
  Implements: [Options],
  
  options: {
    size: {
      x: 32,
      y: 48
    },
    sprites: {
      body: null,
      hair: null,
      armor: null,
      weapon: null
    },
    animations: {
      'move left': [
        [0, 48, 8],
        [32, 48, 8],
        [64, 48, 8],
        [96, 48, 8]
      ],
      'move right': [
        [0, 96, 8],
        [32, 96, 8],
        [64, 96, 8],
        [96, 96, 8]
      ],
      'move up': [
        [0, 144, 8],
        [32, 144, 8],
        [64, 144, 8],
        [96, 144, 8]
      ],
      'move down': [
        [0, 0, 8],
        [32, 0, 8],
        [64, 0, 8],
        [96, 0, 8]
      ]
    }
  },
  
  scene: {},
  sprites: {},
  animations: {},
  animation: null, // current animation
  
  initialize: function (scene, options) {
    this.scene = scene;
    this.setOptions(options);
    
    this.$createSprites();
    this.$createAnimations();    
  },
    
  // change position of all sprites
  position: function (x, y) {
    Object.each(this.sprites, function (sprite, name) {
      if (x) sprite.setX(x);
      if (y) sprite.setY(y);
    }.bind(this));
  },
  
  setAction: function (action) {
    if (action == 'idle') {
      this.resetAnimations();
    } else {
      this.animate(action);
    }
  },
  
  // start a given animation
  animate: function (animation) {
    this.animation = animation;
    this.animations[animation].next();
  },
  
  // resets all animations
  resetAnimations: function () {
    Object.each(this.animations, function (animation, name) {
      animation.reset();
    }.bind(this));
    this.animation = null;
  },
  
  // updates all sprites
  update: function () {
    Object.each(this.sprites, function (sprite, name) {
      sprite.update();
    }.bind(this));
  },
  
  // removes all sprites from the scene
  remove: function () {
    Object.each(this.sprites, function (sprite, name) {
      sprite.remove();
    }.bind(this));
  },
  
  // creates sprites from options
  $createSprites: function () {
    Object.each(this.options.sprites, function (sprite, name) {
      if (!sprite) return;
      this.sprites[name] = this.scene.Sprite(sprite);
      this.sprites[name].size(this.options.size.x, this.options.size.y);
    }.bind(this));
  },
  
  // creates animations from options
  $createAnimations: function () {
    Object.each(this.options.animations, function (animation, name) {
      if (!animation) return;
      this.animations[name] = this.scene.Cycle(animation);
      this.animations[name].addSprites(Object.values(this.sprites));
    }.bind(this));
  }
})