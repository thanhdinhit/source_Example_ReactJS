import React, { PropTypes } from 'react'
import RS, { Option } from '../../../resources/resourceManager';
import DialogConfirm from '../../elements/DialogConfirm';
import { FIXNUMBER_PAYRATE } from '../../../core/common/constants';

const DialogPayRate = React.createClass({
    propTypes: {
        label: PropTypes.array,
        handleSubmit: PropTypes.func.isRequired,
        oldValue: PropTypes.string,
        newValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) ,
        handleCancel: PropTypes.func,
        isOpen: PropTypes.bool
    },

    handleSubmit: function () {
        this.props.handleSubmit();
    },
    handleCancel: function () {
        this.props.handleCancel();
    },
    render: function () {
        const payRateChange = this.props.newValue - this.props.oldValue;
        return (
            <DialogConfirm
                title={RS.getString('CHANGE_PAY_RATE', null, Option.UPPER)}
                isOpen={this.props.isOpen}
                handleSubmit={this.handleSubmit}
                handleClose={this.handleCancel}
                label={this.props.label}
            >
                <div className="dialog-change-pay-rate">
                    <div className="old-value">
                        <span>{RS.getString('OLD_VALUE')}</span>
                        <span>{this.props.oldValue}</span>
                    </div>
                    <div className="new-value">
                        <span>{RS.getString('NEW_VALUE')}</span>
                        <span>{this.props.newValue}</span>
                    </div>
                    <div className={"change"}>
                        <span>{RS.getString('CHANGE')}</span>
                        <span className={(payRateChange < 0 ? 'decrease' : 'increase')}>
                            {payRateChange < 0 ? '' : '+'}{payRateChange.toFixed(FIXNUMBER_PAYRATE)}
                        </span>
                    </div>
                </div>
            </DialogConfirm>
        );
    }
});

export default DialogPayRate;

