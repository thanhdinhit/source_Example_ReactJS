import React, { PropTypes } from 'react';
import RS from '../../../resources/resourceManager';
import { validate } from '../../../validation/validate.function';
import Constraints from '../../../validation/common.constraints';
import _ from 'lodash';
import { findDOMNode } from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';

import PopoverIcon from '../PopoverIcon/PopoverIcon';
import debounceHelper from '../../../utils/debounceHelper';
import { WAITING_TIME } from '../../../core/common/constants';

const CommonDatepicker = React.createClass({
    getInitialState: function () {
        return {
            errorText: '',
            show: false,
            hasError: false
        }
    },
    
    getDefaultProps: function () {
        return {
            componentName: 'CommonDatePicker',
            type: 'date'
        }
    },
    
    defaultSetting: {
        todayHighlight: true,
        autoclose: true,
        format: "dd/mm/yyyy",
    },
    componentDidMount: function () {
        this.defaultSetting = _.assign(this.defaultSetting, {
            orientation: this.props.orientation || "auto",
            language: this.props.language,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
        })
        $(this.datepicker).datepicker(this.defaultSetting)
        this.registerEventDatepicker();
        this.props.defaultValue && $(this.datepicker).datepicker('setDate', this.props.defaultValue)
        this.handleOnChangeCallBack = debounceHelper.debounce(this.validate, WAITING_TIME);
    },

    componentWillReceiveProps: function (nextProps) {
        if (!_.eq(nextProps.language, this.props.language)) {
            this.defaultSetting.language = nextProps.language;
            this.defaultSetting.orientation = this.props.orientation || "auto";
            $(this.datepicker).datepicker('destroy')
            $(this.datepicker).datepicker(this.defaultSetting);
        }
        if (!_.eq(this.getTime(nextProps.defaultValue), this.getTime(this.props.defaultValue))) {
            $(this.datepicker).datepicker('setDate', nextProps.defaultValue)
        }
        if (!_.eq(nextProps.startDate, this.props.startDate)) {
            this.defaultSetting.startDate = nextProps.startDate;
            this.defaultSetting.orientation = this.props.orientation || "auto";
            this.defaultSetting.format = "dd/mm/yyyy";
            $(this.datepicker).datepicker('destroy')
            $(this.datepicker).datepicker(this.defaultSetting);
        }
        if (!_.eq(nextProps.endDate, this.props.endDate)) {
            this.defaultSetting.endDate = nextProps.endDate;
            this.defaultSetting.orientation = this.props.orientation || "auto";
            $(this.datepicker).datepicker('destroy')
            $(this.datepicker).datepicker(this.defaultSetting);
        }
    },

    datepicker: undefined,
    isShowCalendar: false,

    registerEventDatepicker: function () {
        $(this.datepicker).on('changeDate', this.onChangeDate);
        $(this.datepicker).on('show', this.onShow)
        $(this.datepicker).on('hide', this.onHide)
    },

    onShow: function () {
        this.isShowCalendar = true;
        if (this.state.errorText !== '') {
            this.popoverIcon.show(this.getPopoverPostion())
        }
    },

    onHide: function () {
        this.isShowCalendar = false;
        this.validate();
        if (this.state.errorText !== '') {
            this.popoverIcon.hide()
        }
        this.handleOnBlur();
    },

    getTime: function (date) {
        if (date) {
            return date.getTime()
        }
        return undefined;
    },

    getConstraint: function(){
        return this.props.constraint;
    },

    onChangeDate: function (e) {
        if (e.date)
            this.validate()
        if (this.props.onChange)
            this.props.onChange(e.date)
    },

    validate: function (constraintOptional) {
        // if (this.isShowCalendar) return;
        const constraint = _.assign({}, constraintOptional || this.props.constraint);
        let rs = validate.bind(this, this.getValue(), constraint)();
        this.setState({ hasError: !rs })
        return rs;
    },

    setvalue: function (date) {
        $(this.datepicker).datepicker('setValue', date)
    },

    getValue: function () {
        return $(this.datepicker).datepicker('getDate')
    },
    popoverErrorIcon: function () {
        $(this.errorIcon).popover({
            trigger: 'focus',
            container: 'body'
        })
    },
    getPopoverPostion: function () {
        let datePicker = $(".datepicker-dropdown")[0];
        if (datePicker) {
            let positionInput = $(this.datepicker).offset();
            let positionDatePicker = $(datePicker).offset();
            if (positionInput.top < positionDatePicker.top) {
                return "top";
            }
            return "bottom";
        }
    },
    handleOnFocus: function () {
        this.setState({ hasError: false });

        if (this.props.onFocus) {
            this.props.onFocus();
        }
    },
    handleOnBlur: function () {
        this.props.onBlur && this.props.onBlur(this.getValue())
        this.props.onChange && this.props.onChange(this.getValue())
    },
    handleOnChange: function () {
        this.handleOnChangeCallBack();
    },
    hasError: function () {
        return this.state.hasError;
    },

    showCalendar: function () {
        !this.props.disabled && $(this.datepicker).datepicker('show')
    },

    render: function () {
        const props = _.cloneDeep(this.props);
        delete props['constraint'];
        delete props['ref'];
        delete props['onChange'];
        delete props['defaultValue']
        let datePickerCSS = "input-group date " + (this.state.hasError ? 'has-error' : '');

        let className = this.props.className ? this.props.className : 'date-picker';

        return (
            <div className={className}>
                {this.props.title ?
                    <div className={"title " + (this.props.required ? "required" : "")}> {this.props.title}
                    </div> : null
                }
                <div className={datePickerCSS} >
                    <input
                        disabled={this.props.disabled}
                        ref={(datepicker) => this.datepicker = findDOMNode(datepicker)}
                        placeholder={this.props.hintText}
                        type="text"
                        onFocus={this.handleOnFocus}
                        className="form-control"
                        onChange={this.handleOnChange}
                    />
                    {
                        !_.isEmpty(this.state.errorText) ?
                            <PopoverIcon
                                className="popover-error popover-input"
                                ref={(popoverIcon) => this.popoverIcon = popoverIcon}
                                message={this.state.errorText}
                                showOnHover
                                iconPath='error-icon.png'
                            /> : null
                    }
                    <span className={"input-group-addon " + (this.props.disabled ? 'disabled-span' : '')}
                        onClick={this.showCalendar}
                    >
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                    </span>
                </div>
            </div>
        );
    }
})

CommonDatepicker.propTypes = {
    constraint: PropTypes.object,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    defaultValue: PropTypes.object,
    errorText: PropTypes.string,
    disabled: PropTypes.bool,
    hintText: PropTypes.string,
    title: PropTypes.string,
    language: PropTypes.string,
    required: PropTypes.bool,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    orientation: PropTypes.string
}

export default CommonDatepicker