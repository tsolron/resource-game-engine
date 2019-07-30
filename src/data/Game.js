export default class Game {
  constructor() {
    this.common = null;
    this.triggers = null;
    this.resources = new Map();
    // [{name:'mass',quantity:'fun'}]
  }

  get gain() { return this._gain; }
  set funGain(fg) { this._funGain = fg; }

  recalculate(resPool) {

    //Math.evaluate(f);
    //return eval('let a = 3; console.log(eval("a * 2"));');
  }
}
