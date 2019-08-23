import React, { PropTypes } from 'react';

function EmailView(props) {
    return (
        <div className="text-view inline">
            <div className="content">
                <span>{props.email}</span>
            </div>
        </div>
    );
}

EmailView.propTypes = {
    index: PropTypes.string,
    email: PropTypes.string
};

export default EmailView;