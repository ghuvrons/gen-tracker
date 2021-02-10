import { mapState, mapMutations } from "vuex";
import { SET_LOADING } from "src/store/common/mutation-types";

export default {
  computed: {
    ...mapState("common", ["loading"]),
  },
  methods: {
    ...mapMutations("common", [SET_LOADING]),
  },
};
