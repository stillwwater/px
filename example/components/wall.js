px.create('wall', function (x, y) {
  this.x = x;
  this.y = y;
  this.color = 'grey';

  this.collide = function (entity) {
    return false;
  }
});
