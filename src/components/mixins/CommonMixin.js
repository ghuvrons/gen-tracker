import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("db", ["loading", "darker"]),
    // color() {
    //   return this.darker ? "dark" : "white";
    // },
    // textColor() {
    //   return this.darker ? "light" : "white";
    // },
    darkerClass() {
      return this.darker ? "bg-dark text-white" : "bg-white text-black";
    },
  },
};
