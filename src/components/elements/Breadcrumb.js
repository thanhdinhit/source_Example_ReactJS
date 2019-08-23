import React from 'react';
import { browserHistory } from 'react-router';
export default React.createClass({
    getDefaultProps: function () {
        return {
            link: [
                {
                    key: "some link",
                    value: "employes"
                },
                {
                    key: "some link detail",
                    value: "employess"
                }
            ]
        }
    },
    render: function () {
        return (
            <ul className="breadcrumb">
                <li className="completed">
                    <a onClick={() => { browserHistory.push(`/`) }}>
                        <i className="fa fa-home " />
                    </a>
                    {
                        this.props.link.length > 0 ? <span>/</span> : ''
                    }
                </li>
                {
                    this.props.link ? this.props.link.map((element, index) =>
                        <li className={element.value ? "active" : ''} key={index}>
                            <a onClick={() => { browserHistory.push(element.value) }}>{element.key}</a>
                            {
                                index != this.props.link.length - 1 ?
                                    <span>/</span> : null
                            }

                        </li>) : ''
                }


            </ul >
        )
    }
})