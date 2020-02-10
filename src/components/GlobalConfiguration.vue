<template>
  <div class="row justify-around">
    <q-btn
      class="q-ma-xs"
      icon="delete"
      color="negative"
      label="Clear all data"
      :disable="!units.length"
      @click="clearStore()"
    />
    <q-btn
      class="q-ma-xs"
      icon="add"
      color="positive"
      label="Generate fake unit"
      @click="generateFaker()"
    />
  </div>
</template>

<script>
import faker from 'faker'
import { generateUnits, generateReports, generateResponses, generateFingers } from 'components/js/faker'
import { mapState } from 'vuex'

export default {
  // name: 'ComponentName',
  computed: {
    ...mapState('database', ['units'])
  },
  methods: {
    generateFaker () {
      let excludes = this.units.map(el => el.unitID)
      // units
      let units = generateUnits(1, excludes)
      // add sub-data for each unit
      units.forEach((unit, i) => {
        // units
        this.$store.commit('database/ADD_UNITS', {
          ...unit,
          fake: true
        })
        // reports
        let reports = generateReports(faker.random.number(100), unit.unitID)
        reports.forEach(report => {
          this.$store.commit('database/ADD_REPORTS', report)
        })
        // responses
        let responses = generateResponses(faker.random.number(50), unit.unitID)
        responses.forEach(response => {
          this.$store.commit('database/ADD_RESPONSES', response)
        })
        // fingers
        let fingers = generateFingers(faker.random.number(5), unit.unitID)
        fingers.forEach(finger => {
          this.$store.commit('database/ADD_FINGERS', finger)
        })
      })

      // get unitIDs
      let unitIDs = units.map(el => el.unitID).toString()
      // show done message
      this.$q.notify({
        message: `New unit *${unitIDs}* with sample data succesfully generated`,
        type: 'positive',
        position: this.$q.platform.is.desktop ? 'bottom-right' : 'top-right'
      })
    },
    clearStore () {
      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure to remove all data?`,
          preventClose: true,
          cancel: true
        })
        .then(() => {
          // clear all the store
          this.$store.commit('database/CLEAR_ALL')
          // reset command input
          this.$root.$emit('setCommand', '')
        })
        .catch(() => { })
    }
  }
}
</script>

<style>
</style>
