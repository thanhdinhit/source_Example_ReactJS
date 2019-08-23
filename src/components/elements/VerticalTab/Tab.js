import React, { PropTypes } from 'react';

class Tab extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.handleClick(this.props.value);
    }

    render() {
        let className = this.props.value === this.props.valueSelected ? 'active ' : '';
        className += this.props.toggle ? 'toggle' : '';

        return (
            <li onClick={this.handleClick} >
                <div
                    className={className}
                >
                    <div className="layer" />
                    <div className="icon">
                        <img src={require("../../../images/" + this.props.img)} className={this.props.class} />
                    </div>
                    <div className={this.props.isOpenMenu ? 'title open' : 'title'}>
                        <span>{this.props.title}</span>
                    </div>
                </div>
            </li >
        );
    }
}

Tab.propTypes = {
    icon: PropTypes.string,
    value: PropTypes.string,
    valueSelected: PropTypes.string,
    title: PropTypes.string,
    handleClick: PropTypes.func,
    img: PropTypes.string,
    class: PropTypes.string,
    isOpenMenu: PropTypes.bool,
    toggle: PropTypes.bool
};

export default Tab;