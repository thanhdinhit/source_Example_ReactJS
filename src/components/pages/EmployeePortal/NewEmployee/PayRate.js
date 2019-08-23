import React, { PropTypes } from 'react';
import CommonTextField from '../../../elements/TextField/CommonTextField.component';
import { FIXNUMBER_PAYRATE } from '../../../../core/common/constants';
import { getPayRateContraint } from '../../../../validation/payRateConstraints';
import { COUNTRY } from '../../../../core/common/config';
import RS from '../../../../resources/resourceManager';

class PayRate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            regular: 0,
        }
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.renderPayRateHoursCurrency = this.renderPayRateHoursCurrency.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentDidMount() {
        if (this.props.regular)
            this.setState({ regular: Number(this.props.regular) });
    }

    handleOnBlur(value) {
        const regex = /^[0-9\b]+$/;
        if (regex.test(value)) {
            let number = Number(value);
            this.setState({ regular: number });
            this.regular.setValue(number.toFixed(FIXNUMBER_PAYRATE));
            (this.props.onBlurPayRate && this.state.regular !== number) && this.props.onBlurPayRate(number.toFixed(FIXNUMBER_PAYRATE));
        }
        else return '';
    }

    handleOnChange() {
        this.props.onUpdatePayRate && this.props.onUpdatePayRate();
    }

    setValue(value) {
        this.setState({ regular: Number(value) });
        this.regular.setValue(value);
    }
    getValue() {
        return Number(this.regular.getValue()).toFixed(FIXNUMBER_PAYRATE) + "";
    }
    validate() {
        return this.regular.validate();
    }

    renderPayRateHoursCurrency() {
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                return RS.getString("PAYRATE_HOUR_AU");
            case COUNTRY.VN:
                return RS.getString("PAYRATE_HOUR_VN");
        }
    }

    render() {
        let payRateConstraint = getPayRateContraint();
        return (
            <div className="pay-rate">
                <div className="new-employee-title uppercase">
                    <span>{RS.getString('PAY_RATE')}</span>
                </div>
                <div className="row">
                    <div className="col-md-4" >
                        <CommonTextField
                            type="text"
                            id="regular"
                            defaultValue={this.state.regular.toFixed(FIXNUMBER_PAYRATE) + ''}
                            ref={(input) => this.regular = input}
                            onBlur={this.handleOnBlur}
                            constraint={payRateConstraint.regular}
                            onChange={this.handleOnChange}
                            addon={<span> {this.renderPayRateHoursCurrency()}</span>}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

PayRate.propTypes = {
    regular: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onBlurPayRate: PropTypes.func
};

export default PayRate;