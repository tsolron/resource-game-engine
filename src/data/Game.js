export default class Game {
  constructor() {
    this.common = null; // new Common()
    this.triggers = null; // new TriggerList()
    this.actions = null; // new ActionList()
    this.features = new Map(); // ['name', Feature]
    this.resources = new Map(); // ['name', Resource]
    // [{name:'mass',quantity:'fun'}]
  }

}
