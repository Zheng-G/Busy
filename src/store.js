/* global window */
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import api from './steemAPI';

import MessagesWorker, { messagesReducer } from './messages';
import appReducers from './app/appReducers';
import authReducers from './auth/authReducers';
import commentsReducer from './comments/commentsReducer.js';
import feedReducers from './feed/feedReducers';
import postsReducers from './post/postsReducers';
import userProfileReducer from './user/userReducer';
import notificationReducer from './app/Notification/notificationReducers';
import bookmarksReducer from './Bookmarks/bookmarksReducer';
import favoritesReducer from './app/Favorites/favoritesReducer';
import { responsiveReducer, mountResponsive } from './helpers/responsive';

export const messagesWorker = new MessagesWorker();

if (process.env.NODE_ENV !== 'production') {
  window.steemAPI = api;
}

const reducers = combineReducers({
  app: appReducers,
  auth: authReducers,
  comments: commentsReducer,
  posts: postsReducers,
  feed: feedReducers,
  userProfile: userProfileReducer,
  responsive: responsiveReducer,
  messages: messagesReducer,
  notifications: notificationReducer,
  bookmarks: bookmarksReducer,
  favorites: favoritesReducer,
});

const middleware = [
  promiseMiddleware({
    promiseTypeSuffixes: [
      'START',
      'SUCCESS',
      'ERROR',
    ]
  }),
  thunk.withExtraArgument({
    messagesWorker,
    steemAPI: api,
  }),
];

if (process.env.ENABLE_LOGGER &&
    process.env.IS_BROWSER &&
    process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger({
    collapsed: true,
    duration: true,
    stateTransformer: state => JSON.parse(JSON.stringify(state))
  }));
}

const store = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(...middleware)
);

mountResponsive(store);
messagesWorker.attachToStore(store);
messagesWorker.start();

export default store;
