import React from 'react';
import ReactSpinner from 'react-spinjs';

var LoadingIndicator = React.createClass({
    render: function () {
        let config = this.props.config;
        config.position = 'absolute';
        return (
            <div id={this.props.containerId} className="container-loading-indicator">
                {/* <ReactSpinner config={config} /> */}
                <img className = "loading-indicator" src = {require("../../../images/svg/indicator.svg")} />
            </div>
        )
    }
});

export default LoadingIndicator;