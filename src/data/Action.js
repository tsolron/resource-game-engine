/**
 * TODO functions
 * @type {class}
 * @param {Number} t Used to set timeTick
 * @param {Exchange} e Used to set exchange
 * @property {Number} timeTick
 * @property {Number} exchange
 */
export default class Action {
  constructor(t, e) {
    this.timeTick = t;
    this.exchange = e;
  }

  _validateDo(game) {
    return this.exchange.canExchange(game, {});
  }

  do(game) {
    if (this._validateDo(game, {})) {
      this.exchange.once(game, {});
      game.time.recalculateAll(game);
    }
  }

  _validateUndo(game) {
    return this.exchange.canExchange(game, {});
  }

  // TODO: Not up to date
  undo(game) {
    if (this._validateUndo(game)) {
      this.exchange.doExchange(game, {});
    }
  }
};

/**
 * @type {function}
 * @param {Game} game
 * @param {string} f
 */
export function ActionFactory(game, t, e)
{
  let act = new Action(t, e);
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
    this.act_list.push(ActionFactory(game, game.time.timeTick, game.resources.get(n).active));
  }

  cancelLastAction() {
    this.act_list.pop();
  }
}
