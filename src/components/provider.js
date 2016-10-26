import React,
{
  Component,
  Children
}              from 'react';
import R       from 'ramda';

const noop = () => {};
// todo falcor_utils.collapse
const collapsePathMap = R.compose(
  R.unnest,
  R.filter(R.identity),
  R.values
);

class FalcorProvider extends Component {
  constructor() {
    super(...arguments);
    this._componentPathMap = {};
  }

  getChildContext() {
    return {
      falcor: this.props.falcor,
      componentPathMap: this._componentPathMap,
      updatePaths: this.updatePaths.bind(this),
      removePaths: this.removePaths.bind(this),
      updateGraph: this.updateGraph.bind(this)
    };
  }

  updatePaths(id, paths) {
    this._componentPathMap[id] = paths;
    this.persistPaths2Store(collapsePathMap(this._componentPathMap));
  }

  removePaths(id) {
    delete this._componentPathMap[id];
    this.persistPaths2Store(collapsePathMap(this._componentPathMap));
  }

  persistPaths2Store(paths) {
    // TODO - debounce
    const {falcor, store} = this.props;
    store.dispatch({
      type: 'falcor-provider/UPDATE_PATHS',
      paths: paths
    });

    this.updateGraph().subscribe();
  }

  updateGraph() {
    const {falcor, store} = this.props;

    return falcor.get(...collapsePathMap(this._componentPathMap))
      .tapOnNext(res => store.dispatch({
        type: 'falcor-provider/UPDATE_GRAPH',
        jsonGraph: res.json
      }));
  }

  render() {
    return Children.only(this.props.children);
  }
};

FalcorProvider.childContextTypes = {
  falcor: React.PropTypes.object,
  componentPathMap: React.PropTypes.object,
  updatePaths: React.PropTypes.func,
  removePaths: React.PropTypes.func,
  updateGraph: React.PropTypes.func
};

FalcorProvider.propTypes = {
  falcor: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired
};

export default FalcorProvider;
