'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var id = 0;

exports.default = function (paths, mapStateToProps) {
  var mapUpdateToProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (dispatch, falcor, $updateGraph) {
    return { dispatch: dispatch, falcor: falcor, $updateGraph: $updateGraph };
  };

  return function (WrappedComponent) {
    var FalcorConnect = function (_Component) {
      _inherits(FalcorConnect, _Component);

      function FalcorConnect() {
        _classCallCheck(this, FalcorConnect);

        var _this = _possibleConstructorReturn(this, (FalcorConnect.__proto__ || Object.getPrototypeOf(FalcorConnect)).apply(this, arguments));

        _this._id = id++;
        return _this;
      }

      _createClass(FalcorConnect, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.updatePaths(paths);
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this.removePaths();
        }

        // TODO - paths should be optional

      }, {
        key: 'updatePaths',
        value: function updatePaths(paths) {
          this.context.updatePaths(this._id, paths);
        }
      }, {
        key: 'removePaths',
        value: function removePaths() {
          this.context.removePaths(this._id);
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(
            WrappedComponent,
            _extends({}, this.props, mapUpdateToProps(this.context.store.dispatch, this.context.falcor, this.context.updateGraph()), {
              updatePaths: this.updatePaths.bind(this),
              falcor: this.context.falcor,
              paths: this.context.componentPathMap[this._id]
            }),
            this.props.children
          );
        }
      }]);

      return FalcorConnect;
    }(_react.Component);

    ;

    FalcorConnect.contextTypes = {
      store: _react2.default.PropTypes.object,
      falcor: _react2.default.PropTypes.object,
      componentPathMap: _react2.default.PropTypes.object,
      updatePaths: _react2.default.PropTypes.func,
      removePaths: _react2.default.PropTypes.func,
      updateGraph: _react2.default.PropTypes.func
    };

    return (0, _reactRedux.connect)(mapStateToProps, {})(FalcorConnect);
  };
};
//# sourceMappingURL=connect.js.map