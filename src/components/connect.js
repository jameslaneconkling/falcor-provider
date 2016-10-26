import React, {
  Component,
  PropTypes
}                         from 'react';
import { connect }        from 'react-redux';

let id = 0;

export default (
  paths,
  mapStateToProps,
  mapUpdateToProps = (dispatch, $updateGraph) => ({dispatch, $updateGraph})
) => {
  return (WrappedComponent) => {
    class FalcorConnect extends Component {
      constructor() {
        super(...arguments);
        this._id = id++;
      }

      componentDidMount() {
        this.updatePaths(paths);
      }

      componentWillUnmount() {
        this.removePaths();
      }

      // TODO - paths should be optional
      updatePaths(paths) {
        this.context.updatePaths(this._id, paths);
      }

      removePaths() {
        this.context.removePaths(this._id);
      }

      render() {
        return React.createElement(WrappedComponent, Object.assign(
          {},
          this.props,
          mapUpdateToProps(this.context.store.dispatch, this.context.updateGraph()),
          {
            updatePaths: this.updatePaths.bind(this),
            falcor: this.context.falcor,
            paths: this.context.componentPathMap[this._id]
          }
        ), this.props.children);
      }
    };

    FalcorConnect.contextTypes = {
      store: PropTypes.object,
      falcor: PropTypes.object,
      componentPathMap: PropTypes.object,
      updatePaths: PropTypes.func,
      removePaths: PropTypes.func,
      updateGraph: PropTypes.func
    };

    return connect(mapStateToProps, {})(FalcorConnect);
  };
};
