import React, { PropTypes } from 'react';
import Dialog from '../../elements/Dialog';
import DialogAlert from '../../elements/DialogAlert';
import RaisedButton from '../../../components/elements/RaisedButton';
import MyCheckBox from '../../elements/MyCheckBox';
import MyCheckBoxSpecial from '../../elements/MyCheckBoxSpecial';
import RS from '../../../resources/resourceManager';
import _ from 'lodash';

const propTypes = {
    items: PropTypes.array,
    isOpen: PropTypes.bool,
    handleExport: PropTypes.func,
    handleClose: PropTypes.func,
    relativeFilePath: PropTypes.string,
    payload: PropTypes.object,
    resetState: PropTypes.func,
    resetError: PropTypes.func,
    resetSuccess: PropTypes.func
};

class ExportDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isOpenExportSuccess: false,
            isOpenExportFail: false
        };
        this.handleCheckAllColumns = this.handleCheckAllColumns.bind(this);
        this.handleColumnCheckAll = this.handleColumnCheckAll.bind(this);
        this.handleItemChecked = this.handleItemChecked.bind(this);
        this.handleExport = this.handleExport.bind(this);
    }

    componentDidMount() {
        this.setState({ items: this.props.items });
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.items, nextProps.items)) {
            this.setState({ items: nextProps.items });
        }
        if (nextProps.payload.success) {
            this.setState({ isOpenExportSuccess: true });
            this.props.handleClose();
            window.open(API_FILE + '/' + nextProps.relativeFilePath, '_blank');
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {
            this.props.handleClose();
            this.setState({ isOpenExportFail: true });
        }
    }

    componentDidUpdate() {
        if (this.props.payload.success) {
            this.props.resetState();
            this.props.resetSuccess();
        }
        if (this.props.payload.error.message != '' || this.props.payload.error.exception) {

            this.props.resetError();
        }
    }

    handleExport() {
        let columns = [];
        _.forEach(this.state.items, function (item) {
            if (item.checked) {
                columns.push(item.value);
            }
        });
        this.props.handleExport({ columns });
    }

    handleItemChecked(index) {
        const items = _.cloneDeep(this.state.items);
        items[index].checked = !items[index].checked;
        this.setState({ items });
    }

    handleColumnCheckAll() {
        const itemChecked = _.find(this.state.items, 'checked');
        if (itemChecked) {
            return this.setState({ items: this.handleCheckAllColumns(false) });
        }
        return this.setState({ items: this.handleCheckAllColumns(true) });
    }

    handleCheckAllColumns(isCheckedAll) {
        return _.map(this.state.items, function (item) {
            return _.assign({}, item, { checked: isCheckedAll });
        });
    }

    render() {
        const items = _.map(this.state.items, function (item) {
            return _.assign({}, item, { label: RS.getString(item.label) });
        });
        const actions = [
            <RaisedButton
                key={0}
                label={RS.getString('EXPORT')}
                onClick={this.handleExport}
            />,
            <RaisedButton
                key={1}
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.props.handleClose}
            />
        ];

        let checkedNumber = 0;
        items.forEach(function (item) {
            if (item.checked) {
                checkedNumber++;
            }
        });
        const cssCheckAll = items.length === checkedNumber ? 'checkbox-special' : 'checkbox-special-type2';

        return (
            <div>
                <Dialog
                    isOpen={this.props.isOpen}
                    title={RS.getString('EXPORT', null, 'UPPER')}
                    actions={actions}
                    handleClose={this.props.handleClose}
                    className="export-dialog"
                >
                    <div className="body-export">
                        <div className={"header  " + cssCheckAll}>
                            <MyCheckBoxSpecial
                                onChange={this.handleColumnCheckAll}
                                checked={checkedNumber > 0}
                                className="filled-in"
                                id="All_columns"
                                label={RS.getString('ALL_COLUMNS')}
                            />
                        </div>
                        <div className="columns-export">
                            {
                                items.map(function (item, index) {
                                    return (
                                        <MyCheckBox
                                            key={index}
                                            className="filled-in"
                                            id={'export_column_name' + item.value}
                                            defaultValue={item.checked}
                                            onChange={this.handleItemChecked.bind(this, index)}
                                            label={item.label}
                                        />
                                    );
                                }.bind(this))
                            }
                        </div>
                    </div>
                </Dialog>
                <DialogAlert
                    icon={require("../../../images/complete-icon.png")}
                    isOpen={this.state.isOpenExportSuccess}
                    handleClose={() => this.setState({ isOpenExportSuccess: false })}
                    title={RS.getString('SUCCESSFUL')}
                >
                    <div className="export-success">
                        <div> {RS.getString('P112')}</div>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: `${RS.getString('P113',
                                    `<a class="click-here" onClick="window.open('${API_FILE + '/' + this.props.relativeFilePath}', '_blank')" >
                      ${RS.getString('CLICK_HERE')}</a>`)}`
                            }}
                        />
                    </div>
                </DialogAlert>
                <DialogAlert
                    icon={require("../../../images/warning.png")}
                    isOpen={this.state.isOpenExportFail}
                    handleClose={() => this.setState({ isOpenExportFail: false })}
                    title={RS.getString('FAILED')}
                >
                    <div className="export-fail">
                        <div> {RS.getString('P114')}</div>
                    </div>
                </DialogAlert>
            </div>
        );
    }
}
ExportDialog.propTypes = propTypes;

export default ExportDialog;