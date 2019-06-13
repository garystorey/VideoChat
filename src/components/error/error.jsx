import React from 'react';
import PropTypes from 'prop-types';

export default function ErrorMessage(props) {
    let classes = (props.classes)
        ? 'error-container ' + props.classes
        : 'error-container';
    let msg = props.errorMessageText || "An error has occurred";
    return (
        <div className={classes}>
            <div className="error-msg"><p>{msg}</p></div>
        </div>
    );
}

ErrorMessage.propTypes = {
    classes: PropTypes.string,
    errorMessageText: PropTypes.string.isRequired
};
