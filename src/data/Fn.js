/**
 * TODO functions
 * @type {class}
 * @property {string} f
 * @property {Number} n
 */
export default class Fn {
  constructor() {
    this._f = null;
    this.n = 1;
  }

  get f() { return this._f; }
  set f(f) { this._f = f; }

  recalculate(game) {
    let result = eval(this.f);
    this.n = result;
    //Math.evaluate(f);
    //return eval('let a = 3; console.log(eval("a * 2"));');
  }
};

/**
 * @type {function}
 * @param {Game} game
 * @param {string} f
 */
export function FnF(game, f)
{
  let fn = new Fn();
  fn.f = f;
  fn.recalculate(game);
  return fn;
};
