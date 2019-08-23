import React from 'react'
import Overlay from 'react-bootstrap/lib/Overlay';
import RaisedButton from '../RaisedButton';
import RS from '../../../resources/resourceManager';
import PropTypes from "prop-types";
import FilterModal from '../Filter/FilterModal';
import { findDOMNode } from 'react-dom';

export default React.createClass({
    propTypes: {
        handleSearchChange: PropTypes.func.isRequired,
        children: function (props, propName, componentName) {
            if (props[propName])
                if (!/FilterModal/.test(props[propName].props.componentName)) {
                    return new Error(
                        'Invalid prop `' + propName + '` supplied to' +
                        ' `' + componentName + '`. Validation failed.'
                    );
                }
        },
        defaultValue: PropTypes.string,
        inputId: PropTypes.string,
        inputType: PropTypes.string,
        disabled: PropTypes.bool
    },

    getDefaultProps: function () {
        return {
            name: 'FilterSearch'
        }
    },

    getInitialState: function () {
        return {
            isOpenFilter: false,
            arrow: '',
            value: ''
        }
    },
    componentDidMount: function () {
        this.setState({ value: this.props.defaultValue })
    },
    handleOpenFilter: function (propsFunc) {
        this.setState({
            isOpenFilter: true,
            arrow: 'filter-arrow-up'
        })
        propsFunc();
    },

    handleCloseFilter: function () {
        this.setState({
            isOpenFilter: false,
            arrow: ''
        })
    },
    onClearValue: function () {
        this.setState({ value: '' })
        this.props.handleSearchChange && this.props.handleSearchChange(null);
    },
    onChangeInput: function (e) {
        let value = e.target.value.trim();
        this.props.handleSearchChange && this.props.handleSearchChange(value);
        this.setState({ value: e.target.value });
    },
    render: function () {
        let element = this.props.children ? React.cloneElement(this.props.children) : null;
        let classContainer = "input-container filter-option " + (this.props.children ? "" : "no-child");
        let styleInput = { paddingRight: '50px' }
        return (
            <div ref={(container) => this.container = findDOMNode(container)} >
                <div className={classContainer}>
                    <label className="search-label">
                        <img src={require("../../../images/search-icon.png")} />
                    </label>
                    <input
                        style={styleInput}
                        ref={(input) => this.input = input}
                        type={this.props.inputType ? this.props.inputType : ''}
                        className="form-control search-input"
                        id={this.props.inputId ? this.props.inputId : 'exampleInputEmail1'}
                        placeholder={this.props.placeholder ? this.props.placeholder : 'Search Employee'}
                        onChange={this.onChangeInput}
                        value={this.state.value || ''}
                        disabled={this.props.disabled || false}
                    />
                    {
                        this.props.children ?
                            [<label key="img" className="filter-input"><img
                                onClick={this.handleOpenFilter.bind(this, element ? element.props.handleOpenFilter : null)}
                                src={require("../../../images/filter.png")} /></label>,
                            <div key="div" className={this.state.arrow} />] : null
                    }
                    {this.state.value &&
                        <i className="clear icon-close" onClick={this.onClearValue}></i>
                    }
                </div>
                {element}
            </div>
        )
    }
})