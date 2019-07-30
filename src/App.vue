<template>
  <div id="app">
    <h1>Tick Number : {{ this.timeTick }}</h1>
    <div>
      <button @click="tryUndo">Undo Last Action</button>
      <button @click="pause">Pause</button>
      <button @click="slowTick++;">Slow Tick</button>
      <button @click="start">Start / Resume</button>
    </div>
    <hr>
    <ResCore v-for="thisRes in resPoolArr" v-bind="thisRes" v-bind:resPool="resPool" v-on:doCraft="doCraft"></ResCore>
  </div>
</template>

<script>
import Game from './Game.js'
import Common from './Common.js'
import {FnF} from './Fn.js'
import Exchange from './Exchange.js'
import {TriggerList, TFactory} from './Trigger.js'
import Feature from './Feature.js'
import {ResourceFactory} from './data/Resource.js'

import ResCore from './ResCore'
import Action from './data/Action.js'
import ActionList from './data/ActionList.js'
//import Option from './data/Option.js'
import {OptionFactory} from './data/Option.js';
import Math from './lib/math.js'

export default {
  name: 'app',
  components: {
    ResCore
  },
  data () {
    let game = new Game();

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
    resources.set('science', ResourceFactory(game, 'science', 0, false, {influencers:['library'], passive:null, active:null}));

    let structureFeatures = ['field', 'library'];
    features.set('structure', FeatureFactory('structure', true, structureFeatures));
    let fieldPassiveXMap = new Map([['catnip', FnF('this.quantity')]]);
    let fieldPassiveX = new Exchange(fieldPassiveXMap);
    resources.set('field', ResourceFactory(game, 'field', 0, false, {influencers:['field'], passive:fieldPassiveX, active:null}));
    resources.set('library', ResourceFactory(game, 'field', 0, false, {influencers:['field'], passive:fieldPassiveX, active:null}));

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
    let alTemp = new ActionList(10);
    let resList = new Map();
    let opList = [];
    /* Resource(name, quantity, isComposite, isStructure, base_resources_per_tick) */
    resList.set('entropy', new Resource('entropy', resList));
    resList.get('entropy').selfRPT = 0;
    resList.set('energy', new Resource('energy', resList));
    resList.set('mass', new Resource('mass', resList));
    resList.get('mass').isComposite = true;
    resList.get('mass').selfRPT = 0;
    resList.get('mass').cost = [{name:'energy',quantity:10}];
    resList.set('factory', new Resource('factory', resList));
    resList.get('factory').isStructure = true;
    resList.get('factory').baseRPT = [{name:'mass',quantity:1}];
    resList.get('factory').cost = [{name:'mass',quantity:10}];


    /*let fg = "1";
    let fc = "10";
    let fr = "null";
    let op = new Option(fg, fc, fr);
    opList.push(op);
    op.recalculate(resList);*/
    //let params = {gain:'1', cost:'10', req:'null'};
    let params = {type:'1resperclick', res:'entropy'};
    let op = OptionFactory(resList, params);
    //let op = OptionFactory(resPool, {gain:"1",cost:"10",req:"null"});
    //opList.push(op);
    //Math.evaluate(f);
    //return eval('let a = 3; console.log(eval("a * 2"));');

    /*
    IDEAS
* Split income into (onTick and onClick)
*** onTick recalculates every tick (or every n ticks)
* * * * (only increases) vs (conversion)
*** onClick recalculates every click
* Each onClick / button corresponds to a single **Option**
* **Option** is static once made, but may be updated

*Option*
*** name/id (string or integer)
*** gain (n-array of [name,quantity])
*** cost
*** requirement (same as previous, but not subtracted)
*** rate_of_increase functions (may require Resource levels/quantity as parameters)
    */
    return {
      resPool: resList,
      actionList: alTemp,
      options: opList,
      gameTicker: null,
      timeTick: 0,
      tickspersecond: 20,
      paused: false,
      slowTick: 0,
      lastAutoRecalc: 0,
    }
  },
  methods: {
    doCraft: function(res_name, n) {
      let act = new Action(this.timeTick, this.resPool.get(res_name).getCraftGain(), this.resPool.get(res_name).cost, n);
      this.actionList.addAction(act);
    },
    gameLoop: function() {
      if ((!this.paused) || (this.paused && this.slowTick > 0)) {
        this.timeTick++;
        this.slowTick = Math.max(0, --this.slowTick);
        this.resPool.forEach(function (thisRes,name) {
          thisRes.tick(1);
        });
        this.actionList.runNextAction(this.resPool);
      }
    },
    tryUndo: function() {
      this.actionList.rollbackPreviousAction(this.resPool);
    },
    pause: function() {
      this.paused = true;
      this.slowTick = 0;
      //clearInterval(this.gameTicker);
    },
    start: function() {
      this.paused = false;
      //this.gameTicker = setInterval(this.gameLoop, 1000 / this.tickspersecond);
    },
    forceRecalc: function() {
      this.options.forEach(function (o) {
        o.recalculate(this.resPool);
      });
    },
  },
  computed: {
    resPoolArr: function() {
      return Array.from(this.resPool.values());
    }
  },
  mounted: function() {
    this.start();
    this.gameTicker = setInterval(this.gameLoop, 1000 / this.tickspersecond);
  },
}
</script>

<style>
</style>
