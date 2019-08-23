import React, { PropTypes } from 'react';
import { validate } from '../../validation/validate.function';
import Select from '../elements/Select/Select';
import PopoverIcon from './PopoverIcon/PopoverIcon';
import _ from 'lodash';
import debounceHelper from '../../utils/debounceHelper';
import { WAITING_TIME } from '../../core/common/constants';

const propTypes = {
    constraint: PropTypes.object,
    className: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    value: PropTypes.any,
    loadOptions: PropTypes.func,
    noResultsText: PropTypes.string,
    propertyItem: PropTypes.object,
    title: PropTypes.string,
    allowAllOption: PropTypes.bool,
    required: PropTypes.bool
};

class CommonSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { errorText: '', value: '', hasError: false };
        this._options = [];
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.handleOnClose = this.handleOnClose.bind(this);
    }

    componentWillMount() {
        let value = this.handleValue(this.props.value);
        this.setState({ value });
        if (this.props.options) {
            this._options = this.convertDataToOptions(this.props.options);
        }
    }

    componentDidMount() {
        this.handleOnCloseCallBack = debounceHelper.debounce(this.validate, WAITING_TIME);
    }
    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.value, nextProps.value)) {
            let value = this.handleValue(nextProps.value);
            this.setState({ value });
        }
        if (!_.isEqual(this.props.options, nextProps.options)) {
            this._options = this.convertDataToOptions(nextProps.options);
        }
    }
    convertDataToOptions(data) {
        if (!this.props.propertyItem) return data;

        let self = this;
        return _.map(data, function (item) {
            return self.cookDataToOption(item);
        });
    }

    handleValue(value) {
        if (typeof value !== 'object') {
            return value;
        }
        if (_.isEmpty(value)) return null;

        return this.props.propertyItem ? this.cookDataToOption(value) : value;
    }

    cookDataToOption(data) {
        if (!data) return data;
        let option = _.cloneDeep(data);
        for (let key in this.props.propertyItem) {
            let value = this.props.propertyItem[key];
            if (_.includes(value, '.')) {
                let arr = _.split(value, '.');
                _.forEach(arr, i => {
                    data = data[i];
                })
                option[key] = data;
            } else {
                option[key] = option[value];
            }
        }
        return option;
    }

    validate() {
        if (!this.props.constraint)
            return true;
        const constraint = _.assign({}, this.props.constraint);
        let rs = validate.bind(this, this.getValue(), constraint)();
        this.setState({ hasError: !rs })
        return rs;
    }

    handleOnChange(value) {
        this.handleOnCloseCallBack();
        this.setState({ value }, () => {
            this.props.onChange && this.props.onChange(value);
        });
    }

    handleOnFocus() {
        this.setState({ hasError: false });
        if (this.state.errorText !== '') {
            this.popoverIcon.show()
        }
    }
    handleOnClose() {
        this.handleOnCloseCallBack();
        if (this.state.errorText !== '') {
            this.popoverIcon.hide()
        }
    }

    getValue() {
        return this.state.value;
    }

    setValue(value) {
        value = this.handleValue(value);
        this.setState({ value });
    }

    render() {
        const props = _.cloneDeep(this.props);
        if (props.allowOptionAll && props.optionAllText) {
            props.placeholder = props.optionAllText;
        }

        delete props['constraint'];
        delete props['ref'];
        delete props['onChange'];
        delete props['allowAllOption'];
        delete props['optionAllText'];
        return (
            <div className={this.props.className}>
                {this.props.title &&
                    <div className={"title " + (this.props.required ? "required" : "")}>
                        {this.props.title}
                    </div>
                }
                <div className={"common-select " + (this.state.hasError ? ' has-error' : '') + (this.props.allowOptionAll ? ' allow-all-option' : '')}>
                    {
                        this.props.loadOptions ?
                            <Select.Async
                                {...props}
                                className={this.props.className}
                                value={this.state.value}
                                options={this._options}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onClose={this.handleOnClose}
                                loadOptions={this.props.loadOptions}
                                noResultsText={this.props.noResultsText || 'No option found!'}
                                ref={(input) => this.input = input}
                            />
                            :
                            <Select
                                {...props}
                                className={this.props.className}
                                value={this.state.value}
                                options={this._options}
                                onChange={this.handleOnChange}
                                onFocus={this.handleOnFocus}
                                onClose={this.handleOnClose}
                                noResultsText={this.props.noResultsText || 'No option found!'}
                                ref={(input) => this.input = input}
                            />
                    }
                    {
                        !_.isEmpty(this.state.errorText) ?
                            <PopoverIcon
                                className="popover-error popover-input"
                                message={this.state.errorText}
                                ref={(popoverIcon) => this.popoverIcon = popoverIcon}
                                showOnHover
                                iconPath='error-icon.png'
                            /> : null
                    }
                </div>
            </div>
        );
    }
}

CommonSelect.defaultProps = {
    componentName: 'CommonSelect'
};

CommonSelect.propTypes = propTypes;

export default CommonSelect;