export default class Resource {
  constructor(n, q, u) {
    this.name = n;
    this.quantity = q;
    this.isUnlocked = u;
    this.influencers = [];
    this.passive = null;
    this.active = null;
  }

  //get f() { return this._f; }
  //set f(f) { this._f = f; }

  unlock() {
    this.isUnlocked = true;
  }

  recalcPA(game, rlist) {
    foreach (r in list) {
      if (this.influencers.includes(r)) {
        this.passive.recalculate(game);
        this.active.recalculate(game);
      }
    }
  }
}

export function ResourceFactory(game, n, q, u, args)
{
  let res = new Resource(n, q, u);
  if (typeof args['influencers'] !== "undefined") {
    res.influencers = args['influencers'];
  }
  if (typeof args['passive'] !== "undefined") {
    res.passive = args['passive'];
  }
  if (typeof args['active'] !== "undefined") {
    res.active = args['active'];
  }
  return res;
};
