var Loki = Loki || {};

Loki.Input = new Class({
  
  Implements: [Options],
  
  options: {
    
  },
  
  scene: null,
  inputs: [],
  
  initialize: function (scene, options) {
    this.scene = scene;
    this.setOptions(options);
    
    this.$addEventListeners();
  },
  
  // returns all current user input
  currentInput: function () {
    return this.inputs;
  },
  
  $addEventListeners: function () {
    document.addEvents({
      keydown: function (ev) {
        this.$addInput(ev.key);
      }.bind(this),
      keyup: function (ev) {
        this.$removeInput(ev.key);
      }.bind(this)
    });
  },
  
  $addInput: function (input) {
    if (!this.inputs.contains(input)) this.inputs.push(input);
  },
  
  $removeInput: function (input) {
    this.inputs.each(function (value, index) {
      if (input == value) delete this.inputs[index];
    }.bind(this));
    this.inputs.clean();
  }
});