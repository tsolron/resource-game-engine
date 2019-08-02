import Resource from './Resource.js';
import Exchange from './Exchange.js'

export default class Upgrade extends Resource
{
  constructor (game, n, u, t)
  {
    super(game, n, u);
    this.type = t;
    this.action = '';
  }
}

export function UFactory(game, n, u, t) {
  return new Upgrade(game, n, u, t);
}
