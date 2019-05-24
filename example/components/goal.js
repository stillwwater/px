px.create('goal', function (x, y) {
  this.x = x;
  this.y = y;
  this.width = 0.5;
  this.height = 0.5;
  this.color = 'pink';

  this.collide = function (entity) {
    return true;
  }
})
