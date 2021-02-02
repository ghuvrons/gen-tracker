const dummyData = require("assets/tracking-20210202144918.json");

export default {
  data() {
    return {
      dummyIndex: dummyData.length - 1,
    };
  },
  methods: {
    dummyImport() {
      if (this.dummyIndex) this.importReport([dummyData[this.dummyIndex--]]);
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
