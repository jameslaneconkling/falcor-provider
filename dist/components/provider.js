'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {};
// todo falcor_utils.collapse
var collapsePathMap = _ramda2.default.compose(_ramda2.default.unnest, _ramda2.default.filter(_ramda2.default.identity), _ramda2.default.values);

var FalcorProvider = function (_Component) {
  _inherits(FalcorProvider, _Component);

  function FalcorProvider() {
    _classCallCheck(this, FalcorProvider);

    var _this = _possibleConstructorReturn(this, (FalcorProvider.__proto__ || Object.getPrototypeOf(FalcorProvider)).apply(this, arguments));

    _this._componentPathMap = {};
    return _this;
  }

  _createClass(FalcorProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        falcor: this.props.falcor,
        componentPathMap: this._componentPathMap,
        updatePaths: this.updatePaths.bind(this),
        removePaths: this.removePaths.bind(this),
        updateGraph: this.updateGraph.bind(this)
      };
    }
  }, {
    key: 'updatePaths',
    value: function updatePaths(id, paths) {
      this._componentPathMap[id] = paths;
      this.persistPaths2Store(collapsePathMap(this._componentPathMap));
    }
  }, {
    key: 'removePaths',
    value: function removePaths(id) {
      delete this._componentPathMap[id];
      this.persistPaths2Store(collapsePathMap(this._componentPathMap));
    }
  }, {
    key: 'persistPaths2Store',
    value: function persistPaths2Store(paths) {
      // TODO - debounce
      var _props = this.props,
          falcor = _props.falcor,
          store = _props.store;

      store.dispatch({
        type: 'falcor-provider/UPDATE_PATHS',
        paths: paths
      });

      this.updateGraph().subscribe();
    }
  }, {
    key: 'updateGraph',
    value: function updateGraph() {
      var _props2 = this.props,
          falcor = _props2.falcor,
          store = _props2.store;


      return falcor.get.apply(falcor, _toConsumableArray(collapsePathMap(this._componentPathMap))).tapOnNext(function (res) {
        return store.dispatch({
          type: 'falcor-provider/UPDATE_GRAPH',
          jsonGraph: res.json
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react.Children.only(this.props.children);
    }
  }]);

  return FalcorProvider;
}(_react.Component);

;

FalcorProvider.childContextTypes = {
  falcor: _react2.default.PropTypes.object,
  componentPathMap: _react2.default.PropTypes.object,
  updatePaths: _react2.default.PropTypes.func,
  removePaths: _react2.default.PropTypes.func,
  updateGraph: _react2.default.PropTypes.func
};

FalcorProvider.propTypes = {
  falcor: _react2.default.PropTypes.object.isRequired,
  store: _react2.default.PropTypes.object.isRequired
};

exports.default = FalcorProvider;
//# sourceMappingURL=provider.js.map