import React, { PropTypes } from 'react'
import DiaLog from '../../../elements/Dialog';
import RS, { Option } from '../../../../resources/resourceManager';
import RaisedButton from '../../../elements/RaisedButton';
import { STATUS, TIMEFORMAT } from '../../../../core/common/constants';
import DateHelper from '../../../../utils/dateHelper'

class DialogClockInClockOut extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            clock: "--:--:--"
        }
        this.handleClose = this.handleClose.bind(this)
        this.timer = this.timer.bind(this)
        this.handleClock = this.handleClock.bind(this)
    }
    componentDidMount() {
        this.setState({ isOpen: this.props.isOpen })
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            this.setState({ clock: nextProps.timeClock.currentTime })
            this.intervalId = setInterval(this.timer.bind(this), 1000);
            this.props.getCurrentStatus();
        }

    }
    componentWillUnmount() {
        clearInterval(this.intervalId)
    }
    timer() {
        if (this.state.clock instanceof Date) {
            let newTime = new Date(this.state.clock);
            newTime.setSeconds(this.state.clock.getSeconds() + 1)
            this.setState({ clock: newTime })
        }
        else {
            this.setState({ clock: "--:--:--" })
        }
    }
    handleClose() {
        this.props.handleClose();
        clearInterval(this.intervalId)
    }
    handleClock(status) {
        this.props.clockTime({ status })
    }
    renderClockIn() {
        return (
            <RaisedButton
                label={RS.getString("CLOCKIN")}
                onClick={this.handleClock.bind(this, STATUS.CLOCK_IN)}
            />
        )
    }
    renderCLockOut() {
        let startLockedIn = _.get(this.props.timeClock, "latestTime", "--:--")
        let lastedOffice = _.get(this.props.timeClock, "latestOffice.name", "unknown")
        return (
            <span >
                <div className="info-container clockout">
                    <div className="new-employee-title shift-title uppercase">{RS.getString('CLOCKED_IN')}</div>
                    <span>
                        <div className="shift-row">
                            <div className="img-calendar clock-out">
                                <img src={require("../../../../images/clocked-in.png")} />
                            </div>
                            <div className="time-location-container">
                                <div className="time" >
                                    {DateHelper.formatTimeWithPattern(startLockedIn, TIMEFORMAT.CLOCKED_OUT)}
                                </div>
                                <div className="location">
                                    {lastedOffice}
                                </div>
                            </div>
                        </div>
                    </span>
                </div>
                <RaisedButton
                    label={RS.getString("CLOCKOUT")}
                    className={"raised-button-fourth"}
                    onClick={this.handleClock.bind(this, STATUS.CLOCK_OUT)}
                />
            </span>
        )
    }
    renderTodayShifts() {
        return (
            <div className="info-container">
                <div className="new-employee-title shift-title uppercase">{RS.getString('TODAY_SHIFT')}</div>
                <span>
                    {
                        this.props.timeClock.todayShifts.length ?
                            this.props.timeClock.todayShifts.map((element, index) => {
                                return (

                                    <div className="shift-row" key={index}>
                                        <div className="img-calendar">
                                            <img src={require("../../../../images/shift-calendar.png")} />
                                            <span className="index-number">{index + 1}</span>
                                        </div>
                                        <div className="time-location-container">
                                            <div className="time" >
                                                {DateHelper.formatTimeWithPattern(element.startTime
                                                    || "--:--", TIMEFORMAT.WITHOUT_SECONDS)} -
                                                    {DateHelper.formatTimeWithPattern(element.endTime
                                                    || "--:--", TIMEFORMAT.WITHOUT_SECONDS)}
                                            </div>
                                            <div className="location">
                                                {_.get(element, "office.name", "unknown")}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            : <div className="shift-row without-shift"><b> {RS.getString("P116")} </b></div>

                    }
                </span>
            </div>
        )
    }
    render() {

        return (
            <DiaLog
                className="dialog-clockin-clockout"
                style={{ widthBody: '400px' }}
                title={RS.getString('TIME_CLOCK', null, Option.UPPER)}
                isOpen={this.props.isOpen}
                handleClose={this.handleClose}
            >
                <div className="current-time-background">
                    <div className="current-time-container">
                        <div className="current-time">{DateHelper.formatTimeWithPattern(this.state.clock, TIMEFORMAT.WITHOUT_SECONDS)}</div>
                        <div className="current-date">{DateHelper.formatTimeWithPattern(this.state.clock, TIMEFORMAT.DATE_WITH_WEEKDAY)}</div>
                    </div>
                </div>
                <div className="body-container">
                    {this.renderTodayShifts()}
                    {
                        this.props.timeClock.status == STATUS.CLOCK_IN ?
                            this.renderCLockOut() : this.renderClockIn()
                    }
                </div>
            </DiaLog>
        )
    }
}

DialogClockInClockOut.propTypes = {
    isOpen: PropTypes.bool,
    status: PropTypes.string,
    handleClose: PropTypes.func
}

export default DialogClockInClockOut;