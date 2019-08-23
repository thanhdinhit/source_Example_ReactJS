import React, { PropTypes } from 'react';
import _ from 'lodash';

import CommonSelect from './CommonSelect.component';

class AvatarSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.renderOption = this.renderOption.bind(this);
    }

    renderOption(option) {
        return (
            <div className="avatar-option">
                <img className="avatar-img" src={option.photoUrl ? (API_FILE + option.photoUrl)
                    : require('../../images/avatarDefault.png')} />
                <span className="avatar-label">{option.label}</span>
            </div>
        );
    }

    setValue(value) {
        this.input.setValue(value);
    }

    getValue() {
        return this.input.getValue();
    }

    validate() {
        return this.input.validate();
    }

    render() {
        const props = _.cloneDeep(this.props);
        let cssClassName = "has-avatar " + (this.props.className || '')
        delete props['className'];
        return (
            <CommonSelect
                className={cssClassName}
                {...props}
                valueRenderer={this.renderOption}
                optionRenderer={this.renderOption}
                ref={input => this.input = input}
            />
        );
    }
}

AvatarSelect.propTypes = {
    disabled: PropTypes.bool,
    className: PropTypes.string,
    tabIndex: PropTypes.string,
    placeholder: PropTypes.string,
    clearable: PropTypes.bool,
    searchable: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.any,
    options: PropTypes.array,
    multi: PropTypes.bool,
    propertyItem: PropTypes.object
};

export default AvatarSelect;