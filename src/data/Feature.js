/**
 * TODO functions
 * @type {class}
 * @param {string} n Used to set name
 * @param {Boolean} u Used to set isUnlocked
 * @property {string} name
 * @property {Boolean} isUnlocked
 * @property {Array.<string>} resources Array of 'resource'
 * @property {Array.<string>} upgrades Array of 'upgrade'
 * @property {Fn} buff
 * @property {Fn} nerf
 */
export default class Feature {
  constructor(n, u) {
    this.name = n;
    this.isUnlocked = u;
    this.resources = [];
    this.upgrades = [];
    this.activeName = '';
    this.buff = null; // Fn
    this.nerf = null; // Fn
  }

  unlock() {
    this.isUnlocked = true;
  }

  addComponent(t, n) {
    let where = null;
    if (t === 'resource' || t === 'r') {
      where = this.resources;
    } else if (t === 'upgrade' || t === 'u') {
      where = this.upgrades;
    }

    if (where.includes(n)) {
      // Cannot add, already in list
      return false;
    } else {
      where.push(n);
    }
  }

  addResource(n) {
    addComponent(n, 'resource');
  }

  doPassive(game) {
    //array.forEach(item => console.log(item));
    this.resources.forEach(n => {if (!!game.resources.get(n).passive) {
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
    for (let n of this.resources) {
      game.resources.get(n).recalculate(game);
    }
    for (let n of this.upgrades) {
      game.upgrades.get(n).recalculate(game);
    }
  }

  unlockAll(game) {
    this.unlock();
    for (let n of this.resources) {
      game.resources.get(n).unlock();
    }
    for (let n of this.upgrades) {
      game.upgrades.get(n).unlock();
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
export function FeatureFactory(n, u, l, an)
{
  let feature = new Feature(n, u);
  feature.resources = l;
  feature.activeName = an;
  return feature;
};
