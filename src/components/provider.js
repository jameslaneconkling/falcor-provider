import {
  Component,
  PropTypes,
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
    const {falcor, store} = this.props;
    const originalOnChange = falcor._root.onChange || noop;

    falcor._root.onChange = () => {
      console.log('provider update graph');
      originalOnChange();

      // TODO - expose subscribe method to all connected components?  and dispose of it automatically?
      falcor.get(...collapsePathMap(this._componentPathMap))
        .subscribe(res => {
          store.dispatch({
            type: 'falcor-provider/UPDATE_GRAPH',
            jsonGraph: res.json
          });
        });
    }
  }

  getChildContext() {
    return {
      falcor: this.props.falcor,
      updatePaths: this.updatePaths.bind(this),
      removePaths: this.removePaths.bind(this)
    };
  }

  updatePaths(id, paths) {
    this._componentPathMap = Object.assign({}, this._componentPathMap, {id: paths});
    this.persistPaths2Store(collapsePathMap(this._componentPathMap));
  }

  removePaths(id) {
    // TODO - better to just mutate paths w/ delete?
    this._componentPathMap = Object.assign({}, this._componentPathMap, {id: null});
    this.persistPaths2Store(collapsePathMap(this._componentPathMap));
  }

  persistPaths2Store(paths) {
    // TODO - debounce
    const {falcor, store} = this.props;
    store.dispatch({
      type: 'falcor-provider/UPDATE_PATHS',
      paths: paths
    });

    falcor.get(...paths).subscribe();
  }

  render() {
    return Children.only(this.props.children);
  }
};

FalcorProvider.childContextTypes = {
  falcor: PropTypes.object,
  updatePaths: PropTypes.func,
  removePaths: PropTypes.func
};

FalcorProvider.propTypes = {
  falcor: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

export default FalcorProvider;
