function MazeBuilder(width, height) {
  const self = this
  self.width = width;
  self.height = height;

  self.cols = 2 * self.width + 1;
  self.rows = 2 * self.height + 1;

  self.maze = self.initArray([]);
  self.mazee = self.initArray(0);
  self.maze.forEach(function (row, r) {
    row.forEach(function (cell, c) {
      switch (r) {
        case 0:
        case self.rows - 1:
          self.maze[r][c] = ["wall"];
          self.mazee[r][c] = 1;
          break;

        default:
          if (r % 2 == 1) {
            if (c == 0 || c == self.cols - 1) {
              self.maze[r][c] = ["wall"];
              self.mazee[r][c] = 1;
            }
          } else if (c % 2 == 0) {
            self.maze[r][c] = ["wall"];
            self.mazee[r][c] = 1;
          }
      }
    });

    if (r == 0) {
      let doorPos = self.posToSpace(self.rand(1, self.width));
      self.maze[r][doorPos] = ["door", "exit"];
      self.mazee[r][doorPos] = 0;
    }

    if (r == self.rows - 1) {
      let doorPos = self.posToSpace(self.rand(1, self.width));
      self.maze[r][doorPos] = ["door", "entrance"];
      self.mazee[r][doorPos] = 0;
    }
  });

  self.partition(1, self.height - 1, 1, self.width - 1);
}

MazeBuilder.prototype.initArray = function (value) {
  const self = this
  return new Array(self.rows).fill().map(() => new Array(self.cols).fill(value));
};

MazeBuilder.prototype.rand = function (min, max) {
  return min + Math.floor(Math.random() * (1 + max - min));
};

MazeBuilder.prototype.posToSpace = function (x) {
  return 2 * (x - 1) + 1;
};

MazeBuilder.prototype.posToWall = function (x) {
  return 2 * x;
};

MazeBuilder.prototype.inBounds = function (r, c) {
  const self = this
  if (
    typeof self.maze[r] == "undefined" ||
    typeof self.maze[r][c] == "undefined"
  ) {
    return false;
  }
  return true;
};

MazeBuilder.prototype.shuffle = function (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

MazeBuilder.prototype.partition = function (r1, r2, c1, c2) {
  const self = this
  let horiz, vert, x, y, start, end;

  if (r2 < r1 || c2 < c1) {
    return false;
  }

  if (r1 == r2) {
    horiz = r1;
  } else {
    x = r1 + 1;
    y = r2 - 1;
    start = Math.round(x + (y - x) / 4);
    end = Math.round(x + (3 * (y - x)) / 4);
    horiz = self.rand(start, end);
  }

  if (c1 == c2) {
    vert = c1;
  } else {
    x = c1 + 1;
    y = c2 - 1;
    start = Math.round(x + (y - x) / 3);
    end = Math.round(x + (2 * (y - x)) / 3);
    vert = self.rand(start, end);
  }

  for (let i = self.posToWall(r1) - 1; i <= self.posToWall(r2) + 1; i++) {
    for (let j = self.posToWall(c1) - 1; j <= self.posToWall(c2) + 1; j++) {
      if (i == self.posToWall(horiz) || j == self.posToWall(vert)) {
        self.maze[i][j] = ["wall"];
        self.mazee[i][j] = 1;
      }
    }
  }

  let gaps = self.shuffle([true, true, true, false]);

  if (gaps[0]) {
    let gapPosition = self.rand(c1, vert);
    self.maze[self.posToWall(horiz)][self.posToSpace(gapPosition)] = [];
    self.mazee[self.posToWall(horiz)][self.posToSpace(gapPosition)] = 0;
  }

  if (gaps[1]) {
    let gapPosition = self.rand(vert + 1, c2 + 1);
    self.maze[self.posToWall(horiz)][self.posToSpace(gapPosition)] = [];
    self.mazee[self.posToWall(horiz)][self.posToSpace(gapPosition)] = 0;
  }

  if (gaps[2]) {
    let gapPosition = self.rand(r1, horiz);
    self.maze[self.posToSpace(gapPosition)][self.posToWall(vert)] = [];
    self.mazee[self.posToSpace(gapPosition)][self.posToWall(vert)] = 0;
  }

  if (gaps[3]) {
    let gapPosition = self.rand(horiz + 1, r2 + 1);
    self.maze[self.posToSpace(gapPosition)][self.posToWall(vert)] = [];
    self.mazee[self.posToSpace(gapPosition)][self.posToWall(vert)] = 0;
  }

  self.partition(r1, horiz - 1, c1, vert - 1);
  self.partition(horiz + 1, r2, c1, vert - 1);
  self.partition(r1, horiz - 1, vert + 1, c2);
  self.partition(horiz + 1, r2, vert + 1, c2);
};

MazeBuilder.prototype.isGap = function () {
  const self = this
  let cells = Array.prototype.slice.call(arguments);
  return cells.every(
    function (array) {
      let row, col;
      [row, col] = array;
      if (self.maze[row][col].length > 0) {
        if (!self.maze[row][col].includes("door")) {
          return false;
        }
      }
      return true;
    }.bind(self)
  );
};

MazeBuilder.prototype.countSteps = function (array, r, c, val, stop) {
  const self = this
  if (!self.inBounds(r, c)) {
    return false;
  }

  if (array[r][c] <= val) {
    return false;
  }

  if (!self.isGap([r, c])) {
    return false;
  }

  array[r][c] = val;

  if (self.maze[r][c].includes(stop)) {
    return true;
  }

  self.countSteps(array, r - 1, c, val + 1, stop);
  self.countSteps(array, r, c + 1, val + 1, stop);
  self.countSteps(array, r + 1, c, val + 1, stop);
  self.countSteps(array, r, c - 1, val + 1, stop);
};

MazeBuilder.prototype.getKeyLocation = function () {
  const self = this
  let fromEntrance = self.initArray();
  let fromExit = self.initArray();

  self.totalSteps = -1;

  for (let j = 1; j < self.cols - 1; j++) {
    if (self.maze[self.rows - 1][j].includes("entrance")) {
      self.countSteps(fromEntrance, self.rows - 1, j, 0, "exit");
    }
    if (self.maze[0][j].includes("exit")) {
      self.countSteps(fromExit, 0, j, 0, "entrance");
    }
  }

  let fc = -1,
    fr = -1;

  self.maze.forEach(function (row, r) {
    row.forEach(function (cell, c) {
      if (typeof fromEntrance[r][c] == "undefined") {
        return;
      }
      let stepCount = fromEntrance[r][c] + fromExit[r][c];
      if (stepCount > self.totalSteps) {
        fr = r;
        fc = c;
        self.totalSteps = stepCount;
      }
    }, self);
  }, self);

  return [fr, fc];
};

MazeBuilder.prototype.placeKey = function () {
  const self = this
  let fr, fc;
  [fr, fc] = self.getKeyLocation();

  self.maze[fr][fc] = ["key"];
};

MazeBuilder.prototype.display = function (id) {
  const self = this
  self.parentDiv = document.getElementById(id);

  if (!self.parentDiv) {
    alert('Cannot initialize maze - no element found with id "' + id + '"');
    return false;
  }

  while (self.parentDiv.firstChild) {
    self.parentDiv.removeChild(self.parentDiv.firstChild);
  }

  const container = document.createElement("div");
  container.id = "maze";
  container.dataset.steps = self.totalSteps;

  self.maze.forEach(function (row) {
    let rowDiv = document.createElement("div");
    row.forEach(function (cell) {
      let cellDiv = document.createElement("div");
      if (cell) {
        cellDiv.className = cell.join(" ");
      }
      rowDiv.appendChild(cellDiv);
    });
    container.appendChild(rowDiv);
  });

  self.parentDiv.appendChild(container);

  return true;
};

module.exports = MazeBuilder;
