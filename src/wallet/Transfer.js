import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import steemConnect from 'sc2-sdk';
import { Form, Input, Radio, Modal } from 'antd';
import './Transfer.less';

import { closeTransfer } from './walletActions';
import { getAuthenticatedUser } from '../reducers';

@injectIntl
@connect(state => ({
  visible: state.wallet.transferVisible,
  to: state.wallet.transferTo,
  user: getAuthenticatedUser(state),
}), {
  closeTransfer,
})
@Form.create()
export default class Transfer extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    visible: PropTypes.bool,
    to: PropTypes.string,
    user: PropTypes.shape().isRequired,
    form: PropTypes.shape().isRequired,
    closeTransfer: PropTypes.func,
  };

  static defaultProps = {
    to: '',
    visible: false,
    closeTransfer: () => {},
  };

  state = {
    currency: 'STEEM',
  };

  componentWillReceiveProps(nextProps) {
    const { form, to } = nextProps;
    if (this.props.to !== to) {
      form.setFieldsValue({
        to,
        amount: undefined,
        currency: 'STEEM',
        memo: undefined,
      });
      this.setState({
        currency: 'STEEM',
      });
    }
  }

  handleBalanceClick = (event) => {
    this.props.form.setFieldsValue({
      amount: parseFloat(event.currentTarget.innerText),
    });
  }

  handleCurrencyChange = (event) => {
    const { form } = this.props;
    this.setState({ currency: event.target.value }, () => form.validateFields(['amount'], { force: true }));
  };

  handleContinueClick = () => {
    const { form } = this.props;
    form.validateFields({ force: true }, (errors, values) => {
      if (!errors) {
        const transferQuery = {
          to: values.to,
          amount: `${values.amount} ${values.currency}`,
        };
        if (values.memo) transferQuery.memo = values.memo;

        const win = window.open(steemConnect.sign('transfer', transferQuery), '_blank');
        win.focus();
        this.props.closeTransfer();
      }
    });
  }

  handleCancelClick = () => this.props.closeTransfer();

  validateBalance = (rule, value, callback) => {
    const { intl, user } = this.props;

    const currentValue = parseFloat(value);
    const selectedBalance = this.state.currency === 'STEEM' ? user.balance : user.sbd_balance;

    if (currentValue !== 0 && currentValue > parseFloat(selectedBalance)) {
      callback([
        new Error(intl.formatMessage({ id: 'amount_error_funds', defaultMessage: 'Insufficient funds.' })),
      ]);
    } else {
      callback();
    }
  }

  render() {
    const { intl, visible, user } = this.props;
    const { getFieldDecorator } = this.props.form;

    const balance = this.state.currency === 'STEEM' ? user.balance : user.sbd_balance;

    const currencyPrefix = getFieldDecorator('currency', {
      initialValue: this.state.currency,
    })(
      <Radio.Group onChange={this.handleCurrencyChange}>
        <Radio.Button value="STEEM">STEEM</Radio.Button>
        <Radio.Button value="SBD">SBD</Radio.Button>
      </Radio.Group>,
    );

    return (
      <Modal
        visible={visible}
        title={intl.formatMessage({ id: 'transfer_modal_title', defaultMessage: 'Transfer funds' })}
        okText={intl.formatMessage({ id: 'continue', defaultMessage: 'Continue' })}
        cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
        onOk={this.handleContinueClick}
        onCancel={this.handleCancelClick}
      >
        <Form className="Transfer container">
          <Form.Item label={<FormattedMessage id="to" defaultMessage="To" />}>
            {getFieldDecorator('to', {
              rules: [{ required: true, message: intl.formatMessage({ id: 'to_error_empty', defaultMessage: 'Recipient is required.' }) }],
            })(<Input
              type="text"
              placeholder={intl.formatMessage({ id: 'to_placeholder', defaultMessage: 'Payment recipient' })}
            />)}
          </Form.Item>
          <Form.Item label={<FormattedMessage id="amount" defaultMessage="Amount" />}>
            {getFieldDecorator('amount', {
              rules: [
                { required: true, message: intl.formatMessage({ id: 'amount_error_empty', defaultMessage: 'Amount is required.' }) },
                {
                  pattern: /^[0-9]*\.?[0-9]{0,3}$/,
                  message: intl.formatMessage({
                    id: 'amount_error_format',
                    defaultMessage: 'Incorrect format. Use comma or dot as decimal separator. Use at most 3 decimal places.',
                  }),
                },
                { validator: this.validateBalance },
              ],
            })(<Input
              addonAfter={currencyPrefix}
              placeholder={intl.formatMessage({ id: 'amount_placeholder', defaultMessage: 'How much do you want to send' })}
              style={{ width: '100%' }}
            />)}
            <FormattedMessage
              id="balance_amount"
              defaultMessage="Your balance: {amount}"
              values={{
                amount: <span role="presentation" onClick={this.handleBalanceClick} className="balance">{balance}</span>,
              }}
            />
          </Form.Item>
          <Form.Item label={<FormattedMessage id="memo" defaultMessage="Memo" />}>
            {getFieldDecorator('memo')(<Input.TextArea
              rows={3}
              placeholder={intl.formatMessage({ id: 'memo_placeholder', defaultMessage: 'Additional message to include in this payment (optional)' })}
            />)}
          </Form.Item>
        </Form>
        <FormattedMessage id="transfer_modal_info" defaultMessage="Click the button below to be redirected to SteemConnect to complete your transaction." />
      </Modal>
    );
  }
}
