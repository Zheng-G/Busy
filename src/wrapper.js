import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { GatewayProvider, GatewayDest } from 'react-gateway';
import { login } from './auth/authActions';
import { getConfig, getRate } from './actions';
import { getStoredBookmarks } from './bookmarks/bookmarksActions';
import { notify } from './app/Notification/notificationActions';
import Notification from './app/Notification/Notification';
import Sidebar from './app/Sidebar';
import getMessageWithLocale from './translations/Translations';
import * as reblogActions from './app/Reblog/reblogActions';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    login,
    getConfig,
    notify,
    getRate,
    getStoredBookmarks,
    getRebloggedList: reblogActions.getRebloggedList,
  }, dispatch)
)
export default class Wrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.login();
    this.props.getConfig();
    this.props.getStoredBookmarks();
    this.props.getRebloggedList();
    this.props.getRate();
  }

  render() {
    const { app, auth, notify } = this.props;
    const { messages, locale } = getMessageWithLocale(app.locale);
    const className = (!app.sidebarIsVisible) ? 'app-wrapper full-width' : 'app-wrapper';
    return (
      <IntlProvider locale={locale} messages={messages}>
        <GatewayProvider>
          <div className={className}>
            <Sidebar />
            <Notification />
            { React.cloneElement(
              this.props.children,
              { auth, notify }
            )}
            <GatewayDest name="tooltip" />
            <GatewayDest name="popover" />
            <GatewayDest name="modal" />
          </div>
        </GatewayProvider>
      </IntlProvider>
    );
  }
}
