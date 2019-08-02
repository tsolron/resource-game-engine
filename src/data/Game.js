/**
 * This class contains all game data.
 * @class Game
 * @type {class}
 * @property {Common} common
 * @property {TriggerList} triggers
 * @property {ActionList} actions
 * @property {Map.<string, Feature>} features
 * @property {Map.<string, Resource>} resources
 */
export default class Game {
  constructor() {
    this.time = null;
    this.common = null;
    this.triggers = null;
    this.actions = null;
    this.features = new Map();
    this.resources = new Map();
  }
  // Shortcuts
  get f() { return this.features; }
  get r() { return this.resources; }
  get t() { return this.triggers; }
}
