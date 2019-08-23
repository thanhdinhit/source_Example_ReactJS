import React from 'react';
import { MyHeader, MyHeaderColumn, MyRowHeader } from '../../elements/table/MyTable';
const SkillsTaskView = React.createClass({
    render: function () {
        return (
            <div >
                {this.props.employee.jobSkills.map(function (a, index) {
                        return (
                            <table key={index}>
                                <MyHeader>
                                    <MyRowHeader>
                                        <MyHeaderColumn>
                                            {a.name}
                                        </MyHeaderColumn>
                                    </MyRowHeader>
                                </MyHeader>
                                <tbody style={{display:"table-row", height: "50px", border: "1px solid #d6e1e5"}}>
                                </tbody>
                            </table>
                        )
                    }.bind(this))
                }
        </div>
        )
    }
});
export default SkillsTaskView;