import React, { PropTypes } from 'react';
import Dialog from '../../elements/Dialog';
import RaisedButton from '../../../components/elements/RaisedButton';
import MyCheckBox from '../../elements/MyCheckBox';
import MyCheckBoxSpecial from '../../elements/MyCheckBoxSpecial';
import RS from '../../../resources/resourceManager';
import CommonTextField from '../../elements/TextField/CommonTextField.component'
import _ from 'lodash';

const DialogAddSkills = React.createClass({
    propTypes: {
        onChange: PropTypes.func,
        skillSelected: PropTypes.array,
        skills: PropTypes.array,
        isOpen: PropTypes.bool,
        handleClose: PropTypes.func,
        modal: PropTypes.bool,
        title: PropTypes.string,
    },
    getInitialState: function () {
        return {
            searchTxt: ''
        };
    },
    componentWillReceiveProps: function (nextProps) {
        if (!this.props.isOpen && nextProps.isOpen) {
            this.skillSelected = [];
            this.skillNews = this.handleGetSkillToDialog();
        }

        if (!nextProps.isOpen) {
            this.setState({ searchTxt: '' });
        }
    },

    skillNews: [],
    skillSelected: [],

    handleClose: function () {
        this.props.handleClose();
    },

    handleCancel: function () {
        this.props.handleClose();
    },

    handleUserInput: function () {
        this.props.onChange(this.skillSelected);
        this.props.handleClose();
    },

    handleSkillChecked: function (element, checked, e) {
        if (checked) {
            this.skillSelected.push(element);
        }
        else {
            this.skillSelected = this.skillSelected.filter(x => x.id != element.id);
        }

        this.forceUpdate();
    },

    handleSkillCheckAll: function (e, checked) {
        if (checked) {
            this.skillSelected = this.handleGetSkillToDialog();
        }
        else {
            this.skillSelected = [];
        }
        this.forceUpdate();
    },

    handleSearch: function (e, value) {
        this.setState({ searchTxt: value });
    },

    handleGetSkillToDialog: function () {
        let skills = _.cloneDeep(this.props.skills);
        let selecteds = _.cloneDeep(this.props.skillSelected);
        let newSkills = [];

        _.map(skills, (skill, index) => {
            let skillExisted = _.filter(selecteds, {
                jobSkill: {
                    id: skill.id
                }
            }, true);

            if (skillExisted.length === 0) {
                newSkills.push(skill);
            }
        });

        // Filter skill with search text
        let skillsFinal = newSkills.length > 0 ? newSkills.filter(x => _.includes(x.name.toLowerCase(), this.state.searchTxt.toLowerCase())) : [];

        return skillsFinal;
    },

    renderSkills: function () {
        this.skillNews = this.handleGetSkillToDialog();

        return (
            this.skillNews.length > 0 ?
                this.skillNews.map(function (element, index) {
                    return (
                        <MyCheckBox
                            key={element.id}
                            className="filled-in"
                            id={element.id}
                            defaultValue={this.skillSelected.find(x => x.id == element.id) != undefined}
                            onChange={this.handleSkillChecked.bind(this, element)}
                            label={element.name}
                        />
                    );
                }.bind(this)) : ''
        );
    },

    handleCssCheckboxAll: function () {
        let className = '';

        if(this.skillSelected.length > 0) {
            className = 'checkbox-special-type2';

            if(this.skillSelected.length === this.handleGetSkillToDialog().length) {
                className = 'checkbox-special';
            }
        }

        return className;
    },

    handleCheckboxAll: function () {
        let checked = false;

        if(this.skillSelected.length > 0) {
            checked = true;
        }

        return checked;
    },

    render: function () {
        const actions = [
            <RaisedButton
                key={1}
                className="raised-button-fourth"
                label={RS.getString('CANCEL')}
                onClick={this.handleClose}
            />,
            <RaisedButton
                key={0}
                label={RS.getString('ADD')}
                onClick={this.handleUserInput}
                disabled={!this.skillSelected.length}
            />
        ];

        let cssCheckAll = this.handleCssCheckboxAll();

        return (
            <Dialog
                style={{ widthBody: '496px' }}
                isOpen={this.props.isOpen}
                title={this.props.title}
                actions={actions}
                modal={this.props.modal ? this.props.modal : false}
                handleClose={this.handleClose}
            >
                <div className="dialog-add-skills">
                    <div className={"header " + cssCheckAll}>
                        <MyCheckBoxSpecial
                            onChange={this.handleSkillCheckAll}
                            checked={this.handleCheckboxAll()}
                            className="filled-in"
                            id="All-skill"
                            label={RS.getString('ALL_SKILLS', 'SKILLS')} />
                        <div className="search" >
                            <CommonTextField
                                onChange={this.handleSearch}
                                hintText={RS.getString('SEARCH_SKILL', 'SKILLS')}
                                fullWidth={true}
                            />
                            <img className={'img-search img-gray-brightness'} src={require("../../../images/search.png")} />
                        </div>
                    </div>
                    <div className="body-skill">
                        {this.renderSkills()}
                    </div>
                </div>
            </Dialog>
        );
    }
});

export default DialogAddSkills;