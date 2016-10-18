var api = require('./steemAPI');

export const CONFIG_REQUEST = 'CONFIG_REQUEST';
export const CONFIG_SUCCESS = 'CONFIG_SUCCESS';
export const CONFIG_FAILURE = 'CONFIG_FAILURE';

export const FEED_REQUEST = 'FEED_REQUEST';
export const FEED_SUCCESS = 'FEED_SUCCESS';
export const FEED_FAILURE = 'FEED_FAILURE';
export const CONTENT_REQUEST = 'CONTENT_REQUEST';
export const CONTENT_SUCCESS = 'CONTENT_SUCCESS';
export const ACCOUNT_REQUEST = 'ACCOUNT_REQUEST';
export const ACCOUNT_SUCCESS = 'ACCOUNT_SUCCESS';

export const SHOW_SIDEBAR = 'SHOW_SIDEBAR';
export const HIDE_SIDEBAR = 'HIDE_SIDEBAR';
export const SET_MENU = 'SET_MENU';

module.exports = {
  getConfig: function() {
    return function(dispatch, getState) {
      var req = {type: CONFIG_REQUEST};
      dispatch(req);
      api.getConfig(function(err, config) {
        var res = {
          type: CONFIG_SUCCESS,
          config: config,
        };
        dispatch(res);
      });
    };
  },
  showSidebar: function() {
    return function(dispatch, getState) {
      dispatch({type: SHOW_SIDEBAR});
    };
  },
  hideSidebar: function() {
    return function(dispatch, getState) {
      dispatch({type: HIDE_SIDEBAR});
    };
  },
  setMenu: function(menu) {
    return function(dispatch, getState) {
      dispatch({type: SET_MENU, menu: menu});
    };
  }
};
