export const RESET_DATABASE = ({ commit }) => {
  commit("CLEAR_ALL");
  commit("CLEAR_THE_COMMAND");
};
