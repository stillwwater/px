px.create('box', function (x, y) {
  this.x = x;
  this.y = y;
  this.color = 'brown';

  this.collide = function (entity) {
    return entity.type === 'player'
      || entity.type === 'goal';
  }
});
