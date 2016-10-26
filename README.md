# Falcor Provider

Redux provider to connect your Falcor graph to your Redux store.

## Install
```bash
npm install --save falcor-provider
```

## Usage

Redux Provider follows a very similar pattern to Redux, using [Provider](//github.com/jameslaneconkling/falcor-provider/blob/master/src/components/provider.js) and [connect](//github.com/jameslaneconkling/falcor-provider/commit/24193313026c52acf6742ddbe2b69c53de361198) higher order components to connect components to the Falcor cache, and Falcor to the Redux store.

**To use**

1. wrap your app in the Provider component, passing it the redux `store` and falcor `model`:

```javascript
import { render }             from 'react-dom';
import {
  createStore,
  combineReducers
}                             from 'redux';
import { Provider }           from 'react-redux';
import {
  Provider as FalcorProvider
  reducer as falcorReducer,
}                             from 'falcor-provider';
import App                    from './components/app.jsx';
import model                  from './falcor/model';


const store = createStore(combineReducers({
  falcor: falcorReducer,
}));

render((
  <Provider store={store}>
    <FalcorProvider falcor={model} store={store}>
      <App />
    </FalcorProvider>
  </Provider>
), document.getElementById('app'));
```

2. wrap your component in the connect component, passing it a `paths` property, similar to react-redux, optional `mapStateToProps` and `mapUpdateToProps` functions.

```javascript
import React                 from 'react';
import {
  connect as falcorConnect
}                            from 'falcor-provider';
import FolderList            from '../components/folder-list.jsx';


const FolderListContainer = React.createClass({
  paginateList() {
    const {from, to} = this.props.paths[1][1];
    this.props.updatePaths([
      ['folderList', 'length'],
      ['folderList', {from: from + 5, to: to + 5}, ['id', 'name', 'parentId']]
    ]);
  },

  render() {
    return (
      <div>
        <FolderList
          folders={this.props.folderList}
          length={this.props.folderListLength}
          deleteFolder={this.props.deleteFolder}
        />
        <button onClick={this.paginateList}>paginate</button>
      </div>
    );
  }
});

const paths = [
  ['folderList', 'length'],
  ['folderList', {from: 0, to: 5}, ['id', 'name', 'parentId']]
];

const mapStateToProps = state => ({
  folderList: state.falcor.jsonGraph ? state.falcor.jsonGraph.folderList.length : null,
  folderListLength: state.falcor.jsonGraph ? state.falcor.jsonGraph.folderList : []
});

const mapUpdateToProps = (dispatch, falcor, $updateGraph) => ({
  deleteFolder: (folderId) => {
    dispatch({type: 'DELETE_FOLDER_REQUEST', value: folderId})

    falcor
      .call(['foldersById', folderId, 'delete'])
      .tapOnCompleted(() => {
        falcor.invalidate(['folderList']);
      })
      .concat($updateGraph)
      .subscribe(() => {}, err => {
        dispatch({type: 'DELETE_FOLDER_ERROR', message: err});
      }, () => {
        dispatch({type: 'DELETE_FOLDER_SUCCESS', value: folderId});
      });
  }
});

export default falcorConnect(
  paths,
  mapStateToProps,
  mapUpdateToProps
)(FolderListContainer);
```

Internally, falcor connect wraps redux connect, so `mapStateToProps` should work exactly as it does with redux connect.  `mapUpdateToProps` works like react-redux's `mapDispatchToProps`, except it passes additional `falcor` and `$updateGraph` properties (explained below).


## Component Paths

Falcor Provider tracks the shape of the app's falcor graph by collapsing all paths defined on each connected component.  To define a component's paths value, pass an array of falcor [pathSets](http://netflix.github.io/falcor/doc/global.html#PathSet), e.g. in the above example:

```javascript
[
  ['folderList', 'length'],
  ['folderList', {from: 0, to: 5}, ['id', 'name', 'parentId']]
]
```

This collapsed list of pathSets is stored in the redux store under the `falcor.paths` keys, and is updated internally via the `falcor-provider/UPDATE_PATHS` action.  This makes retrieving the graph's current expanded state as easy as:

```javascript
falcor.get(store.getState().falcor.paths);
```

The Falcor Provider connect function injects the `paths` property and an `updatePaths()` function.  Together these can modify the shape of the app's graph, for example to paginate a list.

```javascript
paginateList() {
  const {from, to} = this.props.paths[1][1];
  this.props.updatePaths([
    ['folderList', 'length'],
    ['folderList', {from: from + 5, to: to + 5}, ['id', 'name', 'parentId']]
  ]);
},
```


## List Invalidation

Because falcor `CREATE` and `DELETE` calls often leave the falcor cache in a temporarily inconsistent state, Falcor Provider exposes a mechanism to manually refresh the app.  For example, if the falcor router response to a resource `DELETE` call does not automatically invalidate or replace all lists that that resource appears in, the graph will be in an inconsistent state until the client manually handles the list invalidation.  The `$updateGraph` third argument to `mapUpdateToProps` is a cold observable stream that will update the store with falcor graph's current expanded state when subscribed to, after resolving invalidations.

For example, the following action creator will delete a resource, invalidate the list it depended on, and only update the falcor store once the app returns to a consistent state:

```javascript
const mapUpdateToProps = (dispatch, falcor, $updateGraph) => ({
  deleteFolder: (folderId) => {
    dispatch({type: 'DELETE_FOLDER_REQUEST', value: folderId})

    falcor
      .call(['foldersById', folderId, 'delete'])
      .tapOnCompleted(() => {
        falcor.invalidate(['folderList']);
      })
      .concat($updateGraph)
      .subscribe(() => {}, err => {
        dispatch({type: 'DELETE_FOLDER_ERROR', message: err});
      }, () => {
        dispatch({type: 'DELETE_FOLDER_SUCCESS', value: folderId});
      });
  }
});
```

Or, if you prefer to work with promises:

```javascript
const mapUpdateToProps = (dispatch, falcor, $updateGraph) => ({
  deleteFolder: (folderId) => {
    dispatch({type: 'DELETE_FOLDER_REQUEST', value: folderId})

    falcor
      .call(['foldersById', folderId, 'delete'])
      .then(() => {
        // handle invalidations
        falcor.invalidate(['folderList']);

        // update graph
        return $updateGraph.toPromise();
      })
      .then(() => {
        dispatch({type: 'DELETE_FOLDER_SUCCESS', value: folderId});
      })
      .catch(err => {
        dispatch({type: 'DELETE_FOLDER_ERROR', message: err});
      });
  }
});
```

---

Falcor Provider is a work in progress.  Feedback, bugs, and PRs welcome.


