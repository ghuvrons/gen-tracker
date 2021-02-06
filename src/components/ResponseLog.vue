<template>
  <div class="shadow-1">
    <div class="q-pa-xs bg-purple text-white text-subtitle1">
      Response Log
      <q-badge v-if="devCommands.length > 0" color="red" align="top">
        {{ devCommands.length }}
      </q-badge>
    </div>

    <q-virtual-scroll
      :items="devCommands"
      style="height: calc(100vh - 440px)"
      separator
    >
      <template v-slot="{ item: cmd, index }">
        <q-item
          :key="index"
          @click="applyCommand(cmd.payload)"
          :dark="darker"
          clickable
        >
          <q-item-section>
            <q-item-label lines="1">{{ cmd.payload }}</q-item-label>
            <q-item-label lines="2" caption>
              {{ cmd.message }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-chip :color="parseResCode(cmd.resCode).color" dark dense square>
              {{ parseResCode(cmd.resCode).title }}
            </q-chip>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:after>
        <q-banner v-if="devCommands.length == 0" :dark="darker">
          <template v-slot:avatar>
            <q-icon name="info"></q-icon>
          </template>
          No response yet
        </q-banner>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { devCommands } from "../store/db/getter-types";
import { SET_THE_CMD_BUFFER } from "../store/db/mutation-types";
import { mapState, mapGetters, mapMutations } from "vuex";
import { parseResCode } from "components/js/response";
import CommonMixin from "components/mixins/CommonMixin";

export default {
  // name: 'ComponentName',
  mixins: [CommonMixin],
  computed: {
    ...mapState("db", ["loading"]),
    ...mapGetters("db", [devCommands]),
  },
  methods: {
    ...mapMutations("db", [SET_THE_CMD_BUFFER]),
    applyCommand(payload) {
      if (!this.loading) this.SET_THE_CMD_BUFFER(payload);
    },
    parseResCode(code) {
      return parseResCode(code);
    },
  },
};
</script>

<style>
</style>
