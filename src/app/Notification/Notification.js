import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from '../../widgets/Icon';
import './Notification.scss';

@connect(
  state => ({
    notifications: state.notifications,
  })
)
export default class Notification extends Component {
  render() {
    return (
      <div className="NotificationHolder">
        {this.props.notifications.map(({ text, context = 'info' }, i) =>
          <div key={`${i}-${text}-${context}`} className={`Notification ${context}`}>
            <h3>
              {context === 'success' &&
                <Icon name="check" className="mr-2" />
              }
              {context === 'error' &&
                <Icon name="warning" className="mr-2" />
              }
              {text}
            </h3>
          </div>
        )
        }
      </div>
    );
  }
}
