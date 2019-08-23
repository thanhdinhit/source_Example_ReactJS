import React, { PropTypes } from 'react';
import { getUrlPath } from '../../../core/utils/RoutesUtils';
import RS from '../../../resources/resourceManager';

class MenuLeaf extends React.Component {
    isRender = true;
    name = "MenuLeaf";
    isNull() {
        return this.isRender;
    }
    render() {
        if (this.props.employeeRights && this.props.employeeRights.find(x => !this.props.right || x === this.props.right))
            return (
                <li id={this.props.id || ''} className={this.props.liClassName ? this.props.liClassName : ''}>
                    <a
                        className={this.props.aClassName}
                        onClick={this.props.onClick}
                        href={getUrlPath(this.props.url)}
                    >
                        {
                            this.props.srcImg ?
                                [<img src={this.props.srcImg} />,
                                <span>Location Service </span>]
                                : this.props.label
                        }
                    </a>
                </li>
            )
        else {
            this.isRender = false;
            return null
        };

    }
}

MenuLeaf.defaultProps = {
    name: "MenuLeaf"
};

MenuLeaf.propTypes = {
    url: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    srcImg: PropTypes.string,
    right: PropTypes.string,
    employeeRights: PropTypes.array,
    aClassName: PropTypes.string,
    id: PropTypes.string
}
export default MenuLeaf;