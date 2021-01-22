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
          <q-chip color="red" dense square>{{ commandList.length }}</q-chip>
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

              <q-item-tile v-if="el.type" sublabel>
                <q-chip dense square color="red">
                  {{ el.type }}
                </q-chip>
              </q-item-tile>
              <q-item-tile v-if="el.range" sublabel>
                <q-chip dense square color="green">
                  {{ el.range }}
                </q-chip>
              </q-item-tile>
            </q-item-main>
            <!-- <q-item-side right v-if="el.type">
              <q-item-tile>
                <q-chip dense square color="blue">{{ el.type }}</q-chip>
              </q-item-tile>
              <q-item-tile>
                <q-chip dense square color="blue">{{ el.range }}</q-chip>
              </q-item-tile>
            </q-item-side> -->
          </q-item>
        </q-list>
      </div>
    </q-modal-layout>
  </q-modal>
</template>

<script>
import { FlowFilter } from 'components/js/helper'

export default {
  props: {
    value: {
      required: true,
      type: Boolean
    },
    commandList: {
      required: true,
      type: Array
    }
  },
  emits: ['select'],
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    searchResult() {
      return FlowFilter(this.commandList, this.keyword)
    },
    modalOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style>
</style>