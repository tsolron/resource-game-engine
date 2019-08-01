<template>
  <div id="app">
    <h1>timeTick : {{ timeTick }}</h1>
    <div>
      <button @click="undo">Undo</button>
      <button @click="pause">Pause</button>
      <button @click="start">Play</button>
    </div>

    <hr>
    <div v-for="feat of this.game.features" v-bind:feat="feat">
      <div v-for="res of feat[1].list" v-bind:res="res" v-bind:game="game">
        <div v-show="game.resources.get(res).isUnlocked">
          {{feat[0]}} : <b>{{res}}</b> : {{game.resources.get(res).displayQuantity}} |&nbsp;
          <button @click="doActive(res)">{{feat[1].activeName}} {{res}}</button>
        </div>
      </div>
    </div>

    <br><hr><br>
    <button @click="game.resources.get('field').unlock()">Unlock Field</button>

  </div>
</template>

<script>
import Game from './data/Game.js'
import Time from './data/Time.js'
//import Common from './data/Common.js'
import {Fn, FnF} from './data/Fn.js'
import Exchange from './data/Exchange.js'
import {TriggerList, TFactory} from './data/Trigger.js'
import {FeatureFactory} from './data/Feature.js'
import {ResourceFactory} from './data/Resource.js'
import {ActionFactory, ActionList} from './data/Action.js'

export default {
  name: 'app',
  components: {

  },
  data () {
    //TODO: Move this setup code to a separate initialization method or file
    let game = new Game();
    game.time = new Time(200);
    game.actions = new ActionList(10);
    game.triggers = new TriggerList();

    game.features.set('simple', FeatureFactory('simple', true, ['catnip', 'wood'], 'Craft'));
    game.features.set('structure', FeatureFactory('structure', true, ['field'], 'Buy'));

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
    game.resources.set('field', ResourceFactory(game, 'field', 0, false, {influencers:[], passive:fieldPassiveX, active:fieldActiveX}));

    let test = TFactory(game, 'onFirstCatnip3', 'once', {condition: 'game.resources.get("catnip").quantity >= 3', action: 'game.resources.get("field").unlock();'});
    game.triggers.add(test);
/*
    resources.set('science', ResourceFactory(game, 'science', 0, false, {influencers:['library'], passive:null, active:null, buff:FnF('1+(game.resources["library"]*0.3)')}));

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

    return {
      game: game,
    }
  },
  methods: {
    undo: function() {
      this.game.actions.rollbackPreviousAction(this.game);
    },
    pause: function() {
      this.game.time.pause();
    },
    start: function() {
      this.game.time.start(this.game);
    },
    doActive: function(res_name) {
      //debugger;
      this.game.actions.addActionByName(this.game, res_name);
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
