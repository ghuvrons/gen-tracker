const dummyData = require("assets/tracking-20210202144918.json");

export default {
  data() {
    return {
      dummyIndex: 0,
    };
  },
  methods: {
    dummyImport() {
      this.importReport([dummyData[this.dummyIndex++]]);
    },
  },
  timers: {
    dummyImport: {
      time: 1000,
      repeat: true,
      autostart: true,
    },
  },
};
