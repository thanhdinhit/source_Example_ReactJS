import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DraggableView from './DraggableView';
import MathHelper from '../../../utils/mathHelper';
import { AVAILABILITY } from '../../../core/common/constants';
import update from 'react-addons-update';
import { clone } from '../../../services/common';
import RS from '../../../resources/resourceManager';

const SliderDurationTimeView = React.createClass({
    propTypes: {
        title: PropTypes.string.isRequired,
        validDurationTimes: PropTypes.array,
        durationTimes: PropTypes.array.isRequired,
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
            draggables: []
        }
    },
    componentDidMount: function () {
        let container = ReactDOM.findDOMNode(this.refs.container);
        let box = container.getBoundingClientRect();
        let minDistance = Math.floor(box.width / this.props.max);
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
            rs.push(<span key={i} className="slider-cell" ></span>);
        }
        return rs;
    },
    render: function () {
        return (
            <div className="slider-duration-time">
                <label className="slider-label" > {this.props.title} </label>
                <div className="slider-container" ref="container" style={this.props.style}
                >
                    <div className="slider-background">
                        {
                            this.renderBackground()
                        }
                    </div>

                    {
                        this.props.durationTimes && this.props.durationTimes.length ?
                            this.props.durationTimes.map(function (element, index) {
                                let isValid = this.isValidDragable(element);
                                return (
                                    <DraggableView
                                        dragableColorClass={isValid ? this.props.dragableColorClass : this.props.dragableErrorColorClass}
                                        totalWidth={AVAILABILITY.MAX_WIDTH_PIXEL}
                                        key={index}
                                        id={index}
                                        x={element.x}
                                        width={element.width}
                                        isValid={isValid}
                                        errorText={this.props.errorText}
                                    />
                                )
                            }, this) : null
                    }
                </div>
                {
                    this.props.showRegularHours &&
                    <div className="slider-regular-hours">
                        <span>{(this.props.hours || 0).toFixed(2)}</span>
                    </div>
                }
            </div>
        )
    },
});

export default SliderDurationTimeView;