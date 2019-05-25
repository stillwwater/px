px.create('player', function (x, y) {
  this.x = x;
  this.y = y;
  this.dir = new Vector2(0, 0);
  this.color = 'cyan';
  this.palette = ['black', '#f0ccc2', '#80c6df'];
  this.spriteSize = 8; // Default sprite size is 8x8

  this.spriteR = '........'
               + '..0000..'
               + '..1212..'
               + '..1111..'
               + '.000000.'
               + '.100001.'
               + '..0000..'
               + '..0..0..';

  this.spriteL = '........'
               + '..0000..'
               + '..2121..'
               + '..1111..'
               + '.000000.'
               + '.100001.'
               + '..0000..'
               + '..0..0..';

  this.sprite = this.spriteR;

  this.keypress = function (e) {
    switch (e.key) {
      case 'ArrowLeft':
        this.dir = new Vector2(-1, 0);
        this.sprite = this.spriteL;
        px.move(this, this.x - 1, this.y);
        break;
      case 'ArrowRight':
        this.dir = new Vector2(1, 0);
        this.sprite = this.spriteR;
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

  this.draw = function () {
    this.palette[0] = this.color;
    // We need to call drawSprite our selves since
    // we are replacing the draw function.
    px.drawSprite(this);
  }
});
