import React, { PropTypes } from 'react';
import CustomPicker from 'react-color/lib/components/common/ColorWrap';
import { colorDefaultColorPicker } from '../../core/common/constants';

const MyColorPicker = React.createClass({
    propTypes: {
        onChange: PropTypes.func,
        constraints: PropTypes.object,
        myColor: PropTypes.string
    },

    getInitialState: function () {
        return {
            colorDefault: colorDefaultColorPicker,
            isOpenPicker: false,
            myColor: null
        };
    },
    componentDidMount: function () {
        this.setState({ myColor: this.props.myColor });
        document.addEventListener('click', this.documentClickHandler);
    },

    componentWillReceiveProps: function (nextProps) {
        if (this.props.myColor != nextProps.myColor) {
            this.setState({ myColor: nextProps.myColor });
        }
    },

    componentWillUnmount: function () {
        document.removeEventListener('click', this.documentClickHandler);
    },

    documentClickHandler: function () {
        if (this.state.isOpenPicker)
            this.setState({
                isOpenPicker: false,
            });
    },

    getValue: function () {
        return this.state.myColor.color;
    },

    validate: function () {
        return !!this.state.myColor;
    },

    handlePickColor: function (hex, e) {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ isOpenPicker: false, myColor: hex.color }, () => {
            this.props.onChange(hex);
        });
    },

    render: function () {
        let visibility = this.state.isOpenPicker ? '' : 'hidden';

        return (
            <div className="my-color-picker">
                <div className="color-picker">
                    {
                        this.state.myColor ?
                            <div
                                className="my-color-selected"
                                style={{ backgroundColor: this.state.myColor }}
                            /> : <img
                                width="100%"
                                height="100%"
                                src={require("../../images/circleColor.png")}
                            />
                    }
                </div>
                <span
                    className="Select-arrow-zone"
                    onClick={(e) => {
                        e.nativeEvent.stopImmediatePropagation();
                        this.setState({ isOpenPicker: !this.state.isOpenPicker });
                    }}
                >
                    <span className="Select-arrow" />
                </span>
                <div
                    className="color-group"
                    onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); }}
                    style={{
                        visibility: visibility,
                        top: this.props.top,
                        left: this.props.left || 0,
                        right: this.props.right,
                    }}
                >
                    {
                        this.state.colorDefault.map(function (hex, index) {
                            return (
                                <div
                                    className="color-option"
                                    onClick={this.handlePickColor.bind(this, hex)}
                                    key={index}
                                    style={{ backgroundColor: hex }}
                                />
                            );
                        }.bind(this))
                    }
                </div>
            </div>
        );
    }
});

export default CustomPicker(MyColorPicker);