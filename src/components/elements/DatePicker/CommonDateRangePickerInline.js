import React, { PropTypes } from 'react';
import RS from '../../../resources/resourceManager';
import { validate } from '../../../validation/validate.function';
import Constraints from '../../../validation/common.constraints';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';
import PopoverIcon from '../PopoverIcon/PopoverIcon'
import { TIMESPAN } from '../../../core/common/constants';
import moment from 'moment';
import DateHelper from '../../../utils/dateHelper';

const CommonDateRangePickerInline = React.createClass({
    componentDidMount: function () {
        $(this.datepicker).datepicker({
            format: "dd/mm/yyyy",
            language: this.props.language,
            multidate: 2,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            todayBtn: this.props.today,
            isDateRange: true
        })
        this.registerEventDatepicker();
        $(this.datepicker).datepicker('setValues', this.props.defaultValue);
    },

    componentWillReceiveProps: function (nextProps) {
        if (!_.eq(nextProps.language, this.props.language)) {
            $(this.datepicker).datepicker('destroy')
            $(this.datepicker).datepicker({
                language: nextProps.language,
                todayBtn: this.props.today
            });
        }
        if (!_.isEqual(nextProps.defaultValue, this.props.defaultValue)) {
            $(this.datepicker).datepicker('setValues', nextProps.defaultValue)
        }
        if (!_.eq(nextProps.startDate, this.props.startDate)) {
            $(this.datepicker).datepicker('destroy')
            $(this.datepicker).datepicker({
                startDate: nextProps.startDate,
                todayBtn: this.props.today
            });
        }
        if (!_.eq(nextProps.endDate, this.props.endDate)) {
            $(this.datepicker).datepicker('destroy')
            $(this.datepicker).datepicker({
                endDate: nextProps.endDate,
                todayBtn: this.props.today
            });
        }
    },
    componentDidUpdate: function (prevProps) {
        if (!_.eq(prevProps.range, this.props.range)) {
            $(this.datepicker).datepicker('setDate', new Date());
        }
    },
    datepicker: undefined,

    registerEventDatepicker: function () {
        $(this.datepicker).on('changeDate', this.onChangeDate);
    },

    onChangeDate: function (e) {
        if (this.props.range) {
            let start = new Date(moment(e.date).startOf('isoWeek'));
            let end;
            switch (this.props.range) {
                case TIMESPAN.WEEK: {
                    end = new Date(moment(start).add(6, 'd'));
                    break;
                }
                case TIMESPAN.TWO_WEEKS: {
                    end = new Date(moment(start).add(13, 'd'));
                    break;
                }
                case TIMESPAN.THREE_WEEKS: {
                    end = new Date(moment(start).add(20, 'd'));
                    break;
                }
            }
            $(this.datepicker).datepicker('setValues', [start, end]);
            if (this.props.onChange) {
                return this.props.onChange(start, end);
            }
        }
        if (this.props.onChange) {
            if (e.dates.length == 0) {
                this.props.onChange(null, null);
            } else if (e.dates.length == 1) {
                this.props.onChange(e.dates[0], null);
            } else {
                if (e.dates[0].getTime() < e.dates[1].getTime()) {
                    this.props.onChange(e.dates[0], e.dates[1]);
                } else {
                    this.props.onChange(e.dates[1], e.dates[0]);
                }
            }
        }
    },

    validate: function () {
        if (this.isShowCalendar) return;
        const constraint = _.assign({}, this.props.constraint);
        let rs = validate.bind(this, this.getValue(), constraint)();
        return rs;
    },

    setvalue: function (date) {
        $(this.datepicker).datepicker('setValue', date)
    },

    setDates: function (start, end) {
        $(this.datepicker).datepicker('setDates', [start, end]);
    },

    getValue: function () {
        return $(this.datepicker).datepicker('getDates')
    },

    render: function () {
        return (
            <div className="common-daterangepicker-inline" ref={(div) => this.datepicker = findDOMNode(div)}>
            </div>
        );
    }
})

CommonDateRangePickerInline.propTypes = {
    constraint: PropTypes.object,
    onChange: PropTypes.func,
    defaultValue: PropTypes.array,
    language: PropTypes.string,
    title: PropTypes.string,
    startDate: PropTypes.object,
    endDate: PropTypes.object
}

export default CommonDateRangePickerInline