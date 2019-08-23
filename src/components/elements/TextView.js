import React, { PropTypes } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';

class TextView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let className = 'text-view ' + (this.props.className || '');
        let image = this.props.image ? <img className="image" src={this.props.image} /> : null;
        let contentClassName = 'content ' + (this.props.image ? 'with-image ' : '');
        return (
            <div className={className} >
                {
                    this.props.title ? <div className={(this.props.title ? 'title ' : '') + (this.props.required ? 'required ' : '') + this.props.className}>{this.props.title}</div> : ''
                }
                {
                    this.props.value ?
                        <div className={this.props.addon ? 'input-group' : ''}>
                            <div className={contentClassName + (this.props.disabled ? 'text-view-disabled ' : '')} >
                                {image}
                                {this.props.href ?
                                    < a onClick = {()=> browserHistory.push(this.props.href)}> {this.props.value.toString() || ''}</a>
                                    : < span > {this.props.value.toString() || ''}</span>
                                }

                            </div>
                            {this.props.addon && this.props.addon}
                        </div>
                        :
                        <div className={contentClassName + (this.props.disabled ? 'text-view-disabled ' : '')} > {image} &nbsp;</div>
                }
            </div>
        );
    }
}

TextView.propTypes = {
    labelcolor: PropTypes.string,
    className: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    addon: PropTypes.object,
    href: PropTypes.string
};

export default TextView;