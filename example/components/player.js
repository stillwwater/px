px.create('player', function (x, y) {
  this.x = x;
  this.y = y;
  this.color = 'cyan';
  this.dir = new Vector2(0, 0);

  this.keypress = function (e) {
    switch (e.key) {
      case 'ArrowLeft':
        this.dir = new Vector2(-1, 0);
        px.move(this, this.x - 1, this.y);
        break;
      case 'ArrowRight':
        this.dir = new Vector2(1, 0);
        px.move(this, this.x + 1, this.y);
        break;
      case 'ArrowUp':
        this.dir = new Vector2(0, -1);
        px.move(this, this.x, this.y - 1);
        break;
      case 'ArrowDown':
        this.dir = new Vector2(0, 1);
        px.move(this, this.x, this.y + 1);
        break;
    }
  };

  this.collide = function (entity) {
    switch (entity.type) {
      case 'box':
        return px.move(entity, entity.x + this.dir.x, entity.y + this.dir.y);
      case 'wall': return false;
      case 'goal': return true;
      case 'player': return true;
    }
    return false;
  };
});
