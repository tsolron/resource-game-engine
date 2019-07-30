export default class Fn {
  constructor() {
    this.n = 1;
    this._f = null;
  }

  get f() { return this._f; }
  set f(f) { this._f = f; }

  recalculate(game) {
    let result = eval(this.f);
    this.n = result;
    //Math.evaluate(f);
    //return eval('let a = 3; console.log(eval("a * 2"));');
  }
}

export function FnF(f)
{
  let fn = new Fn();
  fn.f = f;
  fn.recalculate(game);
  return fn;
};
