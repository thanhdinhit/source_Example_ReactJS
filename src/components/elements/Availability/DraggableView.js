import React, { PropTypes } from 'react';
import MathHelper from '../../../utils/mathHelper';
import { AVAILABILITY } from '../../../core/common/constants';
import RS from '../../../resources/resourceManager';
import PopoverIcon from '../PopoverIcon/PopoverIcon';

export default React.createClass({
    PropTypes: {
        dragableColorClass: PropTypes.string,
        totalWidth: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        isValid: PropTypes.bool
    },
    getInitialState: function () {
        return {
            relX: 0,
        };
    },
    render: function () {
        let styleDraggable = {
            left: this.props.x,
            width: this.props.width
        }
        let label = '';
        if (this.props.x === 0 && this.props.width === AVAILABILITY.MAX_WIDTH_PIXEL)
            label = RS.getString('ALL_DAY');
        else
            label = MathHelper.convertAxisToTimeDuration(this.props.x, this.props.width, this.props.totalWidth);
        return (
            <div className={"slider-draggable view " + (this.props.dragableColorClass || '')}
                ref="handle"
                style={styleDraggable}
            >
                {
                    this.props.width > (this.props.isValid ? AVAILABILITY.MIN_WIDTH_SHOW_TIME_DURATION_VIEW : AVAILABILITY.MIN_WIDTH_SHOW_TIME_DURATION_VIEW_WITH_ERROR) ?
                    <div className="slider-title">{label} </div> :
                    <div className="slider-title-small">
                        <div>{_.trim(label.split('-')[0])}</div>
                        <div>{_.trim(label.split('-')[1])}</div>
                    </div>
                }
                {
                    !this.props.isValid &&
                    <PopoverIcon
                     className="popover-error popover-input"
                        message={this.props.errorText}
                        iconPath='error-icon.png'
                    />
                }
            </div>
        )
    },
})