import React, { PropTypes } from 'react';
import { getExtension, getName } from '../../../../utils/iconUtils';

function FileAttachment(props) {
    return (
        <div className={props.className}>
            <div className="document-view">
                <img className="icon-type-file"
                    src={require('../../../../images/svg/' + getExtension(props.file.fileUrl))} />
                <a className={props.canDelete ? 'document-name can-delete' : 'document-name'}
                    href={API_FILE + props.file.fileUrl }>
                    {getName(props.file.fileUrl)}
                </a>
                {
                    props.canDelete &&
                    <i className="attach-remove fa fa-trash-o trash-icon"
                        onClick={props.deleteDocument.bind(this, props.file)}
                    />
                }
            </div>
        </div>
    );
}

FileAttachment.propTypes = {
    className: PropTypes.string,
    file: PropTypes.object,
    canDelete: PropTypes.bool,
    deleteDocument: PropTypes.func
};
export default FileAttachment;



