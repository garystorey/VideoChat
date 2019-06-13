import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './modal.css';

export default class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmText: this.props.confirmText !== undefined ? this.props.confirmText : '',
            cancelText: this.props.cancelText !== undefined ? this.props.cancelText : ''
        };
    };

    render() {
        if(!this.props.show) {
            return null;
        }

        const { confirmText, cancelText } = this.state;
        const { hasOptions, doConfirm, doCancel } = this.props;
        return (
            <div className="modal__backdrop">
                <div className="modal__content">
                    {this.props.children}
                    {hasOptions === false &&
                        <div className="icon--modal-close" onClick={(e) => {doCancel(e)}}>
                            <svg className="icon close" width="50" height="50" viewBox="0 0 50 50"><title>Close Reminder</title><path d="M21.82 25L.662 3.843A2.245 2.245 0 0 1 .66.66a2.245 2.245 0 0 1 3.183.002L25 21.82 46.157.662A2.245 2.245 0 0 1 49.34.66a2.245 2.245 0 0 1-.002 3.183L28.18 25l21.158 21.157c.879.88.886 2.298.002 3.183a2.245 2.245 0 0 1-3.183-.002L25 28.18 3.843 49.338c-.88.879-2.298.886-3.183.002a2.245 2.245 0 0 1 .002-3.183L21.82 25z"/></svg>
                        </div>
                    }
                    {hasOptions &&
                        <ul className="modal__options">
                            <li className="modal__confirm" onClick={(e) => {doConfirm(e)}}>
                                {confirmText}
                            </li>
                            <li className="modal__cancel" onClick={(e) => {doCancel(e)}}>
                                {cancelText}
                            </li>
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

Modal.propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node
};
