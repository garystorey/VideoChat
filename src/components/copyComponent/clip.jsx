import React from 'react';
import PropTypes from 'prop-types';

import './clip.css';
import copy from 'copy-to-clipboard';


const CopyMessage = (props) => {
    let classes = props.classes ? `copyMessage ${props.classes}` : `copyMessage`;
    return <div className={classes}>{props.message}</div>;
};

export default class CopyToClipboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            copied: false,
        };
    }

    copyValue = () => {
        this.setState({ copied: copy(this.props.value) });
        setTimeout(() => { this.setState({ copied: false }); }, 2000);
    };

    render() {
        const classes = (this.props.classes) ? `clipboard-container ${this.props.classes}` : 'clipboard-container';
        const msgClass = (this.state.copied) ? 'copied' : '';

        return (
            <React.Fragment>
                <span className={classes} onClick={this.copyValue}>
                    {this.props.children}
                </span>
                <CopyMessage message={this.props.message} classes={msgClass} />
            </React.Fragment>
        );
    }

}

CopyToClipboard.propTypes = {
    classes: PropTypes.string,
    message: PropTypes.string,
    value: PropTypes.any.isRequired
};
