import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Overlay from 'react-bootstrap/lib/Overlay';
import RaisedButton from '../RaisedButton';
import RS from '../../../resources/resourceManager';
import Select from './Select'
import RadioButtons from '../RadioButtons/RadioButtons';
import moment from 'moment'
import CommonDatePicker from '../DatePicker/CommonDatePicker';
import CommonSelect from '../CommonSelect.component';
import { dateTimeOperatorOptions } from '../../../core/common/constants';
import _ from 'lodash';

let defaultValue = {
    operator1: undefined,
    value1: undefined,
    operator2: undefined,
    value2: undefined,
    andor: 'and',
    oneField: true
}
var CustomPopover = React.createClass({
    getInitialState: function () {
        return {
            oneField: true
        }
    },
    handleChangeOperator1: function (option) {
        this.props.handleChangeOperator1(option)
    },
    handleChangeOperator2: function (option) {
        this.props.handleChangeOperator2(option)
    },

    toggleOneField: function () {
        this.props.handleChangeOneField(!this.props.selectedValue.oneField);
    },

    render: function () {
        return (
            <div className="popover-container ">
                <div className="filter-content-date">
                    <div className="row">
                        <div className="col-md-4">
                            <CommonSelect
                                options={dateTimeOperatorOptions}
                                value={this.props.selectedValue.operator1}
                                onChange={this.handleChangeOperator1}
                                placeholder=""
                                searchable={false}
                                clearable={false}
                            />
                        </div>
                        <div className="col-md-6">
                            {
                                this.props.type == 'number' ?
                                    <div>
                                        <input
                                            className="form-control"
                                            id="value1"
                                            value={this.props.selectedValue.value1 || ''}
                                            onChange={this.props.handleChangevalue1}
                                        />
                                    </div> :
                                    <div>
                                        <CommonDatePicker
                                            hintText='dd/mm/yyyy'
                                            defaultValue={this.props.selectedValue.value1}
                                            onChange={this.props.handleChangevalue1}
                                        />
                                    </div>
                            }

                        </div>
                        <div className="col-md-2">
                            {
                                this.props.selectedValue.oneField &&
                                <div className="btn-expand" onClick={this.toggleOneField}>
                                    <img className="btn-datefilter" src={require("../../../images/AddMoreDateFilter.png")} />
                                </div>
                            }
                        </div>
                    </div>
                    {
                        !this.props.selectedValue.oneField ? <div>
                            <div className="row" style={{ marginTop: '15px', marginBottom: '15px' }}>
                                <RadioButtons
                                    list={[{ title: 'and', value: 'and' }, { title: 'or', value: 'or' }]}
                                    value={this.props.selectedValue.andor}
                                    inline={true}
                                    handleChange={this.props.handleChangeAndOr}
                                />
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <CommonSelect
                                        options={dateTimeOperatorOptions}
                                        value={this.props.selectedValue.operator2}
                                        onChange={this.handleChangeOperator2}
                                        placeholder=""
                                        searchable={false}
                                        clearable={false}
                                    />
                                </div>
                                <div className="col-md-6">
                                    {

                                        this.props.type == 'number' ?
                                            <div>
                                                <input
                                                    className="form-control"
                                                    id="value2"
                                                    value={this.props.selectedValue.value2 || ''}
                                                    onChange={this.props.handleChangevalue2}
                                                />
                                            </div> :
                                            <div>
                                                <CommonDatePicker
                                                    hintText='dd/mm/yyyy'
                                                    defaultValue={this.props.selectedValue.value2}
                                                    onChange={this.props.handleChangevalue2}
                                                />
                                            </div>
                                    }
                                </div>
                                <div className="col-md-2">
                                    <div className="btn-collapse" onClick={this.toggleOneField}>
                                        <img className="btn-datefilter" src={require("../../../images/DeleteDateFilter.png")} />
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }

                </div>
                <div className="footer-date-time">
                    <div className="button-container">
                        <RaisedButton
                            label={RS.getString('FILTER')}
                            onClick={this.props.handleSubmitFilter}
                        />
                        <RaisedButton
                            label={RS.getString('CANCEL')}
                            onClick={this.props.handleCancel}
                            className="raised-button-fourth"
                        />
                    </div>
                </div>

            </div>
        )
    }
})

var FilterDateTime = React.createClass({
    propTypes: {
        type: PropTypes.string, // date default, accept 'number'
        title: PropTypes.string,
        selectedValue: PropTypes.object,
        allValueText: PropTypes.string,
        onChange: PropTypes.func.isRequired
    },
    getDefaultProps: function () {
        return {
            componentName: 'FilterDateTime',
            type: 'date'
        }
    },
    getInitialState: function () {
        return {
            showDialog: false,
            isOpen: false,
            selectedValue: {
                operator1: undefined,
                value1: undefined,
                operator2: undefined,
                value2: undefined,
                andor: 'and',
                oneField: true
            },
            preSelectedValue: {
                operator1: undefined,
                value1: undefined,
                operator2: undefined,
                value2: undefined,
                andor: 'and',
                oneField: true
            },
        }
    },
    componentWillMount: function () {
        if (this.props.selectedValue) {
            this.setState({
                selectedValue: _.assign({}, this.state.selectedValue, this.props.selectedValue),
                preSelectedValue: _.assign({}, this.state.selectedValue, this.props.selectedValue)
            });
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (!_.isEmpty(nextProps.selectedValue)) {
            this.setState({
                selectedValue: _.assign({}, nextProps.selectedValue),
                preSelectedValue: _.assign({}, nextProps.selectedValue)
            });
        }
        else {
            this.setState({
                selectedValue: _.assign({}, defaultValue),
                preSelectedValue: _.assign({}, defaultValue)
            });
        }
    },
    filterClick: function () {
        this.setState({ isOpen: !this.state.isOpen, selectedValue: _.assign({}, this.state.preSelectedValue) })
    },

    handleCancel: function () {
        this.setState({ isOpen: false, selectedValue: _.assign({}, this.state.preSelectedValue) })

    },
    handleSubmitFilter: function () {
        this.setState({ isOpen: false, preSelectedValue: _.assign({}, this.state.selectedValue) })
        this.props.onChange(this.state.selectedValue)
    },
    handleChangevalue1: function (value) {
        this.state.selectedValue.value1 = value;
        this.state.showDialog = false;
        this.forceUpdate()
    },
    handleChangevalue2: function (value) {
        this.state.selectedValue.value2 = value;
        this.state.showDialog = false;
        this.forceUpdate()
    },
    handleChangeNumbervalue1: function (event) {
        this.state.selectedValue.value1 = event.target.value;
        this.state.showDialog = false;
        this.forceUpdate()
    },
    handleChangeNumbervalue2: function (event) {
        this.state.selectedValue.value2 = event.target.value;
        this.state.showDialog = false;
        this.forceUpdate()
    },
    getValueText: function () {
        let arr = []
        if (this.state.preSelectedValue.operator1) {
            arr.push(this.state.preSelectedValue.operator1.label)
        }
        if (this.state.preSelectedValue.value1) {
            if (this.props.type == 'number') {
                arr.push(this.state.preSelectedValue.value1)
            }
            else
                arr.push(moment(this.state.preSelectedValue.value1).format('DD/MM/YYYY'))
        }

        if (!this.state.selectedValue.oneField) {
            if (this.state.preSelectedValue.operator2) {
                arr.push(this.state.preSelectedValue.operator2.label)
            }
            if (this.state.preSelectedValue.value2) {
                if (this.props.type == 'number') {
                    arr.push(this.state.preSelectedValue.value2)
                }
                else
                    arr.push(moment(this.state.preSelectedValue.value2).format('DD/MM/YYYY'))
            }
            arr.splice(2, 0, this.state.preSelectedValue.andor)
        }

        return arr.join(' ')
    },
    handleChangeOperator1: function (option) {
        this.state.selectedValue.operator1 = option
        this.forceUpdate()
    },
    handleChangeOperator2: function (option) {
        this.state.selectedValue.operator2 = option
        this.forceUpdate()
    },
    handleChangeAndOr: function (value) {
        this.state.selectedValue.andor = value
    },
    handleChangeOneField: function (value) {
        this.state.selectedValue.oneField = value;
        this.forceUpdate()
    },
    onHide: function () {
        if (!this.state.showDialog)
            this.setState({ isOpen: false, selectedValue: _.assign({}, this.state.preSelectedValue) })
    },
    onShowDialog: function () {
        this.state.showDialog = true;
    },
    onDismissDialog: function () {
        setTimeout(function () {
            this.state.showDialog = false;
        }.bind(this), 200)

    },
    onClearValue: function(e){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            selectedValue:{
                ...this.state.selectedValue,
                value1: undefined,
                value2: undefined,
                operator1: undefined,
                operator2: undefined
            },
            preSelectedValue: {
                ...this.state.preSelectedValue,
                value1: undefined,
                value2: undefined,
                operator1: undefined,
                operator2: undefined
            }
        })
    },
    render: function () {
        return (
            <div className="filter-select-list" ref="target">
                {
                    !!this.props.title &&
                    <div className="title">{this.props.title}</div>
                }
                <div className="value-select" onClick={this.filterClick}>
                    <span className="text-value"> {this.getValueText()}
                        <i className="clear icon-close" onClick = {this.onClearValue}></i>
                    </span>
                    <span className="input-group-addon">
                        <i className="fa fa-calendar" aria-hidden="true"></i>
                    </span>
                </div>
                <Overlay
                    animation={false}
                    rootClose
                    show={this.state.isOpen}
                    onHide={this.onHide}
                    placement="bottom"
                    container={this}
                    target={() => ReactDOM.findDOMNode(this.refs.target)}
                >
                    <CustomPopover
                        onDismissDialog={this.onDismissDialog}
                        onShowDialog={this.onShowDialog}
                        type={this.props.type}
                        handleCancel={this.handleCancel}
                        handleSubmitFilter={this.handleSubmitFilter}
                        selectedValue={this.state.selectedValue}
                        handleChangeOperator1={this.handleChangeOperator1}
                        handleChangeOperator2={this.handleChangeOperator2}
                        handleChangeAndOr={this.handleChangeAndOr}
                        handleChangevalue1={this.props.type == 'number' ? this.handleChangeNumbervalue1 : this.handleChangevalue1}
                        handleChangevalue2={this.props.type == 'number' ? this.handleChangeNumbervalue2 : this.handleChangevalue2}
                        handleChangeOneField={this.handleChangeOneField}
                    />
                </Overlay>
            </div >
        )
    }
})

export default FilterDateTime;