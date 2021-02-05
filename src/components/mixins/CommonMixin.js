import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("db", ["loading", "darker"]),
    darkerClass() {
      return this.darker ? "bg-dark text-white" : "bg-white text-grey-9";
    },
  },
};
