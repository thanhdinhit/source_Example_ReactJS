import React from 'react';
import RS from '../../../resources/resourceManager';
import RaisedButton from '../../../components/elements/RaisedButton';
import Overlay from 'react-bootstrap/lib/Overlay';
import ReactDOM from 'react-dom';
import { MY_SCHEDULE_STATUS } from '../../../core/common/constants';

const SIZE_ARROW = MY_SCHEDULE_STATUS.SIZE_ARROW;

let OverlayOverTimeRequestMySchedulePopover = React.createClass({
    getInitialState: function () {
        return {
            update: false
        };
    },

    requester: '',
    shift: '',
    duration: '',
    comment: '',


    setData: function (data, target, move) {
        this.requester = data.requester;
        this.shift = data.shift;
        this.duration = data.duration;
        this.comment = data.comment;
        this.setState({ update: true }, function () {
            this.setPostionOverlay(target, move)
        });
    },

    calcPosition: function (container, targetId, move) {
        let box = container.getBoundingClientRect();
        let widthTarget = $("#" + targetId).outerWidth();
        let heightTarget = $("#" + targetId).outerHeight();
        if (move === MY_SCHEDULE_STATUS.MOVE_BOTTOM) {
            $(container).animate({ marginTop: heightTarget + 2 * SIZE_ARROW }, null, () => {
                $(container).siblings('.arrow-down').removeClass('arrow-down').addClass('arrow-up');
            });
        } else if (move === MY_SCHEDULE_STATUS.MOVE_LEFT) {
            $(container).animate({ marginTop: heightTarget + 2 * SIZE_ARROW, marginLeft: widthTarget + MY_SCHEDULE_STATUS.MORE_LEFT }, null, () => {
                $(container).siblings('.arrow-down').removeClass('arrow-down').addClass('arrow-up');
            });
        }
    },

    handleDecline: function () {
        if (this.props.handleDecline) {
            this.props.handleDecline();
        }
    },

    handleAccept: function () {
        if (this.props.handleAccept) {
            this.props.handleAccept();
        }
    },

    setPostionOverlay: function (targetId, move) {
        //target
        let topTarget = $("#" + targetId).offset().top;
        let leftTarget = $("#" + targetId).offset().left;
        let widthTarget = $("#" + targetId).outerWidth();
        let heightTarget = $("#" + targetId).outerHeight();
        //overlay
        let widthOverlay = $("#myschedule-overtime-request-id").outerWidth();
        let heightOverlay = $("#myschedule-overtime-request-id").outerHeight();

        $("#myschedule-overtime-request-id").css({
            "top": (topTarget - SIZE_ARROW) + "px",
            "left": (leftTarget - (widthOverlay / 2 - widthTarget / 2)) + "px",
            "margin-top": -heightOverlay + "px"
        });

        $("#arrow").css({
            "top": (topTarget - SIZE_ARROW) + "px",
            "left": (leftTarget + widthTarget / 2 - SIZE_ARROW / 2) + "px"
        });

        if (move === MY_SCHEDULE_STATUS.MOVE_LEFT) {
            $("#myschedule-overtime-request-id").css({
                "left": (leftTarget - widthOverlay) + "px",
            });

            $("#arrow").css({
                "top": (topTarget + heightTarget) + "px",
            });
        }

        if (move === MY_SCHEDULE_STATUS.MOVE_BOTTOM) {
            $("#arrow").css({
                "top": (topTarget + heightTarget) + "px",
            });
        }
    },

    render: function () {
        return (
            <div className="myschedule-overtime-request-popover">
                <div>
                    <div id="arrow" className="arrow-down"></div>
                    <div id="myschedule-overtime-request-id" className="myschedule-overtime-request" ref={(overtimeRequest) => this.overtimeRequest = overtimeRequest}>
                        <div id="title" className="title">{RS.getString('OVERTIME_REQUEST')}</div>
                        <div className="over-row">
                            <div className="object">
                                <div>{RS.getString('REQUESTER')}:</div>
                                <div>{RS.getString('SHIFT')}:</div>
                                <div>{RS.getString('DURATION')}:</div>
                                <div>{RS.getString('COMMENT')}:</div>
                            </div>
                            <div className="name">
                                <div>{this.requester}</div>
                                <div>{this.shift}</div>
                                <div>{this.duration}</div>
                                <div className="comment">{this.comment}</div>
                            </div>
                        </div>
                        <div className="actions-group">
                            <div className="actions">
                                <RaisedButton
                                    key={0}
                                    label={RS.getString('DECLINE')}
                                    onClick={this.handleDecline}
                                    className="raised-button-third"
                                />
                            </div>
                            <div className="actions">
                                <RaisedButton
                                    key={1}
                                    label={RS.getString('ACCEPT')}
                                    onClick={this.handleAccept}
                                />
                            </div>
                        </div>
                        <div className="clear" />
                    </div>
                </div>
            </div>
        );
    }
});

let OverlayOverTimeRequestMySchedule = React.createClass({
    getInitialState: function () {
        return {
            open: false
        };
    },

    handleShow: function (data, target, move) {
        this.setState({ open: true }, function () {
            this.OverlayOverTimeRequestMySchedulePopover.calcPosition(this.OverlayOverTimeRequestMySchedulePopover.overtimeRequest, target, move);
            this.OverlayOverTimeRequestMySchedulePopover.setData(data, target, move);
        });
    },

    onHide: function () {
        this.setState({ open: false });
        if (this.props.onHide) {
            this.props.onHide();
        }
    },

    handleDecline: function () {
        this.setState({ open: false });
        if (this.props.handleDecline) {
            this.props.handleDecline();
        }
    },

    handleAccept: function () {
        this.setState({ open: false });
        if (this.props.handleAccept) {
            this.props.handleAccept();
        }
    },

    render: function () {
        return (
            <Overlay
                animation={false}
                rootClose
                show={this.state.open}
                placement="top"
                container={this.props.container}
                onHide={this.onHide}
                target={() => ReactDOM.findDOMNode(this.refs[this.target])}
            >
                <OverlayOverTimeRequestMySchedulePopover
                    ref={(OverlayOverTimeRequestMySchedulePopover) => this.OverlayOverTimeRequestMySchedulePopover = OverlayOverTimeRequestMySchedulePopover}
                    handleDecline={this.handleDecline}
                    handleAccept={this.handleAccept}
                />
            </Overlay>
        );
    }
})

export default OverlayOverTimeRequestMySchedule;