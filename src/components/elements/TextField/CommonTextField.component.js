import React, { PropTypes } from 'react';
import _ from 'lodash';
import { validate } from '../../../validation/validate.function';
import PopoverIcon from '../PopoverIcon/PopoverIcon';
import debounceHelper from '../../../utils/debounceHelper';
import { WAITING_TIME } from '../../../core/common/constants';

class CommonTextField extends React.Component {
    constructor(props) {
        super(props);
        this.state = { errorText: '', value: '', hasError: false };
        this.constraint = {};
        this.isFocus = false;
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
        this.onHidePopover = this.onHidePopover.bind(this);
        this.onClearValue = this.onClearValue.bind(this);
        this.focus = this.focus.bind(this);
    }

    componentDidMount() {
        this.setState({ value: this.props.defaultValue || '' })
        this.handleOnChangeCallBack = debounceHelper.debounce(this.validate, WAITING_TIME);
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue != this.props.defaultValue) {
            this.setState({ value: nextProps.defaultValue });
        }
        if (nextProps.errorText) {
            this.setState({ errorText: nextProps.errorText, hasError: true });
        }
    }
    validate(constraintOptional) {
        if (!this._isMounted) return;
        const constraint = _.assign({}, this.constraint, constraintOptional || this.props.constraint);
        const rs = validate.bind(this, this.getValue(), constraint)();
        this.setState({ hasError: !rs })
        return rs;
    }

    focus() {
        this.input.focus()
    }

    handleOnChange(e) {
        this.handleOnChangeCallBack();
        this.setValuePrivate(e.target.value);
        this.props.onChange && this.props.onChange(e, e.target.value);
    }

    handleOnFocus() {
        this.isFocus = true;
        this.setState({ hasError: false });
        if (this.state.errorText !== '') {
            this.popoverIcon.show()
        }
        this.props.onFocus && this.props.onFocus();
    }

    handleOnBlur() {
        this.isFocus = false;
        this.validate();
        if (this.state.errorText !== '') {
            this.popoverIcon.hide()
        }
        this.props.onBlur && this.props.onBlur(this.getValue());
    }

    getValue() {
        return _.trim(this.input.value);
    }

    setValue(value) {
        this.setState({ value }, () => this.validate());
    }
    setValuePrivate(value) {
        this.setState({ value })
    }
    onHidePopover() {
        if (!this.isFocus) this.popoverIcon.hide();
    }

    onClearValue() {
        this.setValue("");
        this.handleOnChangeCallBack();
        this.props.onChange && this.props.onChange("");
    }

    render() {
        const props = _.cloneDeep(this.props);
        const { hintText, fullWidth } = this.props;
        delete props['componentName'];
        delete props['constraint'];
        delete props['ref'];
        delete props['onChange'];
        delete props['defaultValue'];
        delete props['errorText'];
        delete props['hintText'];
        delete props['fullWidth'];
        delete props['onFocus'];
        delete props['addon'];
        delete props['clear'];
        delete props['field'];

        let datePickerCSS = (this.props.addon ? 'input-group ' : '')
            + (this.state.hasError ? 'has-error ' : '')
            + (this.state.errorText ? 'has-error-text' : '');
        let styleInput = this.props.clear ? { paddingRight: '50px' } : { paddingRight: '30px' }
        return (
            <div className={this.props.className || ''}>
                {this.props.title ?
                    <div className={"title " + (this.props.required ? "required" : "")}>
                        {this.props.title}
                    </div> : null
                }
                <div className={datePickerCSS}>
                    <div className="input-container">
                        <input
                            {...props}
                            style={styleInput}
                            onChange={this.handleOnChange}
                            onFocus={this.handleOnFocus}
                            onBlur={this.handleOnBlur}
                            ref={(input) => input && (this.input = input)}
                            type={this.props.type || ''}
                            className="form-control form-text-input"
                            value={this.state.value}
                            placeholder={hintText}
                            onKeyPress={this.props.onKeyPress}
                            onKeyDown={this.props.onKeyDown}
                            maxLength={this.props.maxLength || ''}
                        />
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
                        {
                            this.props.clear ? <i className="clear icon-close" onClick={this.onClearValue}></i> : null
                        }
                    </div>
                    {
                        this.props.addon &&
                        <span className="input-group-addon">
                            {this.props.addon}
                        </span>
                    }

                </div>
            </div>
        );
    }
}

CommonTextField.propTypes = {
    constraint: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    errorText: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    onBlur: PropTypes.func,
    hintText: PropTypes.string,
    type: PropTypes.string,
    onKeyPress: PropTypes.func,
    addon: PropTypes.object,
    clear: PropTypes.bool,
    onKeyDown: PropTypes.func,
};

CommonTextField.defaultProps = {
    componentName: 'CommonTextField'
};

export default CommonTextField;