export default (
  state = {
    paths: [],
    jsonGraph: {}
  },
  action
) => {
  switch (action.type) {
    case 'falcor-provider/UPDATE_PATHS':
      return {
        ...state,
        paths: action.paths
      };
    case 'falcor-provider/UPDATE_GRAPH':
      return {
        ...state,
        jsonGraph: action.jsonGraph
      };
    default:
      return state;
  }
};
