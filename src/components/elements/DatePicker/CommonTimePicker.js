import React, { PropTypes } from 'react'
import Overlay from 'react-bootstrap/lib/Overlay';
import RS, { Option } from '../../../resources/resourceManager';
import { findDOMNode } from 'react-dom';
import CommonTextField from '../TextField/CommonTextField.component'
import { TIMEFORMAT, REGEX_TIME_PICKER, WAITING_TIME } from '../../../core/common/constants';
import dateHelper from '../../../utils/dateHelper'
import debounceHelper from '../../../utils/debounceHelper';
import Constraints from '../../../validation/common.constraints';
import { validate } from '../../../validation/validate.function';
import PopoverIcon from '../PopoverIcon/PopoverIcon';

class CustomPopover extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: undefined
        }
        this.onAddTimer = this.onAddTimer.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
    }
    componentDidMount() {
        this.refs.hour.value = "00";
        this.refs.min.value = "00";
        if (this.props.value) {
            this.setValue(this.props.value)
        }
        else {
            if (this.props.originValue instanceof Date) {
                this.setValue(this.props.originValue)
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value && (!this.props.value || this.props.value.getTime() != nextProps.value.getTime())) {
            if (nextProps.value instanceof Date)
                this.setValue(nextProps.value)
        }
    }
    setValue(date) {
        this.setState({ value: date })
        this.refs.hour.value = this.formatValue(24, date.getHours() + "");
        this.refs.min.value = this.formatValue(60, date.getMinutes() + "");
    }
    getValue() {
        let rs = new Date(this.state.value);
        rs.setHours(this.refs.hour.value, this.refs.min.value)
        return rs;
    }
    formatValue(maxValue, value) {
        value = value.replace(/[^0-9]/g, '');
        if (value > maxValue) {
            value = value.slice(0, 2);
            if (value > maxValue)
                value = Math.ceil(Number(value) / 10)
        }
        if (value < 10) {
            value = "0" + Number(value);
        }
        else {
            value = Number(value);
        }
        return value;
    }
    onInputHour(maxValue, e) {
        e.target.value = this.formatValue(maxValue, e.target.value)
        this.props.onChange && this.props.onChange(this.getValue())
    }
    onAddTimer(delta, nameRef, maxValue) {
        let num = new Number(this.refs[nameRef].value);
        num += delta;
        if (num > maxValue - 1) {
            num -= maxValue;
        }
        if (num < 0) {
            num += maxValue;
        }
        this.refs[nameRef].value = num;
        if (num < 10) {
            this.refs[nameRef].value = "0" + num;
        }
        this.props.onChange && this.props.onChange(this.getValue())
    }
    onKeyUp(nameRef, maxValue, e) {
        e.preventDefault();
        switch (e.keyCode) {
            case 38: //up
                this.onAddTimer(1, nameRef, maxValue);
                break;
            case 40: //down
                this.onAddTimer(-1, nameRef, maxValue);
                break;
        }
    }
    render() {
        return (
            <div className="my-custom-popover">
                <div className="body-center">
                    <div className="body-container">
                        <div className="body-content">
                            <div className="time-unit">
                                <i className="fa fa-chevron-up" aria-hidden="true" onClick={this.onAddTimer.bind(this, 1, "hour", 24)}></i>
                                <input

                                    onKeyUp={this.onKeyUp.bind(this, "hour", 24)}
                                    ref="hour"
                                    type="text"
                                    maxLength="3"
                                    onInput={this.onInputHour.bind(this, 23)}
                                    className="form-control form-text-input"
                                />
                                <i className="fa fa-chevron-down" aria-hidden="true" onClick={this.onAddTimer.bind(this, -1, "hour", 24)}></i>
                            </div>
                            <span className="two-dot"> : </span>
                            <div className="time-unit">
                                <i className="fa fa-chevron-up" aria-hidden="true" onClick={this.onAddTimer.bind(this, 1, "min", 60)}></i>
                                <input
                                    onKeyUp={this.onKeyUp.bind(this, "min", 60)}
                                    ref="min"
                                    type="text"
                                    maxLength="3"
                                    onInput={this.onInputHour.bind(this, 59)}
                                    className="form-control form-text-input"
                                />
                                <i className="fa fa-chevron-down" aria-hidden="true" onClick={this.onAddTimer.bind(this, -1, "min", 60)}></i>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        )
    }
}
CustomPopover.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    originValue: PropTypes.object
}

class CommonTimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            time: new Date(),
            timeString: '',
            errorText: '',
            hasError: false
        }
        this.constraint = {};
        this.isFocused = false;
        this.onFocus = this.onFocus.bind(this);
        this.onHide = this.onHide.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChangePopoverValue = this.onChangePopoverValue.bind(this)
        this.onChangeInputTarget = this.onChangeInputTarget.bind(this)
        this.onHidePopover = this.onHidePopover.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }
    componentDidMount() {
        this.handleOnChangeCallBack = debounceHelper.debounce(this.validate, WAITING_TIME);
        this.props.defaultValue && this.setValue(this.props.defaultValue)
        this._isMounted = true;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value && (!this.props.value || this.props.value.getTime() != nextProps.value.getTime())) {
            this.setValue(nextProps.value)
        }
        if (nextProps.errorText) {
            this.setState({ errorText: nextProps.errorText, hasError: true });
        } else if (this.props.errorText) {
            this.setState({ errorText: '', hasError: false });
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    onFocus() {
        this.setState({ isOpen: true, hasError: false })
        this.isFocused = true;
        if (this.state.errorText !== '') {
            this.popoverIcon.show()
        }
        this.props.onFocus && this.props.onFocus();
    }
    onHide() {
        !this.isFocused && this.setState({ isOpen: false })
        !this.state.isOpen && this.props.onBlur && this.props.onBlur(this.state.time);
    }
    onHidePopover() {
        if (!this.isFocused && this._isMounted) this.popoverIcon.hide();
    }
    onBlur() {
        this.isFocused = false
        if (this.state.errorText !== '') {
            this.popoverIcon.hide()
        }
        this.setState({ timeString: dateHelper.formatTimeWithPattern(this.state.time, TIMEFORMAT.TIME_PICKER) }, () => {
            this.validate();
        })
        // this.props.onBlur && this.props.onBlur();
    }

    validate() {
        if (!this._isMounted) return;
        const constraint = this.constraint;
        let rs = validate.bind(this, this.getStringValue(), constraint)();
        if (rs) {
            const constraint2 = this.props.constraint;
            rs = validate.bind(this, this.getValue(), constraint2)();
        }
        this.setState({ hasError: !rs })
        this.isFocused && this.onFocus();
        return rs;
    }
    getStringValue() {
        return this.refs.inputTarget.value;
    }
    getValue() {
        return this.refs.inputTarget.value ? this.state.time : null;
    }
    setValue(date, callback) {
        this.setState({
            time: date,
            timeString: dateHelper.formatTimeWithPattern(date, TIMEFORMAT.TIME_PICKER)
        }, callback)
    }
    onChangeInputTarget(e) {
        let value = e.target.value;
        if (REGEX_TIME_PICKER.test(value) && value != "") {
            let newTime = dateHelper.formatPatternToTime(value, TIMEFORMAT.TIME_PICKER);
            if (this.props.defaultValue instanceof Date) {
                newTime.setDate(this.props.defaultValue.getDate());
                newTime.setMonth(this.props.defaultValue.getMonth());
                newTime.setFullYear(this.props.defaultValue.getFullYear());
            }
            this.setState({ time: newTime, timeString: value }, () => {
                this.props.onChange && this.props.onChange(newTime);
            });
        }
        else {
            this.setState({ timeString: value })
            this.props.onChange && this.props.onChange()
        }
        this.handleOnChangeCallBack();
    }
    onChangePopoverValue(value) {
        this.setState({ time: value, timeString: dateHelper.formatTimeWithPattern(value, TIMEFORMAT.TIME_PICKER) }, () => {
            this.props.onChange && this.props.onChange(value)
        });
        this.handleOnChangeCallBack();

    }
    hasError() {
        return this.state.hasError;
    }
    handleClear() {
        this.setState({ timeString: '' });
        this.refs.inputTarget.focus();
    }
    render() {
        const props = _.cloneDeep(this.props);
        delete props['defaultValue']
        delete props['constraint'];
        delete props['ref'];
        delete props['onChange'];
        delete props['defaultValue'];
        delete props['errorText'];
        delete props['hintText'];
        delete props['fullWidth'];
        delete props['onFocus'];
        this.constraint = Constraints.format(REGEX_TIME_PICKER, RS.getString("E136"));
        let timePickerCss = "input-group " + (this.state.hasError ? 'has-error' : '');
        return (
            <div className="time-picker date">
                {this.props.title ?
                    <div className={"title " + (this.props.required ? "required" : "")}>
                        {this.props.title}
                    </div> : null
                }
                <div className={timePickerCss}>
                    <input
                        id="inputTimePicker"
                        {...props}
                        onChange={this.onChangeInputTarget}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        ref="inputTarget"
                        type={this.props.type || ''}
                        className="form-control form-text-input"
                        value={this.state.timeString || ''}
                        placeholder={this.props.hintText}
                    />
                    {
                        (this.state.isOpen && !this.state.errorText) &&
                        <span className="clear" onClick={this.handleClear}>×</span>
                    }
                    {
                        !_.isEmpty(this.state.errorText) ?
                            <PopoverIcon
                                className="popover-error popover-input"
                                ref={(popoverIcon) => this.popoverIcon = popoverIcon}
                                message={this.state.errorText}
                                onHide={this.onHidePopover}
                                showOnHover
                                iconPath='error-icon.png'
                            /> : null
                    }

                    <span className={'input-group-addon ' + (this.props.disabled ? 'disabled-span' : '')}>
                        <i className="fa fa-clock-o" aria-hidden="true" onClick={() => this.refs.inputTarget.focus()}></i>
                    </span>
                </div>
                <Overlay
                    animation={false}
                    rootClose
                    show={this.state.isOpen}
                    onHide={this.onHide}
                    placement="bottom"
                    container={this}
                    target={() => findDOMNode(this.refs.inputTarget)}
                >
                    <CustomPopover
                        value={this.state.time}
                        originValue={this.props.defaultValue}
                        onChange={this.onChangePopoverValue}
                    />
                </Overlay>
            </div>
        )
    }
}

CommonTimePicker.propTypes = {
    title: PropTypes.string,
    defaultValue: PropTypes.object,
    constraint: PropTypes.object,
    onChange: PropTypes.func
}

export default CommonTimePicker;