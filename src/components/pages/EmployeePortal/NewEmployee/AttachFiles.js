import React, { PropTypes } from 'react';
import RS, { Option } from '../../../../resources/resourceManager';
import AreaAttachFileContainer from '../../../../containers/Upload/AreaAttachFileContainer';
import { EMPLOYEE_ATTACHFILE } from '../../../../core/common/config';

class AttachFiles extends React.Component {
    constructor(props, context, value) {
        super(props, context);
        this.getValue = this.getValue.bind(this);
    }
    getValue() {
        let documents = this.areaAttachFileContainer.getWrappedInstance().areaAttachFile.getFiles();
        documents = documents.map(x => { return { docUrl: x.url } })
        return documents;
    }
    render() {
        return (
            <div className="new-employee-attach-files">
                <AreaAttachFileContainer
                    filePreviewClassName="col-sm-12 col-md-6 col-lg-4"
                    ref={(input) => input &&  (this.areaAttachFileContainer = input)}
                    enable={true}
                    allowTypes={EMPLOYEE_ATTACHFILE.allowTypes}
                    maxSize={EMPLOYEE_ATTACHFILE.maxSize}
                />
            </div>
        )
    }
}

AttachFiles.propTypes = {

}

export default AttachFiles;