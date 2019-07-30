export default class Exchange {
  constructor(resList) {
    this.list = resList; // Map('resource', Fn)
    this.listc = [];
    this.hasCost = true;
  }

  //get f() { return this._f; }
  //set f(f) { this._f = f; }

  recalculate(game) {
    let myMap = new Map([['c',3], ['w',5]]);
    let it = myMap.entries();
    // LOOP
    let me = it.next();
    console.log(me.values[0]);
    // AFTER ALL, me.values === 'undefined'

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
      doExchange(null, null);
    } else {
      if (canExchange(null, null)) {
        doExchange(null, null);
      }
    }
  }
  something(game, eType, repeat, buff, nerf) {
    //TODO: Implement method
    //TODO: Incorporation of buff, nerf
  }
  canExchange(buff, nerf) {
    //TODO: Implement method
    return true;
  }
  doExchange(buff, nerf) {
    //TODO: Implement buff/nerf
    for (let value of this.list.entries()) {
      game.resources.set(value[0], game.resources.get(value[0]) + value[1]);
    }
  }
}
