import React, { PropTypes } from 'react';
import Overlay from 'react-bootstrap/lib/Overlay';
import Popover from 'react-bootstrap/lib/Popover';
import { findDOMNode } from 'react-dom';
import CustomPopover from './CustomPopover'

const PopoverIcon = React.createClass({
    getInitialState: function () {
        return {
            show: false,
        }
    },
    postion: "top",
    calcPosition: function (customPopover) {
        customPopover.calcPosition(this.position);
    },
    show: function (position) { //position return "top" or "bottom"
        this.position = position;
        this.setState({ show: true })
    },
    hide: function () {
        this.setState({ show: false })
    },
    onMouseLeave: function () {
        if (!this.props.showOnHover) return;
        if (this.props.onHide) {
            this.props.onHide()
        }
        else {
            this.hide()
        }
    },
    onMouseOver: function () {
        this.props.showOnHover && this.show();
    },
    onClickImg: function (e) {
        if (this.props.showOnHover) return;
        this.show();
        this.props.onClick && this.props.onClick(e)
    },
    render: function () {
        return (
            <span className={"icon-input " + (this.props.className || '')} >
                <Overlay
                    rootClose={!this.props.showOnHover}
                    onHide={() => this.setState({ show: false })}
                    show={this.state.show}
                    target={this.errorIcon}
                    container={this}
                    containerPadding={0}
                    animation={false}
                >
                    <CustomPopover
                        ref={(customPopover) => {customPopover && this.calcPosition(customPopover); this.customPopover = customPopover}}
                        message={this.props.message}
                    />
                </Overlay>
                {
                    this.props.iconFont ?
                        <i
                            className={(this.props.iconFont) + " img-popover-icon " + (this.props.iconClassName || '')}
                            aria-hidden="true"
                            onClick={this.onClickImg}
                            onMouseOver={this.onMouseOver}
                            onMouseLeave={this.onMouseLeave}
                            ref={(img) => this.errorIcon = findDOMNode(img)}
                        /> :
                        <img
                            onMouseOver={this.onMouseOver}
                            onMouseLeave={this.onMouseLeave}
                            onClick={this.onClickImg}
                            ref={(img) => this.errorIcon = findDOMNode(img)}
                            className={"img-popover-icon " + (this.props.iconClassName || '')}
                            src={require("../../../images/" + this.props.iconPath)}
                        />
                }
            </span>
        )
    }
})

PopoverIcon.propTypes = {
    message: PropTypes.string,
    onHide: PropTypes.func,
    showOnHover: PropTypes.bool,
    className: PropTypes.string,
    iconPath: PropTypes.string,
    iconClassName: PropTypes.string
}

export default PopoverIcon;