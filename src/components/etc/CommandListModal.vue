<template>
  <q-modal
    v-model="modalOpen"
    :content-css="{ minWidth: '80vw', minHeight: '80vh' }"
  >
    <q-modal-layout>
      <q-toolbar slot="header">
        <q-btn flat round dense v-close-overlay icon="keyboard_arrow_left" />
        <q-toolbar-title>
          Command List
          <q-chip color="red" dense square>{{ COMMAND_LIST.length }}</q-chip>
        </q-toolbar-title>
      </q-toolbar>

      <q-toolbar slot="header">
        <q-search
          class="fit"
          inverted
          autofocus
          v-model="keyword"
          color="none"
        />
      </q-toolbar>

      <q-toolbar slot="footer">
        <q-toolbar-title class="q-pa-xs">
          <q-btn color="primary" @click="modalOpen = false" label="Close" />
        </q-toolbar-title>
      </q-toolbar>

      <div class="layout-padding">
        <q-list link separator>
          <q-item
            v-for="(el, i) in searchResult"
            :key="i"
            @click.native="$emit('select', el.command)"
          >
            <q-item-main>
              <q-item-tile label>{{ el.command }}</q-item-tile>
              <q-item-tile sublabel>{{ el.desc }}</q-item-tile>
            </q-item-main>
            <q-item-side right v-if="el.type">
              <q-item-tile>
                <q-chip dense square color="red">{{ el.type }}</q-chip>
              </q-item-tile>
              <q-item-tile>
                <q-chip dense square color="green">{{
                  getRange(el.range)
                }}</q-chip>
              </q-item-tile>
            </q-item-side>
          </q-item>
        </q-list>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import { COMMAND_LIST } from 'components/js/command'
import { FlowFilter } from 'components/js/helper'

export default {
  emits: ['select'],
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },
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
      return FlowFilter(this.COMMAND_LIST, this.keyword)
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