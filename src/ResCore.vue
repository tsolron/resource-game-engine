<template>
    <div class="resource">
        <h1>{{ displayName }}</h1>
        <div v-show="_isComposite || _isStructure">
          <!--<input v-model="craftAmount" type="text" placeholder="Amount to craft">-->
          <button v-on:click="doCraft" v-bind:disabled="!canCraft">{{ resActionName }} {{ name }}</button>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'resource',
    props: {
      name: {
        type: String,
        required: true
      },
      resPool: {
        type: Map,
        default: null
      },
      _quantity: {
        type: Number,
        required: true
      },
      _isComposite: {
        type: Boolean,
        default: false
      },
      _isStructure: {
        type: Boolean,
        default: false
      },
      _cost: {
        type: Array,
        default: null
      },
    },
    data: function(){
      return {
        craftAmount: 1,
        improveAmount: 1,
      };
    },
    computed: {
      displayName: function () {
        return (this._isStructure ? 'S' : (this._isComposite ? 'C' : 'R')) + ' : ' + this.name + ' : ' + this._quantity;
      },
      resActionName: function () {
        if (this._isComposite) { return 'Craft'; }
        if (this._isStructure) { return 'Buy'; }
        else { return '???'; }
      },
      canCraft: function () {
        return true;
        //return this.resPool.get(this.name).testCost(1);
      },
      /*canImprove: function () {
        return true;
      }*/
    },
    methods: {
      doCraft: function () {
        this.$emit('doCraft', this.name, 1);
      },
      /*doImprove: function () {
        this.$emit('doImprove', parseInt(this.improveAmount));
      }*/
    }
  }
</script>
