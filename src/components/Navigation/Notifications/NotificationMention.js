import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router';
import Avatar from '../../Avatar';

const NotificationMention = ({ onClick, id, read, date, payload }) =>
  <div
    onClick={() => onClick(id)}
    className={
      classNames('Notifications__notification', {
        'Notifications__notification--unread': !read,
      })
    }
  >
    <Avatar username="guest123" size={40} />
    <div className="Notifications__notification__text">
      <div className="Notifications__notification__text__message">
        <Link to={`/${payload.user}`}>{payload.user}</Link> mentioned you on his <Link to={payload.post_url}>post</Link>.
      </div>
      <div className="Notifications__notification__text__date">
        <FormattedRelative value={date} />
      </div>
    </div>
  </div>;

NotificationMention.propTypes = {
  onClick: PropTypes.func,
  id: PropTypes.number,
  read: PropTypes.bool,
  date: PropTypes.string,
  payload: PropTypes.shape(),
};

NotificationMention.defaultProps = {
  onClick: () => {},
};

export default NotificationMention;
