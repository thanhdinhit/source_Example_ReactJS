import React, { PropTypes } from 'react';
import MathHelper from '../../../utils/mathHelper';
import { AVAILABILITY } from '../../../core/common/constants';
import RS from '../../../resources/resourceManager';
import PopoverIcon from '../PopoverIcon/PopoverIcon';

export default React.createClass({
    getInitialState: function () {
        return {
            relX: 0,
        };
    },
    PropTypes: {
        dragableColorClass: PropTypes.string,
        totalWidth: PropTypes.number.isRequired,
        id: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        onMove: PropTypes.func.isRequired,
        onChangeX: PropTypes.func.isRequired,
        onChangeWidth: PropTypes.func.isRequired,
        onMouseUp: PropTypes.func.isRequired,
        remove: PropTypes.func.isRequired,
        isValid: PropTypes.bool
    },
    onMouseDown: function (e) {
        if (e.button !== 0) return;

        const body = document.body;
        this.setState({
            relX: e.pageX - (this.props.x + body.scrollLeft - body.clientLeft),
        });
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        e.stopPropagation();
        e.preventDefault();
    },
    onMouseUp: function (e) {
        this.props.onMouseUp && this.props.onMouseUp()
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        e.preventDefault();
    },
    onMouseMove: function (e) {
        this.props.onMove(e.pageX - this.state.relX);
        e.preventDefault();
    },
    onMouseDownResizeX: function (e) {
        if (e.button !== 0) return;

        const body = document.body;
        this.setState({
            relX: e.pageX - (this.props.x + body.scrollLeft - body.clientLeft),
        });
        document.addEventListener('mousemove', this.onMouseMoveResizeX);
        document.addEventListener('mouseup', this.onMouseUpResizeX);
        e.stopPropagation();
    },
    onMouseUpResizeX: function (e) {
        this.props.onMouseUp && this.props.onMouseUp();
        document.removeEventListener('mousemove', this.onMouseMoveResizeX);
        document.removeEventListener('mouseup', this.onMouseUpResizeX);
        e.preventDefault();
    },
    onMouseMoveResizeX: function (e) {
        this.props.onChangeX(e.pageX - this.state.relX);
        e.preventDefault();
    },
    onMouseDownResizeWidth: function (e) {
        if (e.button !== 0) return;

        const body = document.body;
        this.setState({
            relX: e.pageX - (this.props.width + body.scrollLeft - body.clientLeft),
        });
        document.addEventListener('mousemove', this.onMouseMoveResizeWidth);
        document.addEventListener('mouseup', this.onMouseUpResizeWidth);
        e.stopPropagation();
    },
    onMouseUpResizeWidth: function (e) {
        this.props.onMouseUp && this.props.onMouseUp();
        document.removeEventListener('mousemove', this.onMouseMoveResizeWidth);
        document.removeEventListener('mouseup', this.onMouseUpResizeWidth);
        e.preventDefault();
    },
    onMouseMoveResizeWidth: function (e) {
        this.props.onChangeWidth && this.props.onChangeWidth(e.pageX - this.state.relX);
        e.preventDefault();
    },
    handleRemove: function () {
        this.props.remove(this.props.id);
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
            <div className={"slider-draggable " + (this.props.dragableColorClass || '')}
                ref="handle"
                style={styleDraggable}
                onMouseDown={this.onMouseDown}
            >
                <div className="resize-left"
                    onMouseDown={this.onMouseDownResizeX}
                />
                {
                    this.props.width > (this.props.isValid ? AVAILABILITY.MIN_WIDTH_SHOW_TIME_DURATION : AVAILABILITY.MIN_WIDTH_SHOW_TIME_DURATION_WITH_ERROR) ?
                    <div className="slider-title">{label} </div> :
                    <div className="slider-title-small">
                        <div>{_.trim(label.split('-')[0])}</div>
                        <div>{_.trim(label.split('-')[1])}</div>
                    </div>
                }
                {
                    !this.props.isValid && this.props.width >= AVAILABILITY.MIN_WIDTH_PIXEL &&
                    <PopoverIcon
                        className="popover-error popover-input"
                        message={this.props.errorText}
                        iconPath='error-icon.png'
                    />
                }
                <i className="fa fa-times slider-remove" aria-hidden="true" onClick={this.handleRemove}></i>
                <div className="resize-right"
                    onMouseDown={this.onMouseDownResizeWidth}
                />
            </div>
        )
    },
})