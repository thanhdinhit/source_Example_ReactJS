import React from 'react';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../elements/RaisedButton';
import MyCheckBox from '../../elements/MyCheckBox';
import AvatarEditor from 'react-avatar-editor';
import RS, { Option } from '../../../resources/resourceManager';
export default React.createClass({
    getInitialState: function () {
        return {
            scale: 1
        }
    },
    handleClose: function () {
        this.props.handleClose();
    },

    handleUserInput: function () {
        let canvas = this.refs.avatarCanvas.getImageScaledToCanvas();
        this.props.onChange(canvas.toDataURL())
        this.setState({ scale: 1 })
        this.props.handleClose();
    },
    handleRangeChange: function (e, value) {
        this.setState({ scale: this.refs.myRange.value * 4 / 100 + 1 })
    },
    render: function () {
        const actions = [
            <RaisedButton
                key={0}
                label={RS.getString('YES')}
                onClick={this.handleUserInput}
            />,
            <RaisedButton
                key={1}
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.handleClose}
            />,
        ];
        const footerContent =
            <div className="row footer-avatar">
                <div className="col-xs-6">

                    <div className="slider slider-avatar">
                        <i className="icon-picture"></i>
                        <input type="range" max="100" defaultValue="0" ref="myRange" onChange={this.handleRangeChange} />
                        <i className="icon-picture"></i>
                    </div>
                </div>
                <div className="col-xs-6">
                    <RaisedButton
                        key={1}
                        className="raised-button-fourth"
                        label={RS.getString('CANCEL')}
                        onClick={this.handleClose}
                    />
                    <RaisedButton
                        key={0}
                        label={RS.getString('OK', null, Option.UPPER)}
                        onClick={this.handleUserInput}
                    />
                </div>
            </div>
        return (
            <Dialog
                style={{ widthBody: '778px' }}
                modal={false}
                title={this.props.title}
                footerContent={footerContent}
                isOpen={this.props.isOpen}
                handleClose={this.props.handleClose}
            >
                <div className="avatar-editor-container">
                    <AvatarEditor
                        ref="avatarCanvas"
                        style={{ border: '1px solid #c8c8c8 ', cursor: 'move' }}
                        image={this.props.avatar}
                        width={290}
                        height={290}
                        border={[243, 58]}
                        color={[255, 255, 255, 0.6]} // RGBA
                        borderRadius={145}
                        scale={this.state.scale} />

                </div>
            </Dialog>
        )
    }
})