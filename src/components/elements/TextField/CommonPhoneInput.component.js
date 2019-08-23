import React, { PropTypes } from 'react'
import CommonTextField from './CommonTextField.component'
import StringUtils from '../../../utils/stringUtil';
import { REGEX_PHONE } from '../../../core/common/constants';
import { MAX_LENGTH_INPUT } from '../../../core/common/config';

class CommonPhoneInput extends React.Component {
    constructor(props, context, value) {
        super(props, context)
        this.onBlur = this.onBlur.bind(this)
        this.getValue = this.getValue.bind(this)
        this.setValue = this.setValue.bind(this)
    }
    onBlur() {
        if (REGEX_PHONE.test(this.input.getValue())) {
            this.input.setValue(StringUtils.formatPhone(this.input.getValue()));
        }
        this.props.onBlur && this.props.onBlur(this.getValue());
    }
    getValue() {
        return this.input.getValue();
    }
    setValue(value) {
        this.input.setValue(value)
    }
    validate() {
        return this.input.validate()
    }
    render() {
        return (
            <CommonTextField
                {...this.props}
                onBlur={this.onBlur}
                ref={(input) => this.input = input}
                maxLength={MAX_LENGTH_INPUT.MOBILE_PHONE}
            />
        )
    }
}

CommonPhoneInput.propTypes = {

}

export default CommonPhoneInput;