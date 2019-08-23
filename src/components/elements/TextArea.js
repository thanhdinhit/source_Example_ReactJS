import React, { PropTypes } from 'react';
import _ from 'lodash';
import { validate } from '../../validation/validate.function';
import PopoverIcon from './PopoverIcon/PopoverIcon';

class TextArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = { errorText: '', value: '', hasError: false };
        this.constraint = {};
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
    }

    componentDidMount() {
        this.setState({ value: this.props.defaultValue || '' });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.defaultValue != this.props.defaultValue) {
            this.setState({ value: nextProps.defaultValue });
        }
        if (nextProps.errorText) {
            this.setState({ errorText: nextProps.errorText , hasError: true});
        }
    }

    validate() {
        const constraint = _.assign({}, this.constraint, this.props.constraint);
        let rs = validate.bind(this, this.getValue(), constraint)();
        this.setState({ hasError: !rs })
        return rs;
    }

    handleOnChange(e) {
        this.setValue(e.target.value);
        if (this.props.onChange)
            this.props.onChange(e, e.target.value)
    }

    handleOnBlur() {
        this.isFocus = false;
        this.validate();
        if (this.state.errorText !== '') {
            this.popoverIcon.hide()
        }
        this.props.onBlur && this.props.onBlur(this.getValue());
    }

    handleOnFocus() {
        this.isFocus = true;
        this.setState({ hasError: false });
        if (this.state.errorText !== '') {
            this.popoverIcon.show()
        }
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    getValue() {
        return this.input.value;
    }

    setValue(value) {
        this.setState({ value },()=>this.validate());
    }

    render() {
        const props = _.cloneDeep(this.props);
        delete props['constraint'];
        delete props['ref'];
        delete props['onChange'];
        delete props['defaultValue'];
        delete props['errorText'];
        delete props['onFocus'];
        delete props['line'];
        delete props['isResize'];
        let className = "input-container "
            + (this.state.hasError ? 'has-error ' : '')
            + (this.state.errorText ? 'has-error-text' : '');
        return (
            <div className="text-area">
                {this.props.title ?
                    <div className={"title " + (this.props.required ? "required" : "")}>
                        {this.props.title}
                    </div> : null
                }
                <div className={className}>
                    <textarea
                        {...props}
                        style={{ resize: 'none' }}
                        onChange={this.handleOnChange}
                        onFocus={this.handleOnFocus}
                        ref={(input) => this.input = input}
                        className="form-control form-text-input"
                        value={this.state.value}
                        rows={this.props.line}
                        onBlur={this.handleOnBlur}
                    />
                    {
                        !_.isEmpty(this.state.errorText) ?
                            <PopoverIcon
                                ref={(input) => this.popoverIcon = input}
                                className="popover-error popover-input"
                                message={this.state.errorText}
                                showOnHover
                                iconPath='error-icon.png'
                            /> : null
                    }
                </div>
            </div>
        );
    }
}

TextArea.propTypes = {
    constraint: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    defaultValue: PropTypes.string,
    errorText: PropTypes.string,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    onFocus: PropTypes.func,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    isResize: PropTypes.bool,
    onBlur: PropTypes.func
};
TextArea.defaultProps = {
    isResize: true
};

export default TextArea;