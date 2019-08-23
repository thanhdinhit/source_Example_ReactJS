import React, { PropTypes } from 'react';
import Popover from 'react-bootstrap/lib/Popover';
import { findDOMNode } from 'react-dom';


const CustomPopover = React.createClass({
    calcPosition: function (position = "top") {
        $('.custom-popover').addClass(position)
        let box = this.container.getBoundingClientRect();
        if (box.left < 0) {
            $(this.container).children('.arrow').animate({ right: '-=' + (box.left - 53) })
            $(this.container).animate({ right: '+=' + (box.left - 53) })
        }
    },
    getOffset: function () {
        let bound = this.container.getBoundingClientRect();
        let position = $(this.container).position();
        let rs = []
        $(this.container).parents().each(element => {
            if (element.heigth() < element.innerHeight()) {
                rs.push(element)
            }
        })

        return { bound, position, rs };
    },
    render: function () {
        return (
            <div ref={(container) => this.container = findDOMNode(container)} role="tooltip" className="fade in popover custom-popover" >
                <div className="arrow"></div>
                <div dangerouslySetInnerHTML={{ __html: this.props.message }} className="popover-content"></div>
            </div>
        )
    }
})

CustomPopover.propTypes = {
    message: PropTypes.string
}
export default CustomPopover;