import React, { PropTypes } from 'react';
import Moment from 'moment';
import _ from 'lodash';
import { extendMoment } from 'moment-range';
import FilterDateRangeV2 from './FilterDateRangeV2';

import RS from '../../resources/resourceManager';
import { TIMESPAN } from '../../core/common/constants';

const moment = extendMoment(Moment);

export const propTypes = {
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    handleChange: PropTypes.func,
    selectedDuration: PropTypes.string,
    timeDurations: PropTypes.array,
    optionType: PropTypes.string // 2 options: 'tab' or 'dropdown'
};

class TimeSliderWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDuration: TIMESPAN.WEEK,
            selectedDate: moment(new Date()).startOf('isoWeek'),
            dateFrom: moment(new Date()).startOf('isoWeek'),
            dateTo: moment(new Date()).endOf('isoWeek'),
        };

        this.handleChange = this.handleChange.bind(this);
        this.formatLocaleTimeValue = this.formatLocaleTimeValue.bind(this);
        this.handleRender = this.handleRender.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.renderOptionType = this.renderOptionType.bind(this);
        this.handleOnchangeOptions = this.handleOnchangeOptions.bind(this);
        this.setDateState = this.setDateState.bind(this);
        this.handleReceiveDuration = this.handleReceiveDuration.bind(this);
        this.handleReceiveStartDate = this.handleReceiveStartDate.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.setDurationAndDateState = this.setDurationAndDateState.bind(this);
        this.handleOnChangeFilterDateRange = this.handleOnChangeFilterDateRange.bind(this);
    }

    componentWillMount() {
        this.handleReceiveStartDate(this.props);
    }

    componentDidMount() {
        this.registerJquery();
    }

    componentWillReceiveProps(nextProps) {
        const startDate = this.props.startDate;
        const nextDate = nextProps.startDate;
        let sameDate = true;
        if (nextDate && typeof nextDate.getTime === 'function') {
            if (startDate && (startDate.getDate() !== nextDate.getDate()
                || startDate.getMonth() !== nextDate.getMonth()
                || startDate.getFullYear() != nextDate.getFullYear())) {
                sameDate = false;
                this.handleReceiveStartDate(nextProps);
            }
        }

        if (nextProps.selectedDuration === TIMESPAN.MANUAL) {
            this.handleReceiveDateManual(nextProps);
        }

        if (!_.isEqual(this.props.selectedDuration, nextProps.selectedDuration) && nextProps.selectedDuration !== TIMESPAN.MANUAL) {
            this.handleReceiveDuration(nextProps, sameDate);
        }
    }

    componentWillUnmount() {
        this.unRegisterJquery();
    }

    registerJquery() {
        $(document).on('click', '.dropdown-submenu .filter-date-range', function (e) {
            const target = e.target;
            if (!jQuery(target).is('.raised-button') && !jQuery(target).is('.raised-button-label')) {
                $(this).parent().parent().addClass('hover');
                e.stopPropagation();
                e.preventDefault();
            }
        });
        $(document).on('click', function (e) {
            const target = e.target;
            if (!jQuery(target).is('.dropdown-submenu .filter-date-range')) {
                $('.dropdown-submenu .filter-date-range').parent().parent().removeClass('hover');
            }
        });
    }

    unRegisterJquery() {
        $(document).off('click', '.dropdown-submenu .filter-date-range');
    }

    handleReceiveDateManual(nextProps) {
        this.handleDataChange(nextProps.selectedDuration, moment(nextProps.startDate), moment(nextProps.endDate), moment(nextProps.startDate));
    }

    handleReceiveDuration(nextProps) {
        let current = moment(nextProps.startDate);
        let start = moment(current);
        let end = moment(nextProps.endDate);

        this.handleDataChange(nextProps.selectedDuration, start, end, current);
    }

    handleReceiveStartDate(props) {
        let start = moment(props.startDate);
        let end = moment(props.endDate);

        this.handleDataChange(props.selectedDuration, start, end, start);

    }

    handleDataChange(duration, start, end, current) {
        switch (duration) {
            case TIMESPAN.FROM_LAST_SUBMISSION:
                start = moment(current);
                end = moment(end);
                break;
            case TIMESPAN.ONE_WEEK:
            case TIMESPAN.WEEK:
            case TIMESPAN.LAST_WEEK:
                end = moment(start).add(6, 'd');
                break;
            case TIMESPAN.TWO_WEEKS:
            case TIMESPAN.FORTNIGHT:
            case TIMESPAN.LAST_FORTNIGHT:
                end = moment(start).add(13, 'd');
                break;
            case TIMESPAN.FOUR_WEEKS:
                end = moment(start).add(27, 'd');
                break;
            case TIMESPAN.MONTH:
            case TIMESPAN.ONE_MONTH:
                end = moment(current).add(1, 'M').subtract(1, 'd');
                break;
            case TIMESPAN.LAST_MONTH:
                end = moment(current).add(1, 'M').subtract(1, 'd');
                break;
            case TIMESPAN.MANUAL:
                start = moment(start);
                end = moment(end);
                break;
            default:
                break;
        }
        current = start;
        this.setDurationAndDateState(duration, start, end, current);
    }

    handleChange(dateFrom, dateTo, option) {
        this.props.handleChange(new Date(dateFrom), new Date(dateTo), option);
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

    handleRender(index) {
        let current = moment(_.cloneDeep(this.state.selectedDate));
        let start = moment(current);
        let end = moment(current).add(6, 'd');
        let last = moment(new Date());

        switch (index) {
            case TIMESPAN.FROM_LAST_SUBMISSION:
                start = moment(this.props.defaultDate);
                end = moment(new Date()).endOf('d');
                this.setDurationAndDateState(index, start, end, current);
                break;
            case TIMESPAN.WEEK:
            case TIMESPAN.ONE_WEEK:
                this.setDurationAndDateState(index, start, end, current);
                break;
            case TIMESPAN.LAST_WEEK:
                start = moment(last).startOf('isoWeek').subtract(1, 'w');
                end = moment(start).add(6, 'd');

                this.setDurationAndDateState(index, start, end, current);
                break;
            case TIMESPAN.TWO_WEEKS:
            case TIMESPAN.FORTNIGHT:
                end = moment(current).add(13, 'd');

                this.setDurationAndDateState(index, start, end, current);
                break;
            case TIMESPAN.LAST_FORTNIGHT:

                start = moment(last).startOf('isoWeek').subtract(2, 'w');
                end = moment(start).add(13, 'd');

                this.setDurationAndDateState(index, start, end, current);
                break;
            case TIMESPAN.FOUR_WEEKS:
                end = moment(start).add(27, 'd');

                this.setDurationAndDateState(index, start, end, start);
                break;
            case TIMESPAN.MONTH:
            case TIMESPAN.ONE_MONTH:
                end = moment(current).add(1, 'M');

                this.setDurationAndDateState(index, start, end, start);
                break;
            case TIMESPAN.LAST_MONTH:
                start = moment(last).startOf('month').subtract(1, 'M');
                end = moment(start).add(1, 'M').subtract(1, 'd');

                this.setDurationAndDateState(index, start, end, current);
                break;
            default:
                break;
        }
        return this.handleChange(start, end, index);
    }

    handleNext() {
        let start = _.cloneDeep(this.state.dateFrom);
        let end = _.cloneDeep(this.state.dateTo);
        let current = _.cloneDeep(this.state.selectedDate);

        switch (this.state.selectedDuration) {
            case TIMESPAN.FROM_LAST_SUBMISSION:
            case TIMESPAN.MANUAL:
                const range = moment.range(start, end).diff('days');
                [start, end, current].forEach(item => {
                    item.add(range + 1, 'd');
                });
                this.setDateState(start, end, current);
                break;
            case TIMESPAN.WEEK:
            case TIMESPAN.ONE_WEEK:
            case TIMESPAN.LAST_WEEK:
                [start, end, current].forEach(item => {
                    item.add(1, 'w');
                });

                this.setDateState(start, end, current);
                break;
            case TIMESPAN.TWO_WEEKS:
            case TIMESPAN.FORTNIGHT:
            case TIMESPAN.LAST_FORTNIGHT:
                [start, end, current].forEach(item => {
                    item.add(2, 'w');
                });
                this.setDateState(start, end, current);
                break;
            case TIMESPAN.FOUR_WEEKS:
                [start, end, current].forEach(item => {
                    item.add(4, 'w');
                });
                this.setDateState(start, end, current);
                break;
            case TIMESPAN.MONTH:
            case TIMESPAN.ONE_MONTH:
            case TIMESPAN.LAST_MONTH:
                start = moment(start).add(1, 'M');
                end = moment(end).add(1, 'M');
                this.setDateState(start, end, start);
                break;
            default:
                break;
        }
        return this.handleChange(start, end, this.state.selectedDuration);
    }

    handlePrev() {
        let start = _.cloneDeep(this.state.dateFrom);
        let end = _.cloneDeep(this.state.dateTo);
        let current = _.cloneDeep(this.state.selectedDate);
        switch (this.state.selectedDuration) {
            case TIMESPAN.FROM_LAST_SUBMISSION:
            case TIMESPAN.MANUAL:
                const range = moment.range(start, end).diff('days');
                [start, end, current].forEach(item => {
                    item.subtract(range + 1, 'd');
                });
                this.setDateState(start, end, current);
                break;
            case TIMESPAN.WEEK:
            case TIMESPAN.ONE_WEEK:
            case TIMESPAN.LAST_WEEK:
                [start, end, current].forEach(item => {
                    item.subtract(1, 'w');
                });
                this.setDateState(start, end, current);
                break;
            case TIMESPAN.TWO_WEEKS:
            case TIMESPAN.FORTNIGHT:
            case TIMESPAN.LAST_FORTNIGHT:
                [start, end, current].forEach(item => {
                    item.subtract(2, 'w');
                });
                this.setDateState(start, end, current);
                break;
            case TIMESPAN.FOUR_WEEKS:
                [start, end, current].forEach(item => {
                    item.subtract(4, 'w');
                });
                this.setDateState(start, end, current);
                break;
            case TIMESPAN.MONTH:
            case TIMESPAN.ONE_MONTH:
            case TIMESPAN.LAST_MONTH:
                start = moment(start).subtract(1, 'M');
                end = moment(end).subtract(1, 'M');
                this.setDateState(start, end, start);
                break;
            default:
                break;
        }
        return this.handleChange(start, end, this.state.selectedDuration);
    }

    setDateState(dateFrom, dateTo, selectedDate) {
        this.setState({
            dateFrom,
            dateTo,
            selectedDate
        });
    }

    setDurationAndDateState(selectedDuration, dateFrom, dateTo, selectedDate) {
        this.setState({
            selectedDuration,
            dateFrom,
            dateTo,
            selectedDate
        });
    }

    handleOnchangeOptions(value) {
        this.handleRender(value.type);
    }

    handleOnChangeFilterDateRange(start, end) {
        this.setDurationAndDateState(TIMESPAN.MANUAL, moment(start), moment(end), moment(start));
        return this.handleChange(start, end, TIMESPAN.MANUAL);
    }

    renderValueComponent(option) {
        return (
            <div className="Select-value">
                <span className="Select-value-label" role="option" aria-selected="true" >
                    <span className="select-value-label-normal"> {RS.getString('DURATION')}: </span>
                    {option.value.label}
                </span>
            </div>
        );
    }

    renderOptionType() {
        const self = this;
        switch (this.props.optionType) {
            case 'tab': {
                let hasMoreOption = false;
                if (this.props.timeDurations && this.props.timeDurations.length > 1) {
                    hasMoreOption = true;
                }
                return (
                    <div className={"selector-row " + (hasMoreOption ? 'hasOption' : '')} >
                        {
                            hasMoreOption &&
                            _.map(this.props.timeDurations, function (option, index) {
                                return (
                                    <div
                                        key={'timespan-option-' + index}
                                        className={self.state.selectedDuration == option.type ? "active" : "in-active"}
                                        onClick={self.handleRender.bind(self, option.type)}
                                    >
                                        <span>{RS.getString(option.type.toUpperCase())}</span>
                                    </div>
                                );
                            })
                        }
                    </ div>
                );
            }
            case 'dropdown': {
                const timeDurations = this.props.timeDurations || [
                    { type: TIMESPAN.FROM_LAST_SUBMISSION },
                    { type: TIMESPAN.WEEK },
                    { type: TIMESPAN.FORTNIGHT },
                    { type: TIMESPAN.MONTH },
                    { type: TIMESPAN.MANUAL },
                    { type: TIMESPAN.LAST_MONTH },
                    { type: TIMESPAN.LAST_FORTNIGHT },
                    { type: TIMESPAN.LAST_WEEK }
                ];

                const options = _.map(timeDurations, item => {
                    return {
                        label: RS.getString(item.type),
                        type: item.type
                    };
                });
                const value = _.find(options, { type: this.state.selectedDuration }) || options[0];
                return (
                    <div className="option-selection dropdown">
                        <button
                            className="btn btn-default dropdown-toggle"
                            type="button"
                            data-toggle="dropdown"
                        >
                            {value.label}
                            <div className="button-addon"><span className="Select-arrow" /></div>
                        </button>
                        <ul className="dropdown-menu">
                            {
                                _.map(options, (item, index) => {
                                    if (item.type === TIMESPAN.MANUAL) {
                                        return (
                                            <li
                                                key={index}
                                                className="dropdown-submenu"
                                            >
                                                <a className="submenu">{item.label}</a>
                                                <ul className="dropdown-menu">
                                                    <li className="filter-date-range-li">
                                                        <FilterDateRangeV2
                                                            startDate={new Date(this.state.dateFrom)}
                                                            endDate={new Date(this.state.dateTo)}
                                                            onChange={this.handleOnChangeFilterDateRange}
                                                            ref={input => this.filterDateRange = input}

                                                        />
                                                    </li>
                                                </ul>
                                            </li>);
                                    }
                                    return (
                                        <li key={index} onClick={this.handleOnchangeOptions.bind(this, item)} ><a>{item.label}</a></li>
                                    );
                                })
                            }
                        </ul >
                    </div >
                );
            }
            default:
                break;
        }
    }

    render() {
        const classLabelTime = _.includes(this.state.selectedDuration, 'MONTH') ? 'month' : 'week';
        return (
            <div className="time-slider-widget" >
                {this.renderOptionType()}
                <div className="value-row">
                    <div className="pre-button" onClick={this.handlePrev} ><i className="fa fa-angle-left" aria-hidden="true" /></div>
                    <div className={'label-time ' + classLabelTime}>{this.formatLocaleTimeValue()}</div>
                    <div className="next-button" onClick={this.handleNext} ><i className="fa fa-angle-right" aria-hidden="true" /></div>
                </div>
            </div >
        );
    }
}
TimeSliderWidget.defaultProps = {
    selectedDuration: TIMESPAN.WEEK,
    optionType: 'tab'
};
TimeSliderWidget.propTypes = propTypes;

class Dropdown extends React.Component {
    render() {
        return React.createElement(TimeSliderWidget, _.assign({}, this.props, { optionType: 'dropdown' }));
    }
}
class Tab extends React.Component {
    render() {
        return React.createElement(TimeSliderWidget, _.assign({}, this.props, { optionType: 'tab' }));
    }
}

export default {
    Dropdown,
    Tab
};