import React from 'react'
import ReactDOM from 'react-dom'
import Overlay from 'react-bootstrap/lib/Overlay';
import RaisedButton from './RaisedButton';
import RS from '../../resources/resourceManager';
import PropTypes from "prop-types";
import _ from 'lodash';
import CommonSelect from '../elements/CommonSelect.component';
import { findDOMNode } from 'react-dom';
import FilterMoreCommonSelect from '../elements/Filter/FilterMoreCommonSelect';
import { COUNTRY } from '../../core/common/config';

class CustomPopover extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isAU: this.props.isAU,
            data: undefined,
            address: {}
        };
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleAddFilterSelect = this.handleAddFilterSelect.bind(this);
        this.handleCancelAddress = this.handleCancelAddress.bind(this);
    }

    componentWillMount() {
        this.setState({
            filterEmployee: this.props.filterEmployee
        });
    }


    handleFilterChange() {
        this.props.handleFilterChange(this.state.filterEmployee);
        this.props.onHide();
        this.setState({
            filterEmployee: this.props.filterEmployee
        });
    }

    handleCancelAddress() {
        this.setState({
            filterEmployee: {
                ...this.state.filterEmployee,
                filter: this.state.filterEmployee.prefilter,
            }
        });
        this.props.onHide();
    }

    handleAddFilterSelect(field, data) {
        this.setState({
            filterEmployee: {
                filter: {
                    address: {
                        ...this.state.filterEmployee.filter.address,
                        [field]: data && data.id ? data.id : undefined
                    }
                }
            }
        });
    }

    renderfilterAddressAU() {
        return (
            <div className="my-custom-popover">
                <div className="body-center">
                    <div className="body-container">
                        <div className="body-content">
                            <div className="col-sm-12">
                                <CommonSelect
                                    title={RS.getString('STATE')}
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={this.props.states}
                                    allowOptionAll={true}
                                    optionAllText='---'
                                    name="state"
                                    value={this.state.filterEmployee.filter.address.states || ''}
                                    onChange={this.handleAddFilterSelect.bind(this, "states")}
                                />
                            </div>
                            <div className="col-sm-12">
                                <CommonSelect
                                    title={RS.getString('CITY')}
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={this.props.cities}
                                    allowOptionAll={true}
                                    optionAllText='---'
                                    name="city"
                                    value={this.state.filterEmployee.filter.address.cities || ''}
                                    onChange={this.handleAddFilterSelect.bind(this, "cities")}
                                />
                            </div>
                        </div>
                        <div className="footer-content">
                            <RaisedButton
                                label={RS.getString('CANCEL')}
                                onClick={this.handleCancelAddress}
                                className="raised-button-fourth"
                            />
                            <RaisedButton
                                label={RS.getString('OK')}
                                onClick={this.handleFilterChange}
                                className="raised-button-first"
                            />
                        </div>
                    </div >
                </div >
            </div >
        )
    }

    renderfilterAddressVN() {
        return (
            <div className="my-custom-popover">
                <div className="body-center">
                    <div className="body-container">
                        <div className="body-content">
                            <div className="col-sm-12">
                                <CommonSelect
                                    title={RS.getString('CITY_PROVINCE')}
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={this.props.cities}
                                    allowOptionAll={true}
                                    optionAllText='---'
                                    name="city"
                                    clear
                                    value={this.state.filterEmployee.filter.address.cities || ''}
                                    onChange={this.handleAddFilterSelect.bind(this, "cities")}
                                />
                            </div>
                            <div className="col-sm-12">
                                <CommonSelect
                                    title={RS.getString('DISTRICT')}
                                    propertyItem={{ label: 'name', value: 'id' }}
                                    options={this.props.districts}
                                    allowOptionAll={true}
                                    optionAllText='---'
                                    name="district"
                                    clear
                                    value={this.state.filterEmployee.filter.address.districts || ''}
                                    onChange={this.handleAddFilterSelect.bind(this, "districts")}
                                />
                            </div>
                        </div>
                        <div className="footer-content">
                            <RaisedButton
                                label={RS.getString('CANCEL')}
                                onClick={this.handleCancelAddress}
                                className="raised-button-fourth"
                            />
                            <RaisedButton
                                label={RS.getString('OK')}
                                onClick={this.handleFilterChange}
                                className="raised-button-first"
                            />
                        </div>
                    </div >
                </div >
            </div >
        )
    }

    render() {
        return (
            <div>
                {
                    this.state.isAU ? this.renderfilterAddressAU() : this.renderfilterAddressVN()
                }
            </div>
        )
    }
}
CustomPopover.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    originValue: PropTypes.object
}

class FilterAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            displayValue: {},
            filterEmployee: {
                filter: {
                    address: {}
                }
            },
            isAU: undefined,
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.onHide = this.onHide.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    componentWillMount() {
        switch (LOCALIZE.COUNTRY) {
            case COUNTRY.AU:
                this.setState({
                    isAU: true
                })
                break;
            case COUNTRY.VN:
                this.setState({
                    isAU: false
                })
                break;
        }
    }

    componentDidMount() {
        this.setState({
            filterEmployee: { filter: { address: this.props.value || {} } }
        });
    }

    handleCreateDisplayValue(address) {
        let str = [];
        for (let prop in address) {
            let element = this.props[prop].find(x => x.id == address[prop])
            if (element && element.name) str.push(element.name)
        }
        return str.join(', ')
    }

    handleFilterChange(e) {
        this.setState({
            filterEmployee: e
        });
        this.props.handleFilterChange(e)
    }

    handleOpen() {
        this.setState({
            isOpen: true
        })
    }

    onHide() {
        this.setState({ isOpen: false })
    }

    render() {
        let string = this.handleCreateDisplayValue(this.state.filterEmployee.filter.address) || RS.getString('ALL')
        const props = _.cloneDeep(this.props);
        delete props['cities']
        delete props['states']
        delete props['districts']
        delete props['trash']
        delete props['handleRemoveFilterMore']
        delete props['filterEmployee']
        delete props['filterTitle']
        delete props['displayName']
        delete props['field']
        delete props['handleFilterChange']
        delete props['componentName']

        return (
            <div className="filter-address date">
                <div className={"title"}>
                    {RS.getString('ADDRESS')}
                    < i
                        className="trash-icon fa fa-trash remove-filter"
                        aria-hidden="true"
                        onClick={this.props.handleRemoveFilterMore ? this.props.handleRemoveFilterMore.bind(null, this.props.field) : ''}
                    />
                </div>
                <div className="input-group has-select-arrow">
                    <input
                        {...props}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        ref="inputTarget"
                        type={this.props.type || ''}
                        className="form-control form-text-input"
                        value={string}
                        placeholder={RS.getString('ALL')}
                        onClick={this.handleOpen}
                        onChange={() => { }}
                    />
                    <span className=" input-group-addon Select-arrow-zone" onClick={this.handleOpen}>
                        <span className="Select-arrow"></span>
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
                        cities={this.props.cities}
                        states={this.props.states}
                        districts={this.props.districts}
                        onHide={this.onHide}
                        handleFilterChange={this.handleFilterChange}
                        data={this.props.data}
                        filterEmployee={this.state.filterEmployee}
                        isAU={this.state.isAU}
                    />
                </Overlay>
            </div>
        )
    }
}

FilterAddress.propTypes = {
    title: PropTypes.string,
    defaultValue: PropTypes.object,
    onChange: PropTypes.func,
    handleRemoveFilterMore: PropTypes.func,
    value: PropTypes.object
}


FilterAddress.defaultProps = {
        componentName: 'FilterAddress'
}

export default FilterAddress;