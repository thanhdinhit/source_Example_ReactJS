import React from 'react';
import { DropTarget } from 'react-dnd';
import * as itemTypes from '../../../constants/itemTypes'

const squareTarget = {
    drop(props, monitor) {
        let item = monitor.getItem();
        props.drop(item.id, item.index, item.from, props.info)
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

let Square = React.createClass({
  
    render: function () {
        let connectDropTarget = this.props.connectDropTarget;
        return connectDropTarget(
            <div style={{ display: 'inline-table', minHeight: '80px', width: '100%', height:'100%' }}>
                {this.props.children}
            </div>
        )
    }
})

export default DropTarget(itemTypes.SHIFT, squareTarget, collect)(Square);