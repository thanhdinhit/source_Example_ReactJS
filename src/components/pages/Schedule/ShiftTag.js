import React from 'react';
import * as itemTypes from '../../../constants/itemTypes'
import { DragSource } from 'react-dnd';
import RIGHTS from '../../../constants/rights';
import _ from 'lodash';
const style1 = {
    position: "relative",
    lineHeight: "1em !important",
    zIndex: "9 !important",
    color: "#3d454d",
    backgroundColor: "white",
    margin: "4px 4px 0",
    fontSize: "0.75em"
}
const style2 = {
    position: "absolute",
    top: "6px",
    left: "6px",
    bottom: "6px",
    width: "5px",
    background: "#c2c7cc",
    zIndex: "9",
    borderRadius: "3px"
}
const style3 = {
    position: "relative",
    display: "block",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    padding: "6px",
    margin: "0",
    backgroundColor: "#dfeff7",
    paddingLeft: "18px"
}


const shiftSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
            from: {
                x: props.parentInfo.x,
                y: props.parentInfo.y
            }

        };
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

let ShiftTag = React.createClass({

    render: function () {
        let connectDragSource = this.props.connectDragSource;
        let isDragging = this.props.isDragging;
        let opacity = isDragging?  0: 1;
        let newStyle =_.assign({},style1);
        newStyle.opacity = opacity;
        return connectDragSource(
            <div style={newStyle}>

                <div style={style3}>
                    <div>Shift Name (6:30 - 12:00)</div>
                    <div>Position at Location</div>
                </div>
            </div>
        )
    }
})

export default DragSource(itemTypes.SHIFT, shiftSource, collect)(ShiftTag);