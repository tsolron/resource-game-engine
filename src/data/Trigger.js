export default class Trigger {
  constructor(n, t) {
    this.name = n;
    this.type = t; // 'once' or 'alwaysOn'
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

export class TriggerList {
  constructor() {
    this.waitingTriggers = new Map();
    this.expiredTriggers = new Map();
  }

  //get f() { return this._f; }
  //set f(f) { this._f = f; }

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
