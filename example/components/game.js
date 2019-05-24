px.create('_game', function (x, y) {
  this.x = x;
  this.y = y;
  this.static = true;
  this.goals = [];
  this.boxes = [];
  this.win = false;

  this.init = function () {
    this.goals = []
    this.boxes = [];

    for (let i = 0; i < px.map.length; i++) {
      for (let j = 0; j < px.map[i].length; j++) {
        let entity = px.map[i][j];
        if (entity) {
          if (entity.type === 'box') {
            this.boxes.push(entity);
        } else if (entity.type === 'goal') {
            this.goals.push(entity);
          }
        }
      }
    }
    this.win = false;
  };

  this.mouseclick = function (e) {
    this.init();
  };

  this.keypress = function (e) {
    if (e.key === 'r') {
      px.load(levels.current());
      this.init();
    }
  }

  this.update = function () {
    if (this.win || this.goals.length === 0 || this.boxes.length === 0) {
      return;
    }
    let count = 0;

    for (let i = 0; i < this.boxes.length; i++) {
      for (let j = 0; j < this.goals.length; j++) {
        let box = this.boxes[i];
        let goal = this.goals[j];
        if (box.x === goal.x && box.y === goal.y) {
          count++;
        }
      }
    }
    if (count >= this.goals.length) {
      this.win = true;
      px.background = this.goals[0].color;
      px.draw();
      setTimeout(() => {
        let level = levels.next();
        if (level) {
          px.load(level);
          this.win = false;
          this.init();
        }
      }, 1000);
    }
  };
});
