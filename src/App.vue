<template>
  <div id="app">
    <h1>timeTick : {{ timeTick }}</h1>
    <div>
      <button @click="undo">Undo</button>
      <button @click="pause">Pause</button>
      <button @click="start">Play</button>
    </div>

    <hr><br>
    <div v-for="feat of this.game.features" v-bind:feat="feat">
      <div v-for="res of feat[1].list" v-bind:res="res" v-bind:game="game">
        <div v-show="game.resources.get(res).isUnlocked">
          {{feat[0]}} : <b>{{res}}</b> : {{game.resources.get(res).displayQuantity}} |&nbsp;
          <button @click="doActive(res)">{{feat[1].activeName}} {{res}}</button>
        </div>
      </div>
    </div>

    <br><hr><br>
    <!--<button @click="game.resources.get('field').unlock()">Unlock Field</button>-->

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

    // Note the use of shortcuts (ex. game.r for game.resources). Refer to ./data/Game.js for details

    game.f.set('simple', FeatureFactory('simple', true, ['catnip', 'wood'], 'Craft'));
    game.features.set('structure', FeatureFactory('structure', true, ['field'], 'Buy'));

    // Catnip
    game.r.set('catnip', ResourceFactory(game, 'catnip', 0, true, {}));
    game.r.get('catnip').active = new Exchange(game, [['catnip', '10']]);

    // Wood
    game.r.set('wood', ResourceFactory(game, 'wood', 0, true, {}));
    game.r.get('wood').active = new Exchange(game, [['wood','1'],['catnip','-3']]);

    // Field
    game.r.set('field', ResourceFactory(game, 'field', 0, false, {}));
    game.r.get('field').passive = new Exchange(game, [['catnip', 'game.r.get("field").qty * 0.125']]);
    game.r.get('field').active = new Exchange(game, [['field', '1'], ['catnip', '-10 * (Math.pow(1.2, game.r.get("field").qty))']]);

    game.t.add(TFactory(game, 'onFirstCatnip3', 'once', {condition: 'game.r.get("catnip").quantity >= 3', action: 'game.r.get("field").unlock();'}));
    game.t.add(TFactory(game, 'onFirstWood3', 'once', {condition: 'game.r.get("wood").quantity >= 3', action: 'game.r.get("hut").unlock();'}));


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
      this.game.actions.addActionByName(this.game, res_name);
    },
  },
  computed: {
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
