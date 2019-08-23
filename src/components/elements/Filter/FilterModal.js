import React, { PropTypes } from 'react'
import Overlay from 'react-bootstrap/lib/Overlay';
import RS, { Option } from '../../../resources/resourceManager';
import { findDOMNode } from 'react-dom';
import RaisedButton from '../../elements/RaisedButton';
let acceptedTypes = ['CommonSelect', 'CommonDatePicker', 'FilterDateTime', 'CommonTextField', 'FilterMore'];

class FilterModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: {}
        };
    }

    handleClickOutSide() {
        this.props.handleCloseFilter();
    }

    render() {
        let css = "dialog-confirm dialog-filter ";
        css += this.props.className || '';
        let childrens = _.flatten(this.props.children);
        let filters = _.partition(childrens, (children) => children.props.componentName != 'FilterMore');
        let modalSize = this.props.size ? this.props.size : 'md-lg';
        let cssBlockWidth = this.props.blockSize ? this.props.blockSize : 'col-lg-3';
        
        if (this.props.isOpen)
            return (
                <div>
                    <div className={css}>
                        <div className="filter-modal">
                            <div ref={(container) => this.container = findDOMNode(container)}
                                className={'modal-content ' + modalSize}
                                style={{ width: this.props.style ? this.props.style.widthBody : '' }}>
                                <div className='modal-body'>
                                    <div className="row filter-row">
                                        {
                                            _.map(filters[0], (child, index) => (
                                                <div className={'col-xs-12 col-md-6 ' + cssBlockWidth} key={index}>
                                                    {child}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {filters[1]}
                                </div>
                                <div className='modal-footer'>
                                    <div className='button-footer-right row'>
                                        <RaisedButton
                                            className="raised-button-fourth"
                                            label={RS.getString('CANCEL', null, Option.CAPEACHWORD)}
                                            onClick={this.props.handleCloseFilter}
                                        />
                                        <RaisedButton
                                            className="raised-button-fourth"
                                            label={RS.getString('RESET', null, Option.CAPEACHWORD)}
                                            onClick={this.props.handleResetFilter}
                                        />
                                        <RaisedButton
                                            label={RS.getString('APPLY', null, Option.CAPEACHWORD)}
                                            onClick={this.props.handleApplyFilter}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='background-dialog' onClick={this.handleClickOutSide.bind(this)}>
                            <div className="background-dialog-container"></div>
                        </div>
                    </div>
                </div>
            )
        else return (null)
    }
}

FilterModal.defaultProps = {
    componentName: 'FilterModal'
}

FilterModal.propTypes = {
    isOpen: PropTypes.bool,
    handleOpenFilter: PropTypes.func.isRequired,
    handleApplyFilter: PropTypes.func.isRequired,
    handleResetFilter: PropTypes.func.isRequired,
    handleCloseFilter: PropTypes.func.isRequired,
    children: function (props, propName, componentName) {
        let childs = _.isArray(props[propName]) ? props[propName] : [props[propName]];
        childs = _.flatten(childs);
        if (_.find(childs, (child) => acceptedTypes.indexOf(child.props.componentName) == -1)) {
            return new Error(
                'Invalid prop `' + propName + '` supplied to' +
                ' `' + componentName + '`. Validation failed.'
            );
        }
    }
}

export default FilterModal;