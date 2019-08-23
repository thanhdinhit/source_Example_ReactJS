import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Draggable from './Draggable';
import MathHelper from '../../../utils/mathHelper';
import { AVAILABILITY } from '../../../core/common/constants';
import update from 'react-addons-update';
import { clone } from '../../../services/common';
import RS from '../../../resources/resourceManager';
import _ from 'lodash'

const SliderDurationTime = React.createClass({
    propTypes: {
        title: PropTypes.string.isRequired,
        validDurationTimes: PropTypes.array,
        durationTimes: PropTypes.array.isRequired,
        onChange: PropTypes.func.isRequired,
        dragableColorClass: PropTypes.string,
        hideAllDay: PropTypes.bool,
        hours: PropTypes.number,
        showRegularHours: PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            max: AVAILABILITY.TIME_PER_DAY,
            backgroundCellNumber: 24,
        }
    },
    getInitialState: function () {
        return {
            x: 0,
            creatingDraggable: {},
            draggables: []
        }
    },
    move: function (index, x) {
        this.validate(index, x);
        this.forceUpdate();
    },
    onChangeX: function (index, x) {
        this.validateOnChangeX(index, x);
        this.forceUpdate();
    },
    onChangeWidth: function (index, width) {
        this.validateOnChangeWith(index, width);
        this.forceUpdate();
    },
    validate: function (index, x) {
        let container = ReactDOM.findDOMNode(this.refs.container);
        let box = container.getBoundingClientRect();

        let draggable = _.assign({}, this.props.durationTimes[index]);
        draggable.x = this.optimizePosition(x);

        if (draggable.x + draggable.width > box.width) {
            draggable.x = box.width - draggable.width;
        }
        if (draggable.x < 0) {
            draggable.x = 0;
        }
        let newDraggables = clone(this.props.durationTimes);
        newDraggables[index] = draggable;
        this.props.onChange(newDraggables);
    },
    validateOnChangeX: function (index, x) {
        let container = ReactDOM.findDOMNode(this.refs.container);
        let box = container.getBoundingClientRect();

        let draggable = _.assign({}, this.props.durationTimes[index]);
        let oldX = draggable.x;
        draggable.x = x;

        if (draggable.x > oldX + draggable.width) {
            draggable.x = oldX + draggable.width - 10;
        }

        if (draggable.x < 0) {
            draggable.x = 0;
        }

        draggable.x = this.optimizePosition(draggable.x);
        draggable.width = draggable.width + oldX - draggable.x;

        if (draggable.width < AVAILABILITY.MIN_WIDTH_PIXEL) {
            return;
        }

        let newDraggables = clone(this.props.durationTimes);
        newDraggables[index] = draggable;
        this.props.onChange(newDraggables);

    },
    validateOnChangeWith: function (index, width) {
        let container = ReactDOM.findDOMNode(this.refs.container);
        let box = container.getBoundingClientRect();

        let draggable = _.assign({}, this.props.durationTimes[index]);
        if (width < 0) {
            width = 0;
        }
        if (draggable.x + width > box.width) {
            width = box.width - draggable.x;
        }
        width = width > AVAILABILITY.MIN_WIDTH_PIXEL ? width : AVAILABILITY.MIN_WIDTH_PIXEL;
        draggable.width = this.optimizePosition(width);

        let newDraggables = clone(this.props.durationTimes)
        newDraggables[index] = draggable;
        this.props.onChange(newDraggables);
    },
    mergeDarggable: function (draggables) {
        draggables.sort(function (a, b) {
            return a.x - b.x;
        });

        let newDraggables = [];

        while (draggables.length > 0) {
            let firstDraggable = draggables[0];

            for (let i = 1; i < draggables.length;) {
                if (draggables[i].x >= firstDraggable.x && draggables[i].x <= firstDraggable.width + firstDraggable.x) {
                    if (draggables[i].x + draggables[i].width > firstDraggable.x + firstDraggable.width) {
                        firstDraggable.width = draggables[i].x + draggables[i].width - firstDraggable.x;
                    }
                    draggables.splice(i, 1);
                }
                else
                    i++;
            }
            newDraggables.push(firstDraggable);
            draggables.splice(0, 1);
        }
        return newDraggables;
    },
    optimizePosition: function (pos) {
        let container = ReactDOM.findDOMNode(this.refs.container);
        let box = container.getBoundingClientRect();

        let minDistance = Math.floor(box.width / this.props.max);
        let num = Math.floor(pos / minDistance);
        let mod = pos % minDistance;
        if (mod > 0) {
            pos = (num + 1) * minDistance;
        }
        return pos;
    },
    onMouseDown: function (e) {
        if (e.button !== 0) return;
        const body = document.body;
        let container = ReactDOM.findDOMNode(this.refs.container);
        let box = container.getBoundingClientRect();

        this.state.creatingDraggable.x = this.optimizePosition(e.pageX - box.left);
        this.state.creatingDraggable.width = 0;
        this.forceUpdate();

        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        e.stopPropagation();
    },
    onMouseUp: function (e) {
        let newDraggables = clone(this.props.durationTimes);
        if (this.state.creatingDraggable.width > 0) {
            let width = this.state.creatingDraggable.width > AVAILABILITY.MIN_WIDTH_PIXEL ? this.state.creatingDraggable.width : AVAILABILITY.MIN_WIDTH_PIXEL;
            let x = this.state.creatingDraggable.x + width > AVAILABILITY.MAX_WIDTH_PIXEL ? AVAILABILITY.MAX_WIDTH_PIXEL - width : this.state.creatingDraggable.x;
            newDraggables.push({ x, width });
            newDraggables = this.mergeDarggable(newDraggables);
        }
        this.state.creatingDraggable = {};
        this.forceUpdate();
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        e.preventDefault();
        this.props.onChange(newDraggables);
    },
    onMouseUpOnChild: function (index) {
        let newDraggables = clone(this.props.durationTimes);
        if (this.props.durationTimes[index].width <= 0) {
            newDraggables.splice(index, 1);
        }
        newDraggables = this.mergeDarggable(newDraggables);
        this.props.onChange(newDraggables);
        this.forceUpdate();
    },
    onMouseMove: function (e) {
        let container = ReactDOM.findDOMNode(this.refs.container);
        let box = container.getBoundingClientRect();

        if (e.pageX > box.width + box.left) {
            this.state.creatingDraggable.width = this.optimizePosition(box.width - this.state.creatingDraggable.x);
        }
        else
            this.state.creatingDraggable.width = this.optimizePosition(e.pageX - box.left - this.state.creatingDraggable.x);

        this.forceUpdate();
        e.preventDefault();
    },
    handleRemove: function (index) {
        let newDraggables = clone(this.props.durationTimes);
        newDraggables.splice(index, 1);
        this.props.onChange(newDraggables);
        this.forceUpdate();
    },
    componentDidMount: function () {
        let container = ReactDOM.findDOMNode(this.refs.container);
        let box = container.getBoundingClientRect();
        let minDistance = Math.floor(box.width / this.props.max);
    },
    handleAllDay: function () {
        let newDraggables = [];
        newDraggables.push({ x: 0, width: AVAILABILITY.MAX_WIDTH_PIXEL });
        this.props.onChange(newDraggables);
    },
    isValidDragable: function (dragable) {
        if (!this.props.validDurationTimes) {
            return true;
        }
        let inRangeItem = _.find(this.props.validDurationTimes, (item) => {
            return (item.x <= dragable.x) && (dragable.x - item.x + dragable.width <= item.width);
        });
        return !!inRangeItem;
    },
    isValid: function () {
        if (!this.props.validDurationTimes) {
            return true;
        }
        if (this.state.creatingDraggable.x && !this.isValidDragable(this.state.creatingDraggable)) {
            return false
        }
        let isValid = true;
        this.props.durationTimes.forEach((dragable) => {
            if (!this.isValidDragable(dragable)) {
                isValid = false;
                return false;
            }
        });
        return isValid;
    },
    renderBackground: function () {
        let rs = [];
        for (let i = 0; i < this.props.backgroundCellNumber; i++) {
            rs.push(<span key={i} className="slider-cell" onMouseDown={(e) => e.preventDefault()}></span>);
        }
        return rs;
    },
    render: function () {
        let isValid = this.state.creatingDraggable.x ? this.isValidDragable(this.state.creatingDraggable) : null;
        return (
            <div className="slider-duration-time">
                <label className="slider-label" > {this.props.title} </label>
                <div className="slider-container" ref="container" style={this.props.style}
                    onMouseDown={this.onMouseDown}
                >
                    <div className="slider-background">
                        {
                            this.renderBackground()
                        }
                    </div>
                    {
                        this.state.creatingDraggable.x ?
                            <Draggable
                                dragableColorClass={isValid ? this.props.dragableColorClass : this.props.dragableErrorColorClass}
                                totalWidth={AVAILABILITY.MAX_WIDTH_PIXEL}
                                x={this.state.creatingDraggable.x}
                                onMove={this.move}
                                isValid={isValid}
                                errorText={this.props.errorText}
                                width={this.state.creatingDraggable.width} /> : null
                    }
                    {
                        this.props.durationTimes.length ?
                            this.props.durationTimes.map(function (element, index) {
                                let isValid = this.isValidDragable(element);
                                return (
                                    <Draggable
                                        dragableColorClass={isValid ? this.props.dragableColorClass : this.props.dragableErrorColorClass}
                                        totalWidth={AVAILABILITY.MAX_WIDTH_PIXEL}
                                        key={index}
                                        id={index}
                                        x={element.x}
                                        onMove={this.move.bind(this, index)}
                                        onChangeX={this.onChangeX.bind(this, index)}
                                        onChangeWidth={this.onChangeWidth.bind(this, index)}
                                        onMouseUp={this.onMouseUpOnChild.bind(this, index)}
                                        width={element.width}
                                        isValid={isValid}
                                        errorText={this.props.errorText}
                                        remove={this.handleRemove} />
                                )
                            }, this) : null
                    }

                </div>
                {
                    this.props.hideAllDay ? null : <div className="slider-btn-all-day">
                        <i className="fa fa-eye" aria-hidden="true" onClick={this.handleAllDay}></i>
                        <label onClick={this.handleAllDay}> {RS.getString("ALL_DAY")} </label>
                    </div>
                }
                {
                    this.props.showRegularHours &&
                    <div className="slider-regular-hours">
                        <span>{this.props.hours.toFixed(2)}</span>
                    </div>
                }
            </div>
        )
    },
});

export default SliderDurationTime;