import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './../app/header';
import {
  getFeedContent,
  getMoreFeedContent,
  getUserFeedContent,
  getMoreUserFeedContent,
} from './../feed/feedActions';

@connect(
  state => ({
    feed: state.feed,
    posts: state.posts,
  }),
  dispatch => bindActionCreators({
    getFeedContent,
    getMoreFeedContent,
  }, dispatch)
)
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { auth, feed, posts, getFeedContent, getMoreFeedContent } = this.props;
    const account = auth.user && auth.user.name;

    return (
      <div className="main-panel">
        { auth.isFetching ?
          <div>
            <Header account={account} />
            <h1>Logging in...</h1>
          </div>
          :
          <div>
            <Header account={account} />
            { React.cloneElement(
              this.props.children,
              {
                feed,
                posts,
                getFeedContent,
                getMoreFeedContent,
                limit: 10,
                auth
              }
            ) }
          </div>
        }
      </div>
    );
  }
}
