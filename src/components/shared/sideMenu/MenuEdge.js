import React, { PropTypes } from 'react';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import RS from '../../../resources/resourceManager';

class MenuEdge extends React.Component {
    constructor(props, context, value) {
        super(props, context);
        this.state = { isRender: true }
        this.checkRender = this.checkRender.bind(this)
    }
    componentDidMount() {
        this.checkRender();
    }
    checkRender() {
        if (this.props.isNonChildMenu) {
            return;
        }
        if (!$("#" + this.props.id).children()[0] && this.state.isRender) {
            this.setState({ isRender: false }, () => this.props.checkRender && this.props.checkRender())
        }
        else if (!this.state.isRender) {
            this.setState({ isRender: true })
        }

    }
    render() {
        let childs = React.Children.map(this.props.children, (child, index) =>
            child != undefined ?
                React.cloneElement(child, {
                    employeeRights: this.props.employeeRights,
                    checkRender: this.checkRender
                }) : null
        )
        if (this.state.isRender)
            return (
                <li className={this.props.liClassName}>
                    <a
                        data-toggle="collapse"
                        data-target={"#" + this.props.id}
                        onClick={() => { this.props.onClick && this.props.onClick(); }}
                    >
                        {
                            this.props.srcImg ? <img src={this.props.srcImg} /> : null
                        }
                        <span> {this.props.label} {!this.props.isNonChildMenu && <span className="fa arrow nav-arrow-icon"></span>}</span>
                    </a>
                    {
                        !this.props.isNonChildMenu &&
                        <ul id={this.props.id} className={this.props.ulClassName}>
                            {childs}
                        </ul>
                    }
                </li>
            )
        return null;
    }
}

MenuEdge.defaultProps ={
    name: 'MenuEdge'
};

MenuEdge.propTypes = {
    id: PropTypes.string.isRequired,
    srcImg: PropTypes.string,
    label: PropTypes.string.isRequired,
    ulClassName: PropTypes.string.isRequired,
    right: PropTypes.string,
    employeeRights: PropTypes.array
}

export default MenuEdge;