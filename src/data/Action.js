/**
 * TODO functions
 * @type {class}
 * @param {Number} t Used to set timeTick
 * @param {Exchange} e Used to set exchange
 * @property {Number} timeTick
 * @property {Number} exchange
 */
export default class Action {
  constructor(t, type, arg) {
    this.timeTick = t;
    this.type = type;
    if (type === 'resource' || type === 'r') {
      this.exchange = arg;
    } else if (type === 'upgrade' || type === 'u') {
      this.exchange = arg[0];
      this.action = arg[1];
    }
  }

  _validateDo(game) {
    return this.exchange.canExchange(game, {});
  }

  do(game) {
    if (this._validateDo(game, {})) {
      this.exchange.once(game, {});
      game.time.recalculateAll(game);
    }
    if (!!this.action) {
      eval(this.action);
    }
  }

  _validateUndo(game) {
    return this.exchange.canUnExchange(game, {});
  }

  // TODO: Not up to date
  undo(game) {
    if (this._validateUndo(game)) {
      this.exchange.undoExchange(game, {});
    }
  }
};

/**
 * @type {function}
 * @param {Game} game
 * @param {string} f
 */
export function ActionFactory(game, t, type, arg)
{
  let act = new Action(t, type, arg);
  return act;
};

/**
 * TODO functions
 * @type {class}
 * @param {Number} n Used to set max_history
 * @property {Array.<Action>} act_list
 * @property {Array.<Action>} past_actions
 * @property {Number} max_history
 */
export class ActionList {
  constructor(n) {
    this.act_list = [];
    this.past_actions = [];
    this.max_history = Number(n);
  }

  runNextAction(game) {
    if (this.act_list.length == 0) {
      return;
    }
    let cur_act = this.act_list.shift();
    cur_act.do(game);
    this.past_actions.push(cur_act);
    if (this.past_actions.length > this.max_history) {
      this.past_actions.shift();
    }
  }

  rollbackPreviousAction(game) {
    if (this.past_actions.length == 0) {
      return;
    }
    let cur_act = this.past_actions.pop();
    cur_act.undo(game);
  }

  addAction(act) {
    this.act_list.push(act);
  }

  addActionByName(game, n) {
    this.addAction(ActionFactory(game, game.time.tt, 'resource', game.r.get(n).active));
  }

  addUActionByName(game, n) {
    this.addAction(ActionFactory(game, game.time.tt, 'upgrade', [game.upgrades.get(n).active, game.upgrades.get(n).action]));
  }

  cancelLastAction() {
    this.act_list.pop();
  }
}
