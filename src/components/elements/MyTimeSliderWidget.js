import React, { PropTypes } from 'react';
import dateHelper from '../../utils/dateHelper'
import _ from "lodash";
import {
    TIMESPAN
} from "../../core/common/constants";
import TimeSliderWidget from './TimeSliderWidget';

export const propTypes = {
    durations: PropTypes.array,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    selectedDuration: PropTypes.string,
    handleChange: PropTypes.func,
    defaultDate: PropTypes.object,
    optionType: PropTypes.string
};

class MyTimeSliderWidget extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: new Date()
        };
        this.duration = null;
        this.handleChangeDuration = this.handleChangeDuration.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // if (!_.isEqual(this.props.defaultDate, nextProps.defaultDate)) {
        //     this.setState({
        //         startDate: nextProps.defaultDate ? nextProps.defaultDate : new Date()
        //     });
        // }
        if (!_.isEqual(this.duration, nextProps.selectedDuration)) {
            if (nextProps.selectedDuration === TIMESPAN.FROM_LAST_SUBMISSION) {
                this.setState({
                    startDate: this.props.defaultDate
                }, () => {
                    this.handleChangeDuration(nextProps.startDate, nextProps.endDate, nextProps.selectedDuration);
                });
            } else {
                this.setState({
                    startDate: nextProps.startDate
                }, () => {
                    this.handleChangeDuration(nextProps.startDate, nextProps.endDate, nextProps.selectedDuration);
                });
            }
        }
    }

    handleChangeDuration(from, to, duration) {
        let dateRange;
        this.duration = duration
        // if (duration === TIMESPAN.MANUAL) {
        //     dateRange = {
        //         from: !this.props.startDate ? this.state.startDate : this.props.startDate,
        //         to: !this.props.endDate ? dateHelper.getStartOfWeek(this.state.startDate) : this.props.endDate
        //     };
        // } else {
        //     dateRange = dateHelper.getDateRange(this.state.startDate, duration);
        // }

        this.props.handleChange(from, to, duration);
    }

    render() {
        switch (this.props.optionType) {
            case 'tab': {
                return (
                    <TimeSliderWidget.Tab
                        ref={(timeSlider) => this.timeSlider = timeSlider}
                        timeDurations={this.props.durations}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                        selectedDuration={this.props.selectedDuration}
                        handleChange={this.handleChangeDuration}
                    />
                );
                break;
            }
            case 'dropdown': {
                return (
                    <TimeSliderWidget.Dropdown
                        ref={(timeSlider) => this.timeSlider = timeSlider}
                        timeDurations={this.props.durations}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                        selectedDuration={this.props.selectedDuration}
                        handleChange={this.handleChangeDuration}
                    />
                )

                break;
            }
        }
    }
}

MyTimeSliderWidget.propTypes = propTypes;

class Dropdown extends React.Component {
    render() {
        return React.createElement(MyTimeSliderWidget, _.assign({}, this.props, { optionType: 'dropdown' }));
    }
}

class Tab extends React.Component {
    render() {
        return React.createElement(MyTimeSliderWidget, _.assign({}, this.props, { optionType: 'tab' }));
    }
}

export default {
    Dropdown,
    Tab
};