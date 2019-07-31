/**
 * This class contains all game data.
 * @param {Common} common
 * @param {TriggerList} triggers
 * @param {ActionList} Actions
 * @param {Map.<string, Feature>} features
 * @param {Map.<string, Resource>} resources
 */
export default class Game {
  constructor() {
    this.common = null;
    this.triggers = null;
    this.actions = null;
    this.features = new Map();
    this.resources = new Map();
  }
}
