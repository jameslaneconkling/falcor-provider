const initialState = {
  paths: [],
  jsonGraph: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'falcor-provider/UPDATE_PATHS':
      return Object.assign({}, state, {
        paths: action.paths
      });
    case 'falcor-provider/UPDATE_GRAPH':
      return Object.assign({}, state, {
        jsonGraph: action.jsonGraph
      });
    default:
      return state;
  }
};
