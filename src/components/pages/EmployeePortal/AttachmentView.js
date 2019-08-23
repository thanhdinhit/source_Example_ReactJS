import React, { PropTypes } from 'react';
import { getExtension, getName } from '../../../utils/iconUtils';

var AttachmentView = React.createClass({
    propTypes: {
        attachment: PropTypes.object,
    },

    render: function () {
        return (
            <div className="row attachment-position">
                {this.props.attachment && this.props.attachment.files ?
                    this.props.attachment.files.map(function (element, index) {
                        return (
                            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 document-view" key={index} >
                                <img className="icon-type-file"
                                    src={require('../../../images/svg/' + getExtension(element.docUrl))} />
                                <a className="document-name"
                                    href={API_FILE + element.docUrl }>
                                    <div>{getName(element.docUrl)}</div>
                                </a>
                            </div>
                        )
                    }) : ''
                }
            </div>
        );
    },

});

export default AttachmentView;