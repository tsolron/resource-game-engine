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
    let result = Number(eval(this.f));
    this.n = result;
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
  return fn;
};
