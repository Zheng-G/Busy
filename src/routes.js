var React = require('react'),
  ReactRouter = require('react-router'),
  Route = ReactRouter.Route,
  IndexRoute = ReactRouter.IndexRoute,
  Wrapper = require('./wrapper'),
  Settings = require('./app/settings'),
  About = require('./statics/About'),
  Team = require('./statics/Team'),
  Projects = require('./statics/Projects'),
  Jobs = require('./statics/Jobs'),
  Donate = require('./statics/Donate'),
  Help = require('./statics/Help'),
  Edit = require('./user/edit'),
  Replies = require('./user/replies'),
  Followers = require('./user/UserFollowersList'),
  Followed = require('./user/UserFollowedList'),
  Wallet = require('./user/wallet'),
  MessagesUser = require('./messages/MessagesUser').default,
  MessagesCategory = require('./messages/MessagesCategory').default,
  Write = require('./post/newPost/NewPost').default;

import Page from './feed/Page';
import UserProfile from './user/UserProfile';
import Profile from './user/profile';
import UserProfilePosts from './user/UserProfilePosts';
import UserProfileFeed from './user/UserProfileFeed';
import { Trending, Hot, Votes, Responses, Active, Created, Cashout } from './feed/PathMatching';
import PostSinglePage from './post/PostSinglePage';

export default (
  <Route path="/" component={Wrapper}>
    <IndexRoute component={Page} />
    <Route path="/settings" component={Settings} />

    <Route path="/about" component={About} />
    <Route path="/team" component={Team} />
    <Route path="/projects" component={Projects} />
    <Route path="/jobs" component={Jobs} />
    <Route path="/donate" component={Donate} />
    <Route path="/help" component={Help} />

    <Route path="/trending(/:category)" component={Trending} />
    <Route path="/hot(/:category)" component={Hot} />
    <Route path="/cashout(/:category)" component={Cashout} />
    <Route path="/created(/:category)" component={Created} />
    <Route path="/active(/:category)" component={Active} />
    <Route path="/responses(/:category)" component={Responses} />
    <Route path="/votes(/:category)" component={Votes} />

    <Route path="/write" component={Write} />

    <Route path="/messages/@:username" component={MessagesUser} />
    <Route path="/messages/:category" component={MessagesCategory} />

    <Route component={UserProfile}>
      <Route path="/profile/edit" component={Edit} />
      <Route path="/@:name/posts" component={UserProfilePosts} />
      <Route path="/@:name/feed" component={UserProfileFeed} />
      <Route path="/@:name/replies" component={Replies} />
      <Route path="/@:name/followers" component={Followers} />
      <Route path="/@:name/followed" component={Followed} />
      <Route path="/@:name/wallet" component={Wallet} />
      <Route path="/@:name" component={Profile} />
    </Route>

    <Route path="/:category/@:author/:permlink" component={ PostSinglePage } />
  </Route>
);
