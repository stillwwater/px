window.onload = function () {
  // Setup canvas
  let canvas = document.getElementById('canvas');
  // Passing the canvas is not required if you
  // want px to create the canvas instead.
  px.init(8, 8, 48, canvas);
  
  // Create static game entities
  let game = px.spawn('_game', 0, 0);
  px.spawn('_editor', 0, 0);

  // Load first level
  px.load(levels.next());
  game.init();
  px.draw();
};
