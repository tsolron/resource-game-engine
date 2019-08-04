'use strict';

import {FnF} from './Fn.js';

/**
 * TODO functions
 * @type {class}
 * @param {Map.<string, Fn>} l Used to set list
 * @property {Map.<string, Fn>} list Map of costs/gains ['resource', Fn]
 * @property {Boolean} hasCost
 */
export default class Exchange {
  constructor() {
    this.list = new Map();
    this.hasCost = false;
  }

  setup(l) {
    for (var i = 0; i < l.length; i++) {
      this.list.set(l[i][0], FnF(l[i][1]));
    }
  }

  recalculate(game) {
    this.hasCost = false;
    this.list.forEach(fn => {
      fn.recalculate(game);
      if (fn.n < 0) { this.hasCost = true; }
    });
  }

  _canExchange(game, buff, nerf) {
    //TODO: Incorporation of buff, nerf
    for (let value of this.list.entries()) {
      let mod = (value[1].n < 0) ? (value[1].mult(nerf)) : (value[1].mult(buff));
      if (game.resources.get(value[0]).quantity + mod < game.resources.get(value[0]).min.n) {
        return false;
      }
    }
    return true;
  }

  doExchange(game, buff, nerf) {
    //TODO: Implement buff/nerf
    for (let value of this.list.entries()) {
      let mod = (value[1].n < 0) ? (value[1].mult(nerf)) : (value[1].mult(buff));
      game.resources.get(value[0]).add(mod);
    }
  }

  once(game, buff, nerf) {
    //debugger;
    if (!this.hasCost) {
      this.doExchange(game, buff, nerf);
      return true;
    } else if (this._canExchange(game, buff, nerf)) {
        this.doExchange(game, buff, nerf);
        return true;
    } else {
      return false;
    }
  }

  canUnExchange(game) {
    for (let value of this.list.entries()) {
      if (game.resources.get(value[0]).quantity - value[1].n < game.resources.get(value[0]).min.n) {
        return false;
      }
    }
    return true;
  }

  undoExchange(game) {
    for (let value of this.list.entries()) {
      let sellPenalty = (value[1].n < 0) ? 0.5: 1.0;
      game.resources.get(value[0]).quantity -= value[1].n * sellPenalty;
    }
  }

  unOnce(game) {
    if (this.canUnExchange(game)) {
        this.undoExchange(game);
    }
  }
}

export function ExchangeFactory(l)
{
  let e = new Exchange();
  e.setup(l);
  return e;
};
