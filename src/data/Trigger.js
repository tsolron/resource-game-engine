/**
 * TODO functions
 * @type {class}
 * @param {string} n Used to set name
 * @param {string} t Used to set type
 * @property {string} name Name of Trigger
 * @property {string} type ['once', 'alwaysOn']
 * @property {Boolean} hasTriggered
 * @property {string} condition string to eval()
 * @property {string} action string to eval()
 */
export default class Trigger {
  constructor(n, t) {
    this.name = n;
    this.type = t;
    this.hasTriggered = false;
    this.condition = '';
    this.action = '';
  }

  test(game) {
    let c = eval(this.condition);
    if (c) {
      eval(this.action);
      this.hasTriggered = true;
      return true;
    }
    return false;
  }
}

/**
 * TODO functions
 * @type {function}
 * @param {Game} game
 * @param {string} n Name of Trigger
 * @param {string} t Type ['once', 'alwaysOn']
 * @param {Object} args - Options to initialize the component with
 * @param {String} args.condition - This Trigger's condition
 * @param {Boolean} args.action - This Trigger's action
 */
export function TFactory(game, n, t, args)
{
  let tri = new Trigger(n, t);
  if (typeof args['condition'] !== "undefined") {
    tri.condition = args['condition'];
  }
  if (typeof args['action'] !== "undefined") {
    tri.action = args['action'];
  }
  return tri;
}

/**
 * TODO functions
 * @type {class}
 * @property {Map.<string,Trigger>} waitingTriggers ['name', Trigger]
 * @property {Map.<string,Trigger>} expiredTriggers ['name', Trigger]
 */
export class TriggerList {
  constructor() {
    this.waitingTriggers = new Map();
    this.expiredTriggers = new Map();
  }

  add(t) {
    if (this.expiredTriggers.has(t.name)) {
      // Cannot create as it already exists in expired
      return false;
    }
    if (this.waitingTriggers.has(t.name)) {
      // Cannot create as it already exists in waiting
      return false;
    }

    // Create code
    this.waitingTriggers.set(t.name, t);
  }

  check(game) {
    let rmq = [];

    this.waitingTriggers.forEach(t => {
      if (t.test(game) && t.type === 'once') {
        rmq.push(t.name);
      }
    });

    this.expiredTriggers.forEach(t => {
      if (t.test(game) && t.type === 'once') {
        rmq.push(t.name);
      }
    });

    if (rmq.length > 0) {
      for (t in rmq) {
        this.expiredTriggers.set(t, this.waitingTriggers.get(t));
        this.waitingTriggers.delete(t);
      }
    }
  }
}
