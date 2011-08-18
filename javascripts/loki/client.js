var Loki = Loki || {};

Loki.Client = new Class({
  Implements: [Options],
  
  options: {
    fps: 60
  },
  
  socket: null,
  scene: null,
  input: null,
  ticker: null,
  
  entities: {
    players: {}
  },
  
  gameState: {},
  lastActions: [], // the most recently sent actions to the server
  
  keys: {
    'w': 'move up',
    'a': 'move left',
    's': 'move down',
    'd': 'move right'
  },

  initialize: function (options) {
    this.setOptions(options);
    
    this.initializeSocket();
    this.addSocketListeners();

    this.initializeDisplay();
  },

  initializeSocket: function () {
    this.socket = io.connect('http://localhost:4200');
  },

  initializeDisplay: function () {
    this.scene = sjs.Scene({
      w: document.getSize().x,
      h: document.getSize().y,
      autoPause: false
    });
    this.input = new Loki.Input(this.scene);
    this.scene.loadImages(['images/sprites/04.png', 'images/sprites/05.png'], function () {
      this.ticker = this.scene.Ticker(1000 / this.options.fps, this.update.bind(this));
      this.ticker.run();
    }.bind(this));
  },

  addSocketListeners: function () {
    this.socket.on('log in prompt', function (data) {

      // motd
      alert(data.message);

      // login prompt
      var name = prompt('Name:', '');
      if (name) this.socket.emit('log in', { name: name });
    }.bind(this));

    this.socket.on('game state', function (data) {
      this.gameState = data;
    }.bind(this));
  },
  
  // update function (runs on game loop)
  update: function () {
    this.output();
    this.draw();
  },
  
  // send user input to server
  output: function () {
    var actions = this.getCurrentActions();
    var time = new Date().getTime();
    
    // don't send idle repeatedly
    if (actions[0] == 'idle' && this.lastActions[0] == 'idle') return;
    
    actions.each(function (action) {    
      this.socket.emit(action);
    }.bind(this));
  
    // store last actions and time sent
    this.lastActions = actions;
  },
  
  // (re)draw the game
  draw: function () {
    this.clean();
    this.drawPlayers();
  },

  // (re)draws all players based on current game state
  drawPlayers: function () {
    // go through players in game state and (re)draw them
    Object.each(this.gameState.players, this.drawPlayer.bind(this));
  },

  // draw player with given data
  drawPlayer: function (data) {
    // get stored player item if we have one
    var player = this.entities.players[data.name];

    // create player sprite if we don't have one yet
    if (!player) {
      player = new Loki.Player(this.scene, {
        sprites: {
          body: 'images/sprites/05.png'
        }
      });
    }
    
    // change player position
    player.position(data.x, data.y);
        
    // set our current action
    if (data.actions) player.setAction(data.actions[0]);
    
    // update player sprites
    player.update();
    
    // store player item
    this.entities.players[data.name] = player;
  },

  // removes entities that are no longer references in the game state
  clean: function () {
    this.cleanPlayers();
  },

  // removes players that are no longer references in the game state
  cleanPlayers: function () {
    Object.each(this.entities.players, function (player, name) {
      if (!this.gameState.players[name]) {
        this.entities.players[name].remove();
        delete this.entities.players[name];
      }
    }.bind(this));
  },
  
  getCurrentActions: function () {
    var actions = [];
    this.input.currentInput().each(function (input) {
      if (this.keys[input]) actions.push(this.keys[input]);
    }.bind(this));
    return actions.length ? actions : ['idle'];
  }
});