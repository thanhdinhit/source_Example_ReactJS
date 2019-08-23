import React from 'react'
import ReactDOM from 'react-dom'
import Overlay from 'react-bootstrap/lib/Overlay';

var CustomPopover = React.createClass({
    getInitialState: function () {
        return {
        }
    },
    handleOptionClick: function (option) {
        this.props.handleOptionClick(option)
    },
    render: function () {

        return (
            <div className="popover-container ">
                <div className="filter-content">
                    <ul>
                        {
                            this.props.options.map(option =>
                                <li key={option.value} onClick={this.handleOptionClick.bind(this, option)} > {option.label} </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        )
    }
})

export default React.createClass({
    getInitialState: function () {
        return {
            isOpen: false
        }
    },
    selectClick: function () {
        this.setState({ isOpen: !this.state.isOpen })
    },
    getValueText: function () {
        if (this.props.value) {
            return this.props.value.label;
        }
        else
            return ''
    },
    handleOptionClick: function (option) {
        this.props.onChange(option)
        this.setState({ isOpen: false })
    },
    render: function () {
        return (
            <div className="select-component" ref="target">
                <div className="value-select" onClick={this.selectClick}>
                    <span className="text-value"> {this.getValueText()} </span>
                    <span className="arrow-down"> <i className="fa fa-angle-down" aria-hidden="true"></i></span>
                </div>
                <div className="select-line"> </div>
                <Overlay
                    animation={false}
                    rootClose
                    show={this.state.isOpen}
                    onHide={() => this.setState({ isOpen: false })}
                    placement="bottom"
                    container={this}
                    target={() => ReactDOM.findDOMNode(this.refs.target)}
                >
                    <CustomPopover
                        options={this.props.options}
                        handleOptionClick={this.handleOptionClick}
                    />
                </Overlay>
            </div>
        )
    }
})