/**
 * TODO functions
 * @type {class}
 * @param {string} n Used to set name
 * @param {Boolean} u Used to set isUnlocked
 * @property {string} name
 * @property {Boolean} isUnlocked
 * @property {Array.<string>} list Array of 'resource'
 * @property {Fn} buff
 * @property {Fn} nerf
 */
export default class Feature {
  constructor(n, u) {
    this.name = n;
    this.isUnlocked = u;
    this.list = [];
    this.buff = null; // Fn
    this.nerf = null; // Fn
  }

  unlock() {
    this.isUnlocked = true;
  }

  addResource(n) {
    if (this.list.includes(n)) {
      // Cannot add, already in list
      return false;
    } else {
      this.list.push(n);
    }
  }

  doPassive(game) {
    //array.forEach(item => console.log(item));
    this.list.forEach(n => {if (!!game.resources.get(n).passive) {
      game.resources.get(n).passive.once(game);
    }});
    /*for (n in this.list) {
      if (game.resources.get(n).passive !== 'undefined') {
        game.resources.get(n).passive.once(game);
      }
    }*/
  }

  recalculate(game) {
    if (!!this.buff) {
      this.buff.recalculate(game);
    }
    if (!!this.nerf) {
      this.nerf.recalculate(game);
    }
  }

  recalculateAll(game) {
    this.recalculate(game);
    for (let n of this.list) {
      game.resources.get(n).recalculate(game);
    }
  }
}

/**
 * @type {function}
 * @param {string} n Used to set name
 * @param {Boolean} u Used to set isUnlocked
 * @param {Array.<string>} l Used to set list
 * @constructor
 */
export function FeatureFactory(n, u, l)
{
  let feature = new Feature(n, u);
  feature.list = l;
  return feature;
};
