import React, { PropTypes } from 'react';
import _ from 'lodash';

import TextView from '../../elements/TextView';

import RS from '../../../resources/resourceManager';
import { COUNTRY } from '../../../core/common/config';

class PayRateView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.renderPayRateHoursCurrency = this.renderPayRateHoursCurrency.bind(this);
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
      
        return (
            <div className="pay-rate">
                <div className="new-employee-title uppercase">
                    <span>{RS.getString('PAY_RATE')}</span>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <TextView
                            value={_.toString(this.props.payRate)}
                            addon={<span className="input-group-addon text-view"> {this.renderPayRateHoursCurrency()}</span>}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

PayRateView.propTypes = {
    payRate: PropTypes.number,
};

export default PayRateView;