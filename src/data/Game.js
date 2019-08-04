'use strict';

import FeatureTree from './featureTree.json';
import Time from './Time.js';
import {ActionFactory, ActionList} from './Action.js';
import {FeatureFactory} from './Feature.js';
import {ResourceFactory} from './Resource.js';
import {ExchangeFactory} from './Exchange.js';
import {FnF} from './Fn.js';
import {TriggerFactory, TriggerList} from './Trigger.js';
import {UpgradeFactory} from './Upgrade.js';

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
    this.featureTree = FeatureTree;
    this.time = new Time(200);
    this.common = null;
    this.triggers = new TriggerList();
    this.actions = new ActionList(10);
    this.features = new Map();
    this.resources = new Map();
    this.upgrades = new Map();
  }
  // Shortcuts
  get f() { return this.features; }
  get r() { return this.resources; }
  get t() { return this.triggers; }
  get u() { return this.upgrades; }

  buildStructure() {

    this.f.set('simple', FeatureFactory('simple', true, [], 'Get'));
    this.f.set('crafted', FeatureFactory('crafted', false, [], 'Craft'));
    this.f.set('structure', FeatureFactory('structure', false, [], 'Build'));
    this.f.set('jobs', FeatureFactory('jobs', false, [], 'Assign'));
    this.f.set('research', FeatureFactory('research', false, [], 'Research'));
    this.f.set('workshop', FeatureFactory('workshop', false, [], 'Improve'));
    this.f.set('trade', FeatureFactory('trade', false, [], 'Trade with'));
    this.f.set('religion-unicorn', FeatureFactory('religion-unicorn', false, [], 'Conspire'));
    this.f.set('religion-sun', FeatureFactory('religion-sun', false, [], 'Preach'));
    this.f.set('religion-crypto', FeatureFactory('religion-crypto', false, [], 'Hack'));
    this.f.set('space', FeatureFactory('space', false, [], 'Whee'));
    this.f.set('time', FeatureFactory('time', false, [], 'Who?'));
    this.f.set('void', FeatureFactory('void', false, [], 'Where?'));
    this.f.set('achievements', FeatureFactory('achievements', false, [], 'Achieved: '));

    /* *************************************************************************
     ****** Fully modeled to here ******
     **************************************************************************/

    this.f.set('simple', FeatureFactory('simple', true, ['catnip', 'wood', 'science'], 'Craft'));
    this.f.set('structure', FeatureFactory('structure', true, ['field', 'library'], 'Buy'));
    this.f.set('research', FeatureFactory('research', false, ['farmer'], 'Research'));

    // Catnip
    this.r.set('catnip', ResourceFactory(this, 'catnip', true, {}));
    this.r.get('catnip').active = new Exchange(this, [['catnip', '10']]);
    this.r.get('catnip').max.f = '5000';

    // Wood
    this.r.set('wood', ResourceFactory(this, 'wood', true, {}));
    this.r.get('wood').active = new Exchange(this, [['wood','1'],['catnip','-3']]);
    this.r.get('wood').max.f = '300';

    // Field
    this.r.set('field', ResourceFactory(this, 'field', false, {}));
    this.r.get('field').passive = new Exchange(this, [['catnip', 'game.r.get("field").qty * 0.125']]);
    this.r.get('field').active = new Exchange(this, [['field', '1'], ['catnip', '-10 * (Math.pow(1.2, game.r.get("field").qty))']]);

    this.r.set('science', ResourceFactory(this, 'science', false, {}));
    this.r.get('science').buff = FnF('1+(game.resources["library"]*0.3)');
    this.r.get('science').max.f = 'game.r.get("library").quantity * 250';

    this.r.set('library', ResourceFactory(this, 'library', true, {}));
    this.r.get('library').active = new Exchange(this, [['library', '1'],['wood','-10*(Math.pow(1.2, game.r.get("library").qty))']]);

    this.t.add(TFactory(this, 'onFirstCatnip3', 'once', {condition: 'game.r.get("catnip").quantity >= 3', action: 'game.r.get("field").unlock();'}));
    this.t.add(TFactory(this, 'onFirstWood3', 'once', {condition: 'game.r.get("wood").quantity >= 3', action: 'game.r.get("science").unlock();'}));

    this.r.set('farmer', ResourceFactory(this, 'farmer', false, {}));

    // Testing Upgrades
    this.upgrades.set('farming', UFactory(this, 'farming', true, 'once'));
    this.upgrades.get('farming').active = new Exchange(this, [['catnip', '-50']]);
    this.upgrades.get('farming').action = 'game.f.get("research").unlock(); game.r.get("farmer").unlock();';

    this.f.get('research').addComponent('upgrade', 'farming');

    /*
    triggerList.add(TFactory(game, 'onFirstLibrary1', 'once', {condition: 'game.resources.get("library").quantity > 0', action: 'game.resources.get("science").unlock(); game.features.get("research").unlock();'}));
    game.triggers = triggerList;
    */
  }

  kittensGame() {
    /* Simple resources and upgrades */
        // catnip
        // wood
        // minerals
        // coal
        // iron
        // titanium
        // gold
        // oil
        // uranium
        // unobtainium
        // antimatter
        // catpower
        // science
        // culture
        // faith
        // kittens
        // starchart
        // furs
        // ivory
        // spice
        // unicorns
        // alicorns
        // necrocorns
        // tears
        // karma
        // paragon
        // burned paragon
        // time crystal
        // relic
        // void
        // blackcoin
    /* Crafted resources and upgrades */
        // <make wood>
        // beam
        // slab
        // plate
        // steel
        // concrete
        // gear
        // alloy
        // eludium
        // scaffold
        // ship
        // tanker
        // kerosene
        // parchment
        // manuscript
        // compendium
        // blueprint
        // thorium
        // megalith
    /* Structure resources and upgrades */
        // <gather catnip>
        // <make wood>
        // Catnip field
        // Solar Farm (/ Pasture)
        // Hydro Plant (/ Aqueduct)
        // Hut
        // Log House
        // Mansion
        // Data Center (/ Library)
        // Academy
        // Observatory
        // Bio Lab
        // Barn
        // Warehouse
        // Harbour
        // Mine
        // Quarry
        // Lumber Mill
        // Oil Well
        // Accelerator
        // Steamworks
        // Magneto
        // Smelter
        // Calciner
        // Factory
        // Reactor
        // Broadcast Tower (/ Amphitheatre)
        // Chapel
        // Temple
        // Workshop
        // Tradepost
        // Mint
        // Unicorn Pasture
        // Ziggurat
        // Chronosphere
        // AI Core
    /* Jobs resources and upgrades */
        // Woodcutter
        // Farmer
        // Scholar
        // Hunter
        // Miner
        // Priest
        // Geologist
        // Engineer
    /* Research resources and upgrades */
        // Many
    /* Workshop resources and upgrades */
        // Many
    /* Trade resources and upgrades */
        // Lizards
        // Sharks
        // Griffins
        // Nagas
        // Zebras
        // Spiders
        // Dragons
        // Leviathans
    /* Religion-Unicorn resources and upgrades */
    /* Religion-Sun resources and upgrades */
    /* Religion-Crypto resources and upgrades */
    /* Space resources and upgrades */
    /* Time resources and upgrades */
    /* Void resources and upgrades */
    /* Achievements resources and upgrades */
  }

  // Note the use of shortcuts (ex. game.r for game.resources). Refer to ./data/Game.js for details
  buildFromFile() {
    // Create Resources from file
    for (const resourceArr of Object.entries(this.featureTree.resources)) {
      const resource = resourceArr[1];
      this.r.set(resource.name, ResourceFactory(resource.name, resource.isUnlocked));
      if (!!resource.passive) { this.r.get(resource.name).passive = ExchangeFactory(resource.passive); }
      if (!!resource.active) { this.r.get(resource.name).active = ExchangeFactory(resource.active); }
      if (!!resource.min) { this.r.get(resource.name).min.f = resource.min; }
      if (!!resource.max) { this.r.get(resource.name).max.f = resource.max; }
      if (!!resource.buff) { this.r.get(resource.name).buff = new FnF(this, resource.buff); }
      if (!!resource.nerf) { this.r.get(resource.name).nerf = new FnF(this, resource.nerf); }
    }

    // Create Upgrades from file
    for (const upgradeArr of Object.entries(this.featureTree.upgrades)) {
      const upgrade = upgradeArr[1];
      this.u.set(upgrade.name, UpgradeFactory(this, upgrade.name, upgrade.isUnlocked, upgrade.type));
      if (!!upgrade.active) { this.u.get(upgrade.name).active = ExchangeFactory(upgrade.active); }
      if (!!upgrade.action) { this.u.get(upgrade.name).action = upgrade.action; }
    }

    //debugger;

    // Create Triggers from file
    for (const triggerArr of Object.entries(this.featureTree.triggers)) {
      const trigger = triggerArr[1];
      this.t.add(TriggerFactory(trigger.name, trigger.type, trigger.condition, trigger.action));
      //triggerList.add(TFactory(game, 'onFirstLibrary1', 'once', {condition: 'game.resources.get("library").quantity > 0', action: 'game.resources.get("science").unlock(); game.features.get("research").unlock();'}));
    }

    // Create Features from file
    for (const featureArr of Object.entries(this.featureTree.features)) {
      const feature = featureArr[1];
      this.f.set(feature.name, FeatureFactory(feature.name, feature.isUnlocked, feature.activeName));
      if (!!feature.resources) { this.f.get(feature.name).resources = feature.resources; }
      if (!!feature.upgrades) { this.f.get(feature.name).upgrades = feature.upgrades; }
      //this.f.get('research').addComponent('upgrade', 'farming');
    }

    //for (const [className, classArray] of Object.entries(this.featureTree)) { }

    this.recalculateAll(this);
  }

  recalculateAll() {
    this.resources.forEach(r => {
      r.recalculate(this);
    });
    this.features.forEach(f => {
      f.recalculateAll(this);
    });
    this.upgrades.forEach(u => {
      u.recalculate(this);
    });
  }

  unlockAll() {
    this.features.forEach(f => {
      f.unlockAll(this);
    });
  }
}
