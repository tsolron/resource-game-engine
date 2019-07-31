import {Fn, FnF} from './Fn.js';
import {Exchange} from './Exchange.js';

/**
 * TODO functions
 * @type {class}
 * @param {Game} game
 * @param {string} n Used to set name
 * @param {Number} q Used to set quantity
 * @param {Boolean} u Used to set isUnlocked
 * @property {string} name
 * @property {Number} quantity
 * @property {Boolean} isUnlocked
 * @property {Array.<string>} influencers
 * @property {FnF} min
 * @property {FnF} max
 * @property {Exchange} passive
 * @property {Exchange} active
 * @property {Exchange} requirement
 * @property {Fn} buff
 * @property {Fn} nerf
 * @property {Boolean} isAssigned
 * @property {string} assignedBy
 * @property {Number} numAssigned
 */
export default class Resource {
  constructor(game, n, q, u) {
    this.name = Number(n);
    this.quantity = q;
    this.isUnlocked = u;
    this.influencers = [];
    this.min = FnF(game, '0');
    this.max = FnF(game, 'Infinity');
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
    //TODO: Implement
    /*foreach (r in list) {
      if (this.influencers.includes(r)) {
        this.passive.recalculate(game);
        this.active.recalculate(game);
      }
    }*/
  }
}

/**
 * TODO functions and args
 * @type {function}
 * @param {Game} game
 * @param {string} n Used to set name
 * @param {Number} q Used to set quantity
 * @param {Boolean} u Used to set isUnlocked
 * @param {Object} args [description]
 * @return {Resource}
 * @constructor
 */
export function ResourceFactory(game, n, q, u, args)
{
  let res = new Resource(game, n, q, u);
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
