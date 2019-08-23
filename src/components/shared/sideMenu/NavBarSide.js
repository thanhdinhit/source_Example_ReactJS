import React, { PropTypes } from 'react';

class NavbarSide extends React.Component {
    render() {
        let childs = React.Children.map(this.props.children, (child, index) =>
            child != undefined && (child.props.name === 'MenuEdge' || child.props.name === 'MenuLeaf') ?
                React.cloneElement(child, {
                    employeeRights: this.props.employeeRights
                }) : React.cloneElement(child)
        )
        return (
            <nav className="navbar-default navbar-static-side">
                <ul className="nav navbar-custom" id="side-menu">
                    {childs}
                </ul>
            </nav>
        )

    }
}
NavbarSide.propTypes = {
    employeeRights: PropTypes.array,
}
export default NavbarSide;