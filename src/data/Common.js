'use strict';

export default class Common {
  constructor() {
    this._list = new Map();
    // [{name:'mass',quantity:'fun'}]
  }

  //get gain() { return this._gain; }
  //set funGain(fg) { this._funGain = fg; }

  add(n, v) {
    if (this._list.get(n) === 'undefined') {
      this._list.set(n, v);
    }
    else {
      //TODO: Already exists so display error message
    }
  }

  // Empty Exchange()
}
