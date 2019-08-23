import React, { PropTypes } from 'react';
import RS from '../../../resources/resourceManager';
import { validate } from '../../../validation/validate.function';
import Constraints from '../../../validation/common.constraints';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';
import PopoverIcon from '../PopoverIcon/PopoverIcon'

const CommonDatepickerInline = React.createClass({
    componentDidMount: function () {
        $(this.datepicker).datepicker({
            format: "dd/mm/yyyy",
            language: this.props.language,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            todayBtn: this.props.today
        })
        this.registerEventDatepicker();
        $(this.datepicker).datepicker('setDate', this.props.defaultValue)
    },

    componentWillReceiveProps: function (nextProps) {
        if (!_.eq(nextProps.language, this.props.language)) {
            $(this.datepicker).datepicker('destroy')
            $(this.datepicker).datepicker({
                language: nextProps.language,
                todayBtn: this.props.today
            });
        }
        if (!_.eq(this.getTime(nextProps.defaultValue), this.getTime(this.props.defaultValue))) {
            $(this.datepicker).datepicker('setDate', nextProps.defaultValue)
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

    datepicker: undefined,

    registerEventDatepicker: function () {
        $(this.datepicker).on('changeDate', this.onChangeDate);
    },
    getTime: function (date) {
        if (date) {
            return date.getTime()
        }
        return undefined;
    },

    onChangeDate: function (e) {
        if (this.props.onChange)
            this.props.onChange(e.date)
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

    getValue: function () {
        return $(this.datepicker).datepicker('getDate')
    },

    render: function () {
        return (
            <div className="common-datepicker-inline" ref={(div) => this.datepicker = findDOMNode(div)}>
            </div>
        );
    }
})

CommonDatepickerInline.propTypes = {
    constraint: PropTypes.object,
    onChange: PropTypes.func,
    defaultValue: PropTypes.object,
    language: PropTypes.string,
    title: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string
}

export default CommonDatepickerInline