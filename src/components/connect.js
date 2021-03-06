import React, {
  Component
}                         from 'react';
import { connect }        from 'react-redux';

let id = 0;

export default (
  paths,
  mapStateToProps,
  mapUpdateToProps = (dispatch, falcor, updateGraph$) => ({dispatch, falcor, updateGraph$})
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
        return (
          <WrappedComponent
            {...this.props}
            {...mapUpdateToProps(this.context.store.dispatch, this.context.falcor, this.context.updateGraph())}
            updatePaths={this.updatePaths.bind(this)}
            paths={this.context.componentPathMap[this._id]}
          >
            {this.props.children}
          </WrappedComponent>
        );
      }
    }

    FalcorConnect.contextTypes = {
      store: React.PropTypes.object,
      falcor: React.PropTypes.object,
      componentPathMap: React.PropTypes.object,
      updatePaths: React.PropTypes.func,
      removePaths: React.PropTypes.func,
      updateGraph: React.PropTypes.func
    };

    return connect(mapStateToProps, {})(FalcorConnect);
  };
};
