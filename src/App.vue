<template>
  <div id="app">
    <h1>timeTick : {{ timeTick }}</h1>
    <div>
      <button>Undo</button>
      <button @click="pause">Pause</button>
      <button @click="start">Play</button>
    </div>
    <hr>
    <h1>Catnip : {{game.resources.get('catnip').quantity.toFixed(2)}} <button @click="doCatnip">Gather Catnip</button></h1>
    <h1>Wood : {{game.resources.get('wood').quantity}} <button @click="doWood">Refine Catnip</button></h1>
    <h1>Field : {{game.resources.get('field').quantity}} <button @click="doField">Buy Field</button></h1>

    <!--<ResCore v-for="thisRes in resPoolArr" v-bind="thisRes" v-bind:resPool="resPool" v-on:doCraft="doCraft"></ResCore>-->
  </div>
</template>

<script>
import Game from './data/Game.js'
import Time from './data/Time.js'
//import Common from './data/Common.js'
import {Fn, FnF} from './data/Fn.js'
import Exchange from './data/Exchange.js'
//import {TriggerList, TFactory} from './data/Trigger.js'
import {FeatureFactory} from './data/Feature.js'
import {ResourceFactory} from './data/Resource.js'
import {ActionFactory, ActionList} from './data/Action.js'

//import FSimple from './FSimple'

export default {
  name: 'app',
  components: {
    //FSimple
  },
  data () {
    //TODO: Move this setup code to a separate initialization method or file
    let game = new Game();
    game.time = new Time(50);
    game.actions = new ActionList(10);

    game.features.set('simple', FeatureFactory('simple', true, ['catnip', 'wood']));
    game.features.set('structure', FeatureFactory('structure', true, ['field']));

    // Catnip
    let catnipActiveXMap = new Map([['catnip', FnF(game, '1')]]);
    let catnipActiveX = new Exchange(catnipActiveXMap);
    game.resources.set('catnip', ResourceFactory(game, 'catnip', 0, true, {influencers:[], passive:null, active:catnipActiveX}));

    // Wood
    let woodActiveXMap = new Map([['wood', FnF(game, '1')], ['catnip', FnF(game, '-3')]]);
    let woodActiveX = new Exchange(woodActiveXMap);
    game.resources.set('wood', ResourceFactory(game, 'wood', 0, true, {influencers:[], passive:null, active:woodActiveX}));

    // Field
    let fieldPassiveXMap = new Map([['catnip', FnF(game, 'game.resources.get("field").qty * 0.125')]]);
    let fieldPassiveX = new Exchange(fieldPassiveXMap);
    let fieldActiveXMap = new Map([['field', FnF(game, '1')], ['catnip', FnF(game, '-10 * (Math.pow(1.2, game.resources.get("field").qty))')]]);
    let fieldActiveX = new Exchange(fieldActiveXMap);
    game.resources.set('field', ResourceFactory(game, 'field', 0, true, {influencers:[], passive:fieldPassiveX, active:fieldActiveX}));




/*
    let common = new Common();
    common.add('globalProductionMult', FnF('1') );
    game.common = common;


    let features = new Map();
    let simpleFeatures = ['catnip', 'wood', 'science'];
    features.set('simple', FeatureFactory('simple', true, simpleFeatures));
    let catnipActiveXMap = new Map([['catnip', FnF('1')]]);
    let catnipActiveX = new Exchange(catnipActiveXMap);
    resources.set('catnip', ResourceFactory(game, 'catnip', 0, true, {influencers:[], passive:null, active:catnipActiveX}));
    let woodActiveXMap = new Map([['catnip', FnF('1')], ['wood', FnF('-50')]]);
    let woodActiveX = new Exchange(woodActiveXMap);
    resources.set('wood', ResourceFactory(game, 'wood', 0, false, {influencers:[], passive:null, active:woodActiveX}));
    resources.set('science', ResourceFactory(game, 'science', 0, false, {influencers:['library'], passive:null, active:null, buff:FnF('1+(game.resources["library"]*0.3)')}));

    let structureFeatures = ['field', 'library'];
    features.set('structure', FeatureFactory('structure', true, structureFeatures));
    let fieldPassiveXMap = new Map([['catnip', FnF('this.quantity')]]);
    let fieldPassiveX = new Exchange(fieldPassiveXMap);
    resources.set('field', ResourceFactory(game, 'field', 0, false, {influencers:['field'], passive:fieldPassiveX, active:null}));
    let libraryActiveXMap = new Map([['library', FnF('1')],['wood', FnF('10*Math.pow(1.2,self.quantity)')]]);
    let libraryActiveX = new Exchange(libraryActiveXMap);
    resources.set('library', ResourceFactory(game, 'field', 0, false, {influencers:['field'], passive:null, active:libraryActiveX}));

    let researchFeatures = [];
    features.set('research', FeatureFactory('science', false, researchFeatures));


    game.resources = resources;
    game.features = features;


    let triggerList = new TriggerList();
    triggerList.add(TFactory(game, 'onFirstCatnip10', 'once', {condition: 'game.resources.get("catnip").quantity > 10', action: 'game.resources.get("field").unlock();'}));
    triggerList.add(TFactory(game, 'onFirstCatnip50', 'once', {condition: 'game.resources.get("catnip").quantity > 50', action: 'game.resources.get("wood").unlock();'}));
    triggerList.add(TFactory(game, 'onFirstWood10', 'once', {condition: 'game.resources.get("wood").quantity > 10', action: 'game.resources.get("library").unlock();'}));
    triggerList.add(TFactory(game, 'onFirstLibrary1', 'once', {condition: 'game.resources.get("library").quantity > 0', action: 'game.resources.get("science").unlock(); game.features.get("research").unlock();'}));
    game.triggers = triggerList;

    //RGE ENDS HERE
*/

    return {
      game: game,
    }
  },
  methods: {
    pause: function() {
      this.game.time.pause();
    },
    start: function() {
      this.game.time.start(this.game);
    },
    doCatnip: function() {
      this.game.actions.addAction(ActionFactory(this.game, this.timeTick, this.game.resources.get('catnip').active));
    },
    doWood: function() {
      this.game.actions.addAction(ActionFactory(this.game, this.timeTick, this.game.resources.get('wood').active));
    },
    doField: function() {
      //this.game.actions.addAction(ActionFactory(this.game, this.timeTick, this.game.resources.get('field').active));
      this.game.actions.addActionByName(this.game, 'field');
    },
  },
  computed: {
    catnip: function() {
      return this.game.resources.get('catnip').quantity;
    },
    timeTick: function() {
      return this.game.time.timeTick;
    },
  },
  created: function() {
    this.game.time.start(this.game);
    this.game.time.recalculateAll(this.game);
    this.game.time.gameLoop = setInterval(this.game.time.tick, (this.game.time.gameLoopInterval), this.game);
  },
}
</script>

<style>
</style>
