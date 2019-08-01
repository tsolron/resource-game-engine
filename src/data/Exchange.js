import {Fn, FnF} from './Fn.js';

/**
 * TODO functions
 * @type {class}
 * @param {Map.<string, Fn>} l Used to set list
 * @property {Map.<string, Fn>} list Map of costs/gains ['resource', Fn]
 * @property {Boolean} hasCost
 */
export default class Exchange {
  constructor(l) {
    this.list = l;
    this.hasCost = true;
  }

  recalculate(game) {
    this.hasCost = false;
    this.list.forEach(fn => {
      fn.recalculate(game);
      if (fn.n < 0) { this.hasCost = true; }
    });
  }

  once(game) {
    //debugger;
    if (!this.hasCost) {
      this.doExchange(game, {});
    } else {
      if (this.canExchange(game, {})) {
        this.doExchange(game, {});
      }
    }
  }
  multi(game, eType, repeat, args) {
    //TODO: Implement method
    //TODO: Incorporation of buff, nerf
  }
  canExchange(game, args) {
    //TODO: Incorporation of buff, nerf
    for (let value of this.list.entries()) {
      if (game.resources.get(value[0]).quantity + value[1].n < game.resources.get(value[0]).min.n) {
        return false;
      }
    }
    return true;
  }
  doExchange(game, args) {
    //TODO: Implement buff/nerf
    //debugger;
    for (let value of this.list.entries()) {
      game.resources.get(value[0]).quantity += value[1].n;
    }
  }
}
