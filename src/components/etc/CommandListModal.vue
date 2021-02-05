<template>
  <q-dialog v-model="modalOpen" full-width>
    <q-card :dark="darker">
      <q-card-section class="bg-primary text-white">
        COMMAND LIST
        <q-badge v-if="COMMAND_LIST.length > 0" color="red" align="top">
          {{ COMMAND_LIST.length }}
        </q-badge>
      </q-card-section>
      <q-separator></q-separator>

      <q-card-section class="scroll" style="max-height: 70vh">
        <q-list :dark="darker" separator>
          <q-item
            v-for="(el, i) in searchResult"
            :key="i"
            @click="$emit('select', el.command)"
            :dark="darker"
            clickable
          >
            <q-item-section>
              <q-item-label lines="1">{{ el.command }}</q-item-label>
              <q-item-label lines="2" caption>{{ el.desc }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="el.type" side>
              <q-item-label>
                <q-chip dark dense square color="red">
                  {{ el.type }}
                </q-chip>
              </q-item-label>
              <q-item-label>
                <q-chip dark dense square color="green">
                  {{ getRange(el.range) }}
                </q-chip>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator></q-separator>

      <q-card-actions class="bg-primary text-white">
        <q-btn unelevated @click="modalOpen = false" label="Close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { COMMAND_LIST } from 'components/js/command'
import { flowFilter } from 'components/js/utils'
import CommonMixin from 'components/mixins/CommonMixin'

export default {
  emits: ['select'],
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },
  mixins: [CommonMixin],
  data() {
    return {
      COMMAND_LIST: this.$_.cloneDeep(COMMAND_LIST),
      keyword: ''
    }
  },
  computed: {
    modalOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    },
    searchResult() {
      return flowFilter(this.COMMAND_LIST, this.keyword)
    }
  },
  methods: {
    getRange(range) {
      const [min, max] = range

      if (max) return `[ ${min}, ${max} ]`
      return `[ ${min} ]`
    }
  }
}
</script>

<style>
</style>