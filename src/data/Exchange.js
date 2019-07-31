export default class Exchange {
  constructor(resList) {
    this.list = resList; // Map('resource', Fn)
    this.listc = [];
    this.hasCost = true;
  }

  //get f() { return this._f; }
  //set f(f) { this._f = f; }

  recalculate(game) {
    this.hasCost = false;
    let temp = this.list.entries();
    for (let value of temp) {
      if (value !== 'undefined') {
        let n = value[0];
        let f = value[1];
        let r = eval(f);
        if (r < 0) { this.hasCost = true; }
        this.listc.set(n, r);
      }
    }
  }

  once(game) {
    if (!this.hasCost) {
      doExchange(game, {});
    } else {
      if (canExchange(game, {})) {
        doExchange(game, {});
      }
    }
  }
  multi(game, eType, repeat, args) {
    //TODO: Implement method
    //TODO: Incorporation of buff, nerf
  }
  canExchange(game, args) {
    //TODO: Implement method
    //TODO: Incorporation of buff, nerf
    return true;
  }
  doExchange(game, args) {
    //TODO: Implement buff/nerf
    for (let value of this.list.entries()) {
      game.resources.set(value[0], game.resources.get(value[0]) + value[1]);
    }
  }
}
