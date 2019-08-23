import React, { PropTypes } from 'react'
import DialogClockInClockOut from './DialogClockInClockOut'
import RaisedButton from '../../../elements/RaisedButton';
import DialogClockInClockOutContainer from '../../../../containers/EmployeePortal/TimeClock/DialogClockInClockOutContainer'
import RS, { Option } from '../../../../resources/resourceManager';
import { STATUS } from '../../../../core/common/constants';
import * as LoadingIndicatorActions from '../../../../utils/loadingIndicatorActions';

class ClockInClockOutButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }
    componentDidMount() {
        if (this.props.payload.isAuthenticated)
            this.props.getCurrentStatus();
    }

    componentWillReceiveProps(){
        LoadingIndicatorActions.hideAppLoadingIndicator()
    }

    render() {
        return (
            <span>
                <RaisedButton
                    className={_.get(this.props, "timeClock.status") == STATUS.CLOCK_IN ? "raised-button-fourth" : ''}
                    label={this.props.timeClock.status == STATUS.CLOCK_IN ? RS.getString("CLOCKOUT") : RS.getString("CLOCKIN")}
                    onClick={() => this.setState({ isOpen: true })}
                />
                <DialogClockInClockOutContainer
                    isOpen={this.state.isOpen}
                    handleClose={() => this.setState({ isOpen: false })}
                />
            </span>
        )

    }
}

ClockInClockOutButton.propTypes = {
    status: PropTypes.string
}

export default ClockInClockOutButton;