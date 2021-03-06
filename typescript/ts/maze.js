// ToDo
// 迷路が出来ていく過程
// 高速化・リファクタリング・TSに最適化
// クリックで出口までの経路表示 先に答えを用意しておく 入口から反対側の壁をランダムで辿って出口を設定するように
window.onload = function () { return new maze.Main(); };
var maze;
(function (maze) {
    var Main = (function () {
        function Main() {
            this.maze_cols = 50;
            this.maze_rows = 50;
            this.maze_unit = 10;
            this.maze_rooms = this.maze_cols * this.maze_rows;
            this.stage = new Stage("mazeCanvas");
            this.maze = new Array(this.maze_rooms);
            var px = 0, py = 0;
            for (var i = 0; i < this.maze_rooms; i++) {
                if (i % this.maze_cols == 0) {
                    px = 0;
                    py += this.maze_unit;
                }
                this.maze[i] = new Room(i, px, py, this.maze_unit, this.stage.ctx);
                px += this.maze_unit;
            }
            this.mazeBuild();
        }
        Main.prototype.mazeBuild = function () {
            // 入口と出口の作成
            // 入口は上か左かの2パターンを用意
            var rd = Math.floor(Math.random() * 2);
            switch (rd) {
                case 0:
                    // 入口は最上段の中から壊す
                    var rr = Math.floor(Math.random() * this.maze_rows);
                    if (this.maze[rr].direct[0]) {
                        this.maze[rr].direct[0] = 0;
                    }
                    break;
                case 1:
                    // 入口は最左段の中から壊す
                    var rr = Math.floor(Math.random() * this.maze_rows) * this.maze_rows;
                    if (this.maze[rr].direct[3]) {
                        this.maze[rr].direct[3] = 0;
                    }
                    break;
            }
            window.requestAnimationFrame(this.mazeBuilding.bind(this));
        };
        Main.prototype.mazeBuilding = function () {
            // 端以外の壁を壊す
            // ランダムな部屋のランダムな方角の壁を壊す
            var rd = Math.floor(Math.random() * 4);
            var rr = Math.floor(Math.random() * this.maze_rooms);
            // 壁があるか
            if (this.maze[rr].direct[rd]) {
                switch (rd) {
                    case 0:
                        // 最上段以外 上の列の下壁が存在するのでそれも壊す
                        if (rr > this.maze_rows) {
                            // すでに繋がっていないかどうか
                            if (this.maze[rr].idx != this.maze[rr - this.maze_rows].idx) {
                                // 繋がってなければ隣り合う壁と共に壊す
                                this.maze[rr].direct[0] = 0;
                                this.maze[rr - this.maze_rows].direct[2] = 0;
                                // 繋がった部屋を小さい方の値でクラスタリング
                                this.clustering(this.maze[rr].idx, this.maze[rr - this.maze_rows].idx);
                            }
                        }
                        break;
                    case 1:
                        // 最右段以外 右の列の左壁が存在するのでそれも壊す
                        if (rr % this.maze_rows != this.maze_rows - 1) {
                            // すでに繋がっていないかどうか
                            if (this.maze[rr].idx != this.maze[rr + 1].idx) {
                                // 繋がってなければ隣り合う壁と共に壊す
                                this.maze[rr].direct[1] = 0;
                                this.maze[rr + 1].direct[3] = 0;
                                // 繋がった部屋を小さい方の値でクラスタリング
                                this.clustering(this.maze[rr].idx, this.maze[rr + 1].idx);
                            }
                        }
                        break;
                    case 2:
                        // 最下段以外 下の列の上壁が存在するのでそれも壊す
                        if (rr < this.maze_rooms - this.maze_rows) {
                            // すでに繋がっていないかどうか
                            if (this.maze[rr].idx != this.maze[rr + this.maze_rows].idx) {
                                // 繋がってなければ隣り合う壁と共に壊す
                                this.maze[rr].direct[2] = 0;
                                this.maze[rr + this.maze_rows].direct[0] = 0;
                                // 繋がった部屋を小さい方の値でクラスタリング
                                this.clustering(this.maze[rr].idx, this.maze[rr + this.maze_rows].idx);
                            }
                        }
                        break;
                    case 3:
                        // 最左段以外 左の列の右壁が存在するのでそれも壊す
                        if (rr > 0 && rr % this.maze_rows != 0) {
                            // すでに繋がっていないかどうか
                            if (this.maze[rr].idx != this.maze[rr - 1].idx) {
                                // 繋がってなければ隣り合う壁と共に壊す
                                this.maze[rr].direct[3] = 0;
                                this.maze[rr - 1].direct[1] = 0;
                                // 繋がった部屋を小さい方の値でクラスタリング
                                this.clustering(this.maze[rr].idx, this.maze[rr - 1].idx);
                            }
                        }
                        break;
                }
            }
            // 再描写
            this.stage.ctx.clearRect(0, 0, 510, 510);
            for (var i = 0; i < this.maze_rooms; i++) {
                this.maze[i].buildRoom();
            }
            window.requestAnimationFrame(this.mazeBuilding.bind(this));
        };
        Main.prototype.clustering = function (val1, val2) {
            var idx_min = Math.min(val1, val2);
            for (var i = 0; i < this.maze_rooms; i++) {
                if (this.maze[i].idx == val1 || this.maze[i].idx == val2) {
                    this.maze[i].idx = idx_min;
                }
            }
        };
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
            // this.ctx.fillText(this.idx, this.px, this.py);
            // this.ctx.fillStyle = "rgb("+ this.idx +","+ this.idx +","+ this.idx +")";
            // this.ctx.fillRect(this.px, this.py, this.unit, this.unit);
            this.ctx.strokeStyle = "rgb(0, 0, 0)";
            this.ctx.stroke();
        };
        return Room;
    })();
    maze.Room = Room;
})(maze || (maze = {}));
