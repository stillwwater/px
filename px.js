/**
 * Px - tiny puzzle game framework
 * by Stillwwater
 * license MIT
 *
 *
 * Example:
 *   px.create('player', function (x, y) {
 *     this.x = x;
 *     this.y = y;
 *     this.color = 'pink';
 *
 *     this.keypress = function (e) {
 *       console.log('hello');
 *     }
 *   });
 *
 *   window.onload = function () {
 *     px.init(5, 5, 48);
 *     px.spawn('player', 2, 2);
 *     px.draw();
 *   }
 *
 *
 * px events:
 *  All events are optional and only get called if a px type defines it.
 *
 *  - collide(entity): Collided with another entity
 *    return true if the entity can move through
 *    return false to block the entity from moving
 *
 *  - init(): Celled after the entity is spawned
 *  - update(): Called before the entity is drawn in px.draw()
 *  - draw(): Called during draw instead of drawing a rect for the entity.
 *
 *  - mouseup(event)
 *  - mousedown(event)
 *  - mouseclick(event)
 *  - leftclick(event)
 *  - rightclick(event):
 *    Called on mouse events, regardless if the mouse
 *    is over the entity or not.
 *
 *    Example:
 *      mouseclick(e) {
 *        let pos = px.mapCoordinate(e.posX, e.posY);
 *        if (pos.compare(new Vector2(this.x, this.y))) {
 *          console.log(`mouse click on ${this.type}`);
 *        }
 *      }
 *
 *  - keypress(e)
 *  - keydown(e)
 *  - keyup(e)
 *
 *
 * Since you're looking through the source code here's the terminology used:
 *
 * Entity:
 *  - Object spawned using px.spawn, to spawn an entity you must first
 *    create a constructor for it using px.create('name', constructor);
 *  - Entities that persist through levels and are ignored in collision checks
 *    are marked by setting static to true in their constructor and prefixing
 *    their type name with '_'. These entities should be spawned at (0, 0)
 *  - Entities that don't define a color in their constructor are not rendered
 *    but still exist in the map.
 *
 * Cell:
 *  - A collection of entities that occupy that same position in the map.
 *  - Entities in cells are rendered in order, so the last entity in a cell
 *    will be rendered over previous entities.
 *
 * Map:
 *  - A collection of cells, all game entities are referenced in the map.
 */

var px = {
  map: [],
  types: {},
  width: 10,
  height: 10,
  rect: {},
  scale: 64,
  uniqueId: 0,
  background: '#000',
  keyboard: {},
  mouse: {},

  /**
   * Initialize px instance.
   * @param {number} width Width in units
   * @param {number} height Height in units
   * @param {number} scale How many pixels per grid square (unit)
   * @param {*} canvas (optional)
   */
  init: function (width, height, scale, canvas) {
    if (!canvas) {
      canvas = document.createElement('canvas');
      document.body.appendChild(canvas);
    }

    canvas.oncontextmenu = function () { return false; };
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.ctx = canvas.getContext('2d');

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.map[x + y * this.width] = [];
      }
    }

    canvas.width = width * scale;
    canvas.height = height * scale;
    this.rect = canvas.getBoundingClientRect();
    return this;
  },

  draw: function () {
    const ctx = this.ctx;
    ctx.fillStyle = this.background;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < this.map.length; i++) {
      for (let j = 0; j < this.map[i].length; j++) {
        let entity = this.map[i][j];
        if (!entity) continue;
        if (entity.update) entity.update();

        if (!entity.color) {
          continue;
        }
        ctx.fillStyle = entity.color;

        if (entity.draw) {
          entity.draw(ctx);
          continue;
        }

        let w = entity.width * this.scale,
            h = entity.height * this.scale;

        ctx.fillRect(
          entity.x * this.scale + w * (1 - entity.width),
          entity.y * this.scale + h * (1 - entity.height),
          entity.width * this.scale,
          entity.height * this.scale
        );
      }
    }
    return this;
  },

  /**
   * Register an entity prototype
   */
  create: function (type, proto) {
    this.types[type] = proto;
  },

  /*
   * Map
   */

  /**
   * Spawn entity at x, y position.
   */
  spawn: function (type, x, y) {
    let entity = new this.types[type](x, y);
    entity.type = type;
    entity.id = this.uniqueId++;

    if (!entity.width) entity.width = 1;
    if (!entity.height) entity.height = 1;

    this.push(entity);
    if (entity.init) {
      entity.init();
    }
    return entity;
  },

  /**
   * Move entity to an x, y position and send out
   * any collision events.
   * @returns {boolean} Was the move successful (true)
   *  or blocked by a collision (false).
   */
  move: function (entity, x, y) {
    if (!this.boundsCheck(x, y)) {
      return false;
    }

    let cell = this.cellAt(x, y);
    let _x = entity.x;
    let _y = entity.y;
    let canMove = true;

    this.pop(entity);
    entity.x = x;
    entity.y = y;
    cell.push(entity);

    for (let i = 0; i < cell.length; i++) {
      for (let j = 0; j < cell.length; j++) {
        if (i !== j && cell[i].collide) {
          if (cell[i].static || cell[j].static) {
            continue;
          }
          if (!cell[i].collide(cell[j])) {
            canMove = false;
          }
        }
      }
    }

    if (!canMove) {
      this.pop(entity);
      entity.x = _x;
      entity.y = _y;
      this.push(entity);
    }
    return canMove;
  },

  /**
   * Remove an entity from the map
   */
  pop: function (entity) {
    let cell = this.cellAt(entity.x, entity.y);
    let rem = cell.filter(function (val, idx, arr) {
      return val.id !== entity.id;
    });
    this.map[entity.x + entity.y * this.width] = rem;
    return entity;
  },

  /**
   * Add an entity to the map on a new cell layer.
   */
  push: function (entity) {
    this.map[entity.x + entity.y * this.width].push(entity);
    return entity;
  },

  /**
   * Clear all cells except for empty (static)
   * entities at cell #0
   */
  clear: function () {
    if (this.map.length === 0) return;
    let statics = this.map[0].filter(entity => {
      return entity.static === true;
    });
    this.map = [statics];
    return statics;
  },

  /**
   * Get cell (collection of entities)
   * at x, y position.
   */
  cellAt: function (x, y) {
    return this.map[x + y * this.width];
  },

  /**
   * Get entity from the top layer of a cell.
   * Returns null if the cell is empty.
   */
  entityAt: function (x, y) {
    let cell = this.cellAt(x, y);
    if (cell && cell.length > 0) {
      return cell[cell.length - 1];
    }
    return null;
  },

  boundsCheck: function (x, y) {
    return (x >= 0 && y >= 0 && x < this.width && y < this.height);
  },

  /**
   * Map screen pixel coordinates to
   * scaled map coordinates.
   * @returns {Vector2}
   */
  mapCoordinate: function (x, y) {
    let _x = Math.floor(x / this.scale);
    let _y = Math.floor(y / this.scale);

    if (!this.boundsCheck(_x, _y)) {
      return null;
    }

    return new Vector2(_x, _y);
  },

  /**
   * Serialize map to json string.
   * Only serializes the top layer of each cell.
   */
  serialize: function () {
    let level = {
      width: this.width,
      height: this.height,
      background: this.background,
      palette: [],
      types: Object.keys(this.types).filter(t => {
        return !t.static && t[0] !== '_';
      }),
      map: ''
    }

    for (let i = 0; i < this.map.length; i++) {
      let cell = this.map[i];
      if (!cell || cell.length === 0) {
        level.map += '.';
        continue;
      }
      // Use entity at the top of cell, other layers
      // are only used in collision checking.
      let entity = cell[cell.length - 1];
      if (!entity || entity.static) {
        level.map += '.';
        continue
      }
      let typeidx = level.types.indexOf(entity.type);
      level.palette[typeidx] = entity.color;
      level.map += typeidx;
    }
    return JSON.stringify(level, null, 2);
  },

  /**
   * Load level from javascript object
   */
  load: function (level) {
    let statics = this.clear();
    this.init(level.width, level.height, this.scale, this.ctx.canvas);
    this.map[0] = statics;
    this.background = level.background;

    for (let x = 0; x < level.width; x++) {
      for (let y = 0; y < level.height; y++) {
        let code = level.map[x + y * level.width];
        if (code === '.') continue;
        this.spawn(level.types[Number(code)], x, y)
          .color = level.palette[Number(code)];
      }
    }
    if (level.onload) level.onload();
    this.draw();
  },

  /*
   * Events
   */

  pushEvent: function (event, args) {
    let sent = [];

    for (let i = 0; i < this.map.length; i++) {
      let cell = this.map[i];
      for (let j = 0; j < cell.length; j++) {
        let entity = cell[j];
        if (entity && entity[event] && !sent.includes(entity.id)) {
          entity[event](args);
          sent.push(entity.id);
        }
      }
    }
    if (sent.length > 0) {
      this.draw();
    }
  },

  keypress: function (e) {
    if (this.keyboard[e.keyCode]) return;
    this.keyboard[e.keyCode] = true;
    this.pushEvent('keypress', e);
  },

  keydown: function (e) {
    if (e.keyCode === 32 || (e.keyCode >= 37 && e.keyCode <= 40)) {
      e.preventDefault();
    }
    this.keypress(e);
    this.pushEvent('keydown', e);
  },

  keyup: function (e) {
    this.keyboard[e.keyCode] = false;
    this.pushEvent('keyup', e);
  },

  mouseclick: function (e) {
    if (this.mouse[e.button]) return;
    this.buttonclick(e, 0, 'leftclick');
    this.buttonclick(e, 2, 'rightclick');
    this.pushEvent('mouseclick', e);
  },

  buttonclick: function (e, button, name) {
    if (e.button !== button || this.mouse[e.button]) {
      return;
    }
    this.mouse[e.button] = true;
    this.pushEvent(name, e);
  },

  mousedown: function (e) {
    e.posX = e.clientX - this.rect.left;
    e.posY = e.clientY - this.rect.top;
    this.mouseclick(e);
    this.pushEvent('mousedown', e);
  },

  mouseup: function (e) {
    e.posX = e.clientX - this.rect.left;
    e.posY = e.clientY - this.rect.top;
    this.mouse[e.button] = false;
    this.pushEvent('mouseup');
  },

  /*
   * Math
   */

  random: function (min, max) {
    return Math.random() * (max - min + 1) + min;
  },

  randint: function (min, max) {
    return Math.floor(this.random(min, max));
  },
};

var Vector2 = function (x, y) {
  this.x = x;
  this.y = y;

  this.compare = function (vec2) {
    return this.x === vec2.x && this.y === vec2.y;
  };
};

document.addEventListener('keyup', e => {
  px.keyup(e);
}, false);

document.addEventListener('keydown', e => {
  px.keydown(e);
}, false);

document.addEventListener('mousedown', e => {
  px.mousedown(e);
});

document.addEventListener('mousedown', e => {
  px.mouseup(e);
});

/**
 * Simple level editor that toggles between
 * game types when the mouse is clicked.
 *
 * leftclick: toggle between game types
 * rightclick: copy entity (paste with left click)
 * s: serialize level (json)
 *
 * Create instance using px.spawn('_editor', 0, 0);
 */
px.create('_editor', function (x, y) {
  this.static = true;
  this.x = 0;
  this.y = 0;

  this.types = null;
  this.selected = 0;
  this.prev = null;

  this.init = function () {
    this.types = Object.keys(px.types).filter(t => {
      return t[0] !== '_';
    });
  }

  this.leftclick = function (e) {
    let pos = px.mapCoordinate(e.posX, e.posY);
    if (!pos) return;
    let entity = px.entityAt(pos.x, pos.y);

    if (entity && !entity.static) {
      if (entity.type === this.prev) {
        this.selected++;
        if (this.selected >= this.types.length) {
          this.selected = -1;
        }
      }
      px.pop(entity);
    } else if (this.selected === -1) {
      this.selected = 0;
    }

    if (this.selected >= 0) {
      this.prev = this.types[this.selected];
      px.spawn(this.prev, pos.x, pos.y);
    }
  };

  this.rightclick = function (e) {
    let pos = px.mapCoordinate(e.posX, e.posY);
    if (!pos) return;
    let entity = px.entityAt(pos.x, pos.y);

    if (entity && this.types) {
      let index = this.types.indexOf(entity.type);
      if (index >= 0) {
        this.selected = index;
      }
    }
  }

  this.mouseclick = function (e) {
    if (e.button !== 1) return; // Middle click
    let pos = px.mapCoordinate(e.posX, e.posY);
    if (!pos) return;
    let entity = px.entityAt(pos.x, pos.y);

    if (entity) {
      px.pop(entity);
    }
  }

  this.keypress = function (e) {
    if (e.key !== 's') return;
    let text = document.getElementById('save-box');

    if (!text) {
      text = document.createElement('textarea');
      text.id = 'save-box';
      text.style = `width:${px.ctx.canvas.width}px;
                    height:${px.ctx.canvas.height}px;`;
      document.body.appendChild(text);
    }
    text.value = px.serialize();
  }
});

window.px = px;
