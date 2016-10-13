import React from 'react';
import ReduxInfiniteScroll from 'redux-infinite-scroll';
import Loading from './../widgets/Loading';
import AddPost from './../post/newPost/EmbeddedNewPost';
import PostFeedItem from '../post/PostFeedItem';
import CommentForm from './../comments/CommentForm';

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeComment: {}
    };
  }

  componentDidMount() {
    this.props.loadContent();
    this.initializeListener();
  }

  componentWillUnmount() {
    this.removeListener();
  }

  initializeListener() {
    if (window) {
      window.addEventListener('scroll', this.onScroll);
    }
  }

  removeListener() {
    if (window) {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  onScroll = () => {
    /**
     * disable comment box on scroll and remove listener to avoid re-execution of function
     */
    this.removeListener();
    this.setState({ activeComment: {} });
  };

  handleCommentRequest(e) {
    this.setState({ activeComment: e });
    this.initializeListener();
  }

  handleFeedClick() {
    this.setState({ activeComment: {} });
  }

  render() {
    const { content, isFetching, hasMore, ItemComponent } = this.props;
    const { activeComment } = this.state;

    return (
      <div className="grid">
        <div className="grid-content" onClick={() => this.handleFeedClick()}>

          <ReduxInfiniteScroll
            loadMore={this.props.loadMoreContent}
            loader={<Loading />}
            loadingMore={isFetching}
            hasMore={hasMore}
            elementIsScrollable={false}
            threshold={200}
          >
            {
              content.map((entry, key) =>
                <ItemComponent
                  key={key}
                  entry={entry}
                  replies={this.props.replies}
                  onCommentRequest={e => this.handleCommentRequest(e)}
                />
              )
            }
          </ReduxInfiniteScroll>
        </div>

        <AddPost />
        <CommentForm
          open={Object.keys(activeComment).length !== 0}
          parentAuthor={activeComment.parentAuthor}
          parentPermlink={activeComment.parentPermlink}
          author={activeComment.author}
          permlink={activeComment.permlink}
        />
      </div>
    );
  }
}
Feed.defaultProps = {
  ItemComponent: PostFeedItem
};
