import React, { PropTypes } from 'react';
import _ from 'lodash';

class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { enabled: false };
        this.handleToggle = this.handleToggle.bind(this);
    }

    componentWillMount() {
        if (typeof this.props.enabled !== 'undefined') {
            this.setState({ enabled: this.props.enabled });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.enabled !== 'undefined' && (this.props.enabled != nextProps.enabled)) {
            this.setState({ enabled: nextProps.enabled });
        }
    }

    handleToggle() {
        if (!this.props.disabled) {
            this.setState({ enabled: !this.state.enabled });
            this.props.onChange && this.props.onChange(!this.state.enabled);
        }
    }

    getRender() {
        if (this.state.enabled) {
            return (
                <div className="toggle-base open" onClick={this.handleToggle}>
                    <div className="toggle-font">
                        <i className="fa fa-check" />
                    </div>
                    <div className="toggle-dot">
                        <div />
                    </div>
                </div>
            );
        }
        return (
            <div className="toggle-base" onClick={this.handleToggle}>
                <div className="toggle-dot">
                    <div />
                </div>
                <div className="toggle-font">
                    <i className="fa fa-close" />
                </div>
            </div>
        );
    }

    render() {
        return this.getRender();
    }
}

Toggle.propTypes = {
    disabled: PropTypes.bool,
    enabled: PropTypes.bool,
    onChange: PropTypes.func
};

export default Toggle;