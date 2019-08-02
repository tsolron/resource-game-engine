import Time from './Time.js'
import {ActionFactory, ActionList} from './Action.js'
import {FeatureFactory} from './Feature.js'
import {ResourceFactory} from './Resource.js'
import Exchange from './Exchange.js'
import {Fn, FnF} from './Fn.js';
import {TriggerList, TFactory} from './Trigger.js'

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

  buildStructure() {
    this.time = new Time(200);
    this.actions = new ActionList(10);
    this.triggers = new TriggerList();

    // Note the use of shortcuts (ex. game.r for game.resources). Refer to ./data/Game.js for details

    this.f.set('simple', FeatureFactory('simple', true, ['catnip', 'wood', 'science'], 'Craft'));
    this.f.set('structure', FeatureFactory('structure', true, ['field', 'library'], 'Buy'));

    // Catnip
    this.r.set('catnip', ResourceFactory(this, 'catnip', 0, true, {}));
    this.r.get('catnip').active = new Exchange(this, [['catnip', '10']]);
    this.r.get('catnip').max.f = '5000';

    // Wood
    this.r.set('wood', ResourceFactory(this, 'wood', 0, true, {}));
    this.r.get('wood').active = new Exchange(this, [['wood','1'],['catnip','-3']]);
    this.r.get('wood').max.f = '300';

    // Field
    this.r.set('field', ResourceFactory(this, 'field', 0, false, {}));
    this.r.get('field').passive = new Exchange(this, [['catnip', 'game.r.get("field").qty * 0.125']]);
    this.r.get('field').active = new Exchange(this, [['field', '1'], ['catnip', '-10 * (Math.pow(1.2, game.r.get("field").qty))']]);

    this.r.set('science', ResourceFactory(this, 'science', 0, false, {}));
    this.r.get('science').buff = FnF('1+(game.resources["library"]*0.3)');
    this.r.get('science').max.f = 'game.r.get("library").quantity * 250';

    this.r.set('library', ResourceFactory(this, 'library', 0, true, {}));
    this.r.get('library').active = new Exchange(this, [['library', '1'],['wood','-10*(Math.pow(1.2, game.r.get("library").qty))']]);

    this.t.add(TFactory(this, 'onFirstCatnip3', 'once', {condition: 'game.r.get("catnip").quantity >= 3', action: 'game.r.get("field").unlock();'}));
    this.t.add(TFactory(this, 'onFirstWood3', 'once', {condition: 'game.r.get("wood").quantity >= 3', action: 'game.r.get("science").unlock();'}));

    /*
    let libraryActiveXMap = new Map([['library', FnF('1')],['wood', FnF('10*Math.pow(1.2,self.quantity)')]]);
    let libraryActiveX = new Exchange(libraryActiveXMap);
    resources.set('library', ResourceFactory(game, 'field', 0, false, {influencers:['field'], passive:null, active:libraryActiveX}));

    let researchFeatures = [];
    features.set('research', FeatureFactory('science', false, researchFeatures));


    triggerList.add(TFactory(game, 'onFirstCatnip10', 'once', {condition: 'game.resources.get("catnip").quantity > 10', action: 'game.resources.get("field").unlock();'}));
    triggerList.add(TFactory(game, 'onFirstCatnip50', 'once', {condition: 'game.resources.get("catnip").quantity > 50', action: 'game.resources.get("wood").unlock();'}));
    triggerList.add(TFactory(game, 'onFirstWood10', 'once', {condition: 'game.resources.get("wood").quantity > 10', action: 'game.resources.get("library").unlock();'}));
    triggerList.add(TFactory(game, 'onFirstLibrary1', 'once', {condition: 'game.resources.get("library").quantity > 0', action: 'game.resources.get("science").unlock(); game.features.get("research").unlock();'}));
    game.triggers = triggerList;
    */
  }
}
