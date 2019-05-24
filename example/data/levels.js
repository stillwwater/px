var levels = {
  currentIndex: -1,

  next: function () {
    return this.data[++this.currentIndex];
  },

  current: function () {
    return this.data[this.currentIndex];
  },

  data: [
    {
      'width': 9,
      'height': 3,
      'background': '#022c43',
      'palette': ['#fcf594', '#fdbfb3', '#107595', '#fcf594'],
      'types': ['player', 'box', 'wall', 'goal'],
      'map': '222222222'
           + '20..1..32'
           + '222222222'
    },
    {
      'width': 8,
      'height': 10,
      'background': '#022c43',
      'palette': ['#fcf594', '#fdbfb3', '#107595', '#fcf594'],
      'types': ['player', 'box', 'wall', 'goal'],
      'map': '22222222'
           + '2....222'
           + '201..222'
           + '2222.222'
           + '22...222'
           + '22....22'
           + '2..223.2'
           + '2......2'
           + '22222..2'
           + '22222222'
    },
    {
      'width': 8,
      'height': 7,
      'background': '#240041',
      'palette': ['#ff4057', '#ff8260', '#182952', '#900048'],
      'types': ['player', 'box', 'wall', 'goal'],
      'map': '22222222'
           + '2......2'
           + '2..1..32'
           + '20.1..32'
           + '2..1..32'
           + '2......2'
           + '22222222'
    },
    {
      'width': 8,
      'height': 7,
      'background': '#240041',
      'palette': ['#ff4057', '#ff8260', '#182952', '#900048'],
      'types': ['player', 'box', 'wall', 'goal'],
      'map': '22222222'
           + '2..23..2'
           + '2.12...2'
           + '2..2.022'
           + '2..2.122'
           + '2....322'
           + '22222222'
    }, 
    {
      'width': 9,
      'height': 6,
      'background': '#323232',
      'palette': ['#ff0b55', '#ffdee6', '#393e46', '#ff0b55'],
      'types': ['player', 'box', 'wall', 'goal'],
      'map': '222222222'
           + '22..2...2'
           + '2313..1.2'
           + '2.2..22.2'
           + '2.01313.2'
           + '222222222'
    },
    {
      'width': 9,
      'height': 6,
      'background': '#323232',
      'palette': ['#ff0b55', '#ffdee6', '#393e46', '#ff0b55'],
      'types': ['player', 'box', 'wall', 'goal'],
      'map': '222222222'
           + '2..2...32'
           + '201.1...2'
           + '2.1.22332'
           + '2...22222'
           + '222222222'
    },
    {
      'width': 0,
      'height': 0,
      'background': '#222227',
      'onload': function () {
        let h1 = document.createElement('h1');
        let text = document.createTextNode('Nice!');
        h1.style = 'color:white';
        h1.appendChild(text);
        document.body.appendChild(h1);
      }
    }
  ]
};
