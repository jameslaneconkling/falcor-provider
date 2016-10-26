'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialState = {
  paths: [],
  jsonGraph: {}
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

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
//# sourceMappingURL=reducer.js.map