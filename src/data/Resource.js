export default class Resource {
  constructor(n, q, u) {
    this.name = n;
    this.quantity = q;
    this.isUnlocked = u;
    this.influencers = [];
    this.min = new Fn(0);
    this.max = new Fn(Infinity);
    this.passive = null; // Exchange
    this.active = null; // Exchange
    this.requirement = null; // Exchange, for self.active, does not modify resources
    this.buff = null; // Optional Fn, multiplies passive/active gains
    this.nerf = null; // Optional Fn, multiplies passive/active costs
    this.isAssigned = false; // bool, indicates 'quantity' is from assignment of other resources
    this.assignedBy = null; // 'resource.name'
    this.numAssigned = 0; // Number of self.quantity assigned to others
  }

  //get f() { return this._f; }
  //set f(f) { this._f = f; }

  unlock() {
    this.isUnlocked = true;
  }

  assign(n, type) {
    //TODO: Implement 'type' (once, upto, exact, max)
    let assigner = game.resources[assignedBy];
    if (n <= (assigner.quantity - assigner.numAssigned)) {
      self.quantity += n;
      assigner.numAssigned += 3;
    }
  }

  unassign(n, type) {
    //TODO: Implement 'type' (once, upto, exact, max)
    if (n <= self.quantity) {
      self.quantity -= n;
      game.resources[assignedBy].numAssigned -= 3;
    }
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
  if (typeof args['buff'] !== "undefined") {
    res.buff = args['buff'];
  }
  if (typeof args['nerf'] !== "undefined") {
    res.nerf = args['nerf'];
  }
  return res;
};
