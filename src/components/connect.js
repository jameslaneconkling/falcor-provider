import React, {
  Component,
  PropTypes
}                         from 'react';
import hoistStatics       from 'hoist-non-react-statics';

let id = 0;

export default (paths) => {
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

      updatePaths(paths) {
        this.context.updatePaths(this._id, paths);
      }

      removePaths() {
        this.context.removePaths(this._id);
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            falcor={this.context.falcor}
            paths={paths}
          />
        );
      }
    };

    FalcorConnect.contextTypes = {
      falcor: PropTypes.object,
      updatePaths: PropTypes.func,
      removePaths: PropTypes.func
    };

    return hoistStatics(FalcorConnect, WrappedComponent);
  };
};
