window.onload = function () { return new maze.Main(); };
var maze;
(function (maze) {
    var Main = (function () {
        function Main() {
            this.maze_cols = 5;
            this.maze_rows = 5;
            this.maze_unit = 50;
            this.maze_rooms = this.maze_cols * this.maze_rows;
            this.stage = new Stage("mazeCanvas");
            this.maze = new Array(this.maze_rooms);
            var px = 0, py = 0;
            for (var i = 0; i < this.maze_rooms; i++) {
                if (i % this.maze_cols === 0) {
                    px = 0;
                    py += this.maze_unit;
                }
                this.maze[i] = new Room(i, px, py, this.maze_unit, this.stage.ctx);
                this.maze[i].buildRoom();
                px += this.maze_unit;
            }
            for (var tmp = 0; tmp < 5; tmp++) {
                // var maze_building = setInterval(function(){
                // ランダムな部屋のランダムな方角の壁を壊す
                var rd = Math.floor(Math.random() * 4);
                var rr = Math.floor(Math.random() * this.maze_rooms);
                console.log(rr, rd);
                // 壁があるか
                if (this.maze[rr].direct[rd]) {
                    // あったら壊す
                    this.maze[rr].direct[rd] = 0;
                    switch (rd) {
                        case 0:
                            // 最上段でなければ上の列の下壁が存在するのでそれも壊す
                            if (rr > this.maze_rows) {
                                // すでに繋がっていないかどうか
                                if (this.maze[rr].idx != this.maze[rr - this.maze_rows].idx) {
                                    this.maze[rr - this.maze_rows].direct[2] = 0;
                                    // 繋がった部屋を小さい方の値でクラスタリング
                                    var idx_min = Math.min(this.maze[rr].idx, this.maze[rr - this.maze_rows].idx);
                                    for (var i = 0; i < this.maze_rooms; i++) {
                                        if (i != rr) {
                                            if (this.maze[i].idx == this.maze[rr].idx || this.maze[i].idx == this.maze[rr - this.maze_rows].idx) {
                                                this.maze[i].idx = idx_min;
                                            }
                                        }
                                    }
                                    this.maze[rr].idx = this.maze[rr - this.maze_rows].idx = idx_min;
                                }
                                else {
                                    // すでに繋がってたら壊すのをやめる
                                    this.maze[rr].direct[0] = 1;
                                }
                            }
                            break;
                        case 1:
                            // 最右段でなければ右の列の左壁が存在するのでそれも壊す
                            if (rr % this.maze_rows != this.maze_rows - 1) {
                                // すでに繋がっていないかどうか
                                if (this.maze[rr].idx != this.maze[rr + 1].idx) {
                                    this.maze[rr + 1].direct[3] = 0;
                                    // 繋がった部屋を小さい方の値でクラスタリング
                                    var idx_min = Math.min(this.maze[rr].idx, this.maze[rr + 1].idx);
                                    for (var i = 0; i < this.maze_rooms; i++) {
                                        if (i != rr) {
                                            if (this.maze[i].idx == this.maze[rr].idx || this.maze[i].idx == this.maze[rr + 1].idx) {
                                                this.maze[i].idx = idx_min;
                                            }
                                        }
                                    }
                                    this.maze[rr].idx = this.maze[rr + 1].idx = idx_min;
                                }
                                else {
                                    // すでに繋がってたら壊すのをやめる
                                    this.maze[rr].direct[1] = 1;
                                }
                            }
                            break;
                        case 2:
                            // 最下段でなければ下の列の上壁が存在するのでそれも壊す
                            if (rr < this.maze_rooms - this.maze_rows) {
                                // すでに繋がっていないかどうか
                                if (this.maze[rr].idx != this.maze[rr + this.maze_rows].idx) {
                                    this.maze[rr + this.maze_rows].direct[0] = 0;
                                    // 繋がった部屋を小さい方の値でクラスタリング
                                    var idx_min = Math.min(this.maze[rr].idx, this.maze[rr + this.maze_rows].idx);
                                    for (var i = 0; i < this.maze_rooms; i++) {
                                        if (i != rr) {
                                            if (this.maze[i].idx == this.maze[rr].idx || this.maze[i].idx == this.maze[rr + this.maze_rows]) {
                                                this.maze[i].idx = idx_min;
                                            }
                                        }
                                    }
                                    this.maze[rr].idx = this.maze[rr + this.maze_rows].idx = idx_min;
                                }
                                else {
                                    // すでに繋がってたら壊すのをやめる
                                    this.maze[rr].direct[2] = 1;
                                }
                            }
                            break;
                        case 3:
                            // 最左段でなければ左の列の右壁が存在するのでそれも壊す
                            if (rr > 0 && rr % this.maze_rows != 0) {
                                // すでに繋がっていないかどうか
                                if (this.maze[rr].idx != this.maze[rr - 1].idx) {
                                    this.maze[rr - 1].direct[1] = 0;
                                    // 繋がった部屋を小さい方の値でクラスタリング
                                    var idx_min = Math.min(this.maze[rr].idx, this.maze[rr - 1].idx);
                                    for (var i = 0; i < this.maze_rooms; i++) {
                                        if (i != rr) {
                                            if (this.maze[i].idx == this.maze[rr].idx || this.maze[i].idx == this.maze[rr - 1].idx) {
                                                this.maze[i].idx = idx_min;
                                            }
                                        }
                                    }
                                    this.maze[rr].idx = this.maze[rr - 1].idx = idx_min;
                                }
                                else {
                                    // すでに繋がってたら壊すのをやめる
                                    this.maze[rr].direct[3] = 1;
                                }
                            }
                            break;
                    }
                }
                // 再描写
                this.stage.ctx.clearRect(0, 0, 4000, 4000);
                for (var i = 0; i < this.maze_rooms; i++) {
                    this.maze[i].buildRoom();
                }
            }
        }
        return Main;
    })();
    maze.Main = Main;
    var Stage = (function () {
        function Stage(canvasId) {
            this.stage = document.getElementById(canvasId);
            this.ctx = this.stage.getContext("2d");
        }
        return Stage;
    })();
    maze.Stage = Stage;
    var Room = (function () {
        function Room(idx, px, py, unit, ctx) {
            this.px = px;
            this.py = py;
            this.ctx = ctx;
            this.idx = idx;
            this.unit = unit;
            this.direct = [1, 1, 1, 1];
        }
        Room.prototype.buildRoom = function () {
            this.ctx.beginPath();
            // top
            if (this.direct[0]) {
                this.ctx.moveTo(this.px, this.py);
                this.ctx.lineTo(this.px + this.unit, this.py);
            }
            // right
            if (this.direct[1]) {
                this.ctx.moveTo(this.px + this.unit, this.py);
                this.ctx.lineTo(this.px + this.unit, this.py + this.unit);
            }
            // bottom
            if (this.direct[2]) {
                this.ctx.moveTo(this.px + this.unit, this.py + this.unit);
                this.ctx.lineTo(this.px, this.py + this.unit);
            }
            // left
            if (this.direct[3]) {
                this.ctx.moveTo(this.px, this.py + this.unit);
                this.ctx.lineTo(this.px, this.py);
            }
            this.ctx.fillText(this.idx, this.px, this.py);
            this.ctx.stroke();
        };
        return Room;
    })();
    maze.Room = Room;
})(maze || (maze = {}));
