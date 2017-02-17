import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { SimpleTooltipOrigin } from '../tooltip/SimpleTooltip';
import { showSidebar } from '../actions';
import Icon from '../widgets/Icon';
import './Header.scss';

@connect(
  state => ({
    app: state.app,
    auth: state.auth,
  }),
  dispatch => bindActionCreators({
    showSidebar: showSidebar,
  }, dispatch)
)
export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    showSidebar: PropTypes.func,
    title: PropTypes.string,
  };

  render() {
    return (
      <header>
        <div className="top-nav">
          {!this.props.app.sidebarIsVisible &&
            <a className="left ml-2" onClick={() => this.props.showSidebar()}>
              <Icon name="menu" className="Icon--menu" />
            </a>
          }
          <div className="Header__title">
            {this.props.title}
          </div>
          <div className="section-content top-head">
            <div className="logo">
              <Link to="/" onlyActiveOnIndex activeClassName="active">
                <img src="/img/logo.svg" />
              </Link>
            </div>
          </div>
          {this.props.auth.isAuthenticated ?
            <div className="right mr-2">
              <SimpleTooltipOrigin message="Write">
                <Link to="/write">
                  <Icon name="add" className="Icon--menu" />
                </Link>
              </SimpleTooltipOrigin>

              <SimpleTooltipOrigin message="Bookmarks">
                <Link to="/bookmarks">
                  <Icon name="bookmarks" className="Icon--menu" />
                </Link>
              </SimpleTooltipOrigin>

              <SimpleTooltipOrigin message="Help">
                <Link to="/help">
                  <Icon name="help_outline" className="Icon--menu" />
                </Link>
              </SimpleTooltipOrigin>
            </div>
            :
            <div className="right mr-2">
              <SimpleTooltipOrigin message="Help">
                <Link to="/help">
                  <Icon name="help_outline" className="Icon--menu" />
                </Link>
              </SimpleTooltipOrigin>
            </div>
          }
        </div>

        {this.props.children &&
          <div className="app-nav">
            {this.props.children}
          </div>
        }
      </header>
    );
  }
}

