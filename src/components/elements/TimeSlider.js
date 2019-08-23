import React, { PropTypes } from 'react';
import Moment from 'moment';
import _ from 'lodash';
import { extendMoment } from 'moment-range';
import RS from '../../resources/resourceManager';
import dateHelper from '../../utils/dateHelper';
import { TIMESPAN } from '../../core/common/constants';

const moment = extendMoment(Moment);

export const propTypes = {
    endDate: PropTypes.object,
    startDate: PropTypes.object,
    onChange: PropTypes.func,
    timeSpan: PropTypes.string
};

class TimeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateFrom: moment(new Date()).startOf('isoWeek'),
            dateTo: moment(new Date()).endOf('isoWeek')
        };
        this.formatLocaleTimeValue = this.formatLocaleTimeValue.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.setDateState = this.setDateState.bind(this);
        this.handleOnChangeValue = this.handleOnChangeValue.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dateFrom: moment(nextProps.startDate),
            dateTo: moment(nextProps.endDate)
        });
    }

    formatLocaleTimeValue() {
        return this.getFormatDateRange(this.state.dateFrom, this.state.dateTo);
    }

    getFormatDateRange(startDate, endDate) {
        if (new Date(startDate).getFullYear() === new Date(endDate).getFullYear()) {
            return ` ${startDate.format('MMM D')} - ${endDate.format('MMM D, YYYY')}`;
        }
        return ` ${startDate.format('MMM D, YYYY')} - ${endDate.format('MMM D, YYYY')}`;
    }

    handleNext() {
        let start = _.cloneDeep(this.state.dateFrom);
        let end = _.cloneDeep(this.state.dateTo);

        switch (this.props.timeSpan) {
            case TIMESPAN.WEEK:
            case TIMESPAN.TWO_WEEKS:
            case TIMESPAN.THREE_WEEKS:
                const range = moment.range(start, end).diff('days');
                [start, end].forEach(item => {
                    item.add(range + 1, 'd');
                });
                break;
            case TIMESPAN.MONTH:
                start.add(1,'M');
                start = start.startOf('M');
                end = Moment(start).endOf('M');
                break;
        }


        return this.setDateState(start, end);
    }

    handlePrev() {
        let start = _.cloneDeep(this.state.dateFrom);
        let end = _.cloneDeep(this.state.dateTo);
        const range = moment.range(end, start).diff('days');
        [start, end].forEach(item => {
            item.add(range - 1, 'd');
        });
        return this.setDateState(start, end);
    }

    setDateState(dateFrom, dateTo) {
        this.setState({
            dateFrom,
            dateTo
        }, () => {
            this.handleOnChangeValue();
        });
    }

    handleOnChangeValue() {
        return this.props.onChange(new Date(this.state.dateFrom), new Date(this.state.dateTo));
    }

    render() {
        const classLabelTime = _.includes(this.state.selectedDuration, 'MONTH') ? 'month' : 'week';
        return (
            <div className="time-slider-auto" >
                <div className="value-row">
                    <div className="pre-button" onClick={this.handlePrev}><i className="fa fa-angle-left" aria-hidden="true" /></div>
                    <div className={'label-time ' + classLabelTime}>{this.formatLocaleTimeValue()}</div>
                    <div className="next-button" onClick={this.handleNext}><i className="fa fa-angle-right" aria-hidden="true" /></div>
                </div>
            </div >
        );
    }
}

export default TimeSlider;