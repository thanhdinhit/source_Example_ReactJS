import React, { PropTypes } from 'react';
import _ from 'lodash';

import CommonDatePicker from './DatePicker/CommonDatePicker';
import RS, { Option } from '../../resources/resourceManager';
import RaisedButton from './RaisedButton';
import commonFieldValidation from '../../validation/common.field.validation';

const propTypes = {
    onChange: PropTypes.func,
    startDate: PropTypes.object,
    endDate: PropTypes.object,
    actions: PropTypes.array
};
class FilterDateRangeV2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: null,
            endDate: null,
            isInValid: true
        };
        this.handleApplyFilter = this.handleApplyFilter.bind(this);
        this.handleOnBlurDateTime = this.handleOnBlurDateTime.bind(this);
    }

    componentDidMount() {
        $(document).on('click', '.raised-button-disable', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.getTime(this.props.startDate), this.getTime(nextProps.startDate))) {
            this.setState({ startDate: nextProps.startDate }, () => {
                ['startDate', 'endDate'].forEach(item => {
                    this.validateFieldHasError(item);
                });
            });
        }
        if (!_.isEqual(this.getTime(this.props.endDate), this.getTime(nextProps.endDate))) {
            this.setState({ endDate: nextProps.endDate }, () => {
                ['startDate', 'endDate'].forEach(item => {
                    this.validateFieldHasError(item);
                });
            });
        }
    }

    componentWillUnmount() {
        $(document).off('click', '.raised-button-disable');
    }

    getTime(date) {
        return date ? date.getTime() : undefined;
    }

    handleOnBlurDateTime(type, date) {
        this.setState({ [type]: date }, () => {
            switch (type) {
                case 'startDate': {
                    this.validateFieldHasError('endDate');
                    break;
                }
                case 'endDate': {
                    this.validateFieldHasError('startDate');
                    break;
                }
            }
            setTimeout(() => this.checkIsInValid(), 0);
        });
    }

    validateFieldHasError(field) {
        if (this[field].hasError()) {
            this[field].validate();
        }
    }

    handleApplyFilter() {
        if (this.startDate.validate() && this.endDate.validate()) {
            return this.props.onChange(this.startDate.getValue(), this.endDate.getValue());
        }
    }

    checkIsInValid() {
        if ((this.startDate && this.startDate.hasError())
            || (this.endDate && this.endDate.hasError())
            || (this.startDate && !this.startDate.getValue())
            || (this.endDate && !this.endDate.getValue())) {
            return this.setState({ isInValid: true });
        }
        return this.setState({ isInValid: false });
    }

    render() {
        const startDateConstraint = commonFieldValidation.dateRange(null, this.state.endDate);
        const endDateConstraint = commonFieldValidation.dateRange(this.state.startDate, null);

        const actions = [
            <RaisedButton
                key={'cancel'}
                className="raised-button-fourth"
                label={RS.getString('CANCEL', null, Option.CAPEACHWORD)}
                onClick={() => { }}
            />,
            <RaisedButton
                disabled={this.state.isInValid}
                key={"OK"}
                label={RS.getString('OK', null, Option.CAPEACHWORD)}
                onClick={this.handleApplyFilter}
            />
        ];

        return (
            <div className="filter-date-range">
                <div className="row">
                    <div className="col-sm-6">
                        <CommonDatePicker
                            required
                            title={RS.getString('FROM')}
                            ref={(input) => this.startDate = input}
                            hintText="dd/mm/yyyy"
                            id="start-date"
                            defaultValue={this.state.startDate}
                            orientation="bottom auto"
                            language={RS.getString("LANG_KEY")}
                            onBlur={this.handleOnBlurDateTime.bind(this, 'startDate')}
                            constraint={startDateConstraint}
                        />
                    </div>
                    <div className="col-sm-6">
                        <CommonDatePicker
                            required
                            title={RS.getString('TO')}
                            ref={(input) => this.endDate = input}
                            hintText="dd/mm/yyyy"
                            id="end-date"
                            defaultValue={this.state.endDate}
                            orientation="bottom auto"
                            language={RS.getString("LANG_KEY")}
                            onBlur={this.handleOnBlurDateTime.bind(this, 'endDate')}
                            constraint={endDateConstraint}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12 text-right">
                        {actions}
                    </div>
                </div>
            </div>
        );
    }
}

FilterDateRangeV2.propTypes = propTypes;
export default FilterDateRangeV2;