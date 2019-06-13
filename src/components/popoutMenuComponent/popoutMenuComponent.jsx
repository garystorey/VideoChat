import React, { Component } from 'react';
import Modal from "../confirmationModalComponent";

import './popoutMenu.css';

export default class PopoutMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMenu: false
        };
    };

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    handleClick = (e) => {
        if (this.node.contains(e.target)) {
            // Click inside, carry on...
            return;
        }

        this.setState({
            showMenu: false
        });
    };

    toggleMenu = (e) => {
        e.preventDefault();
        this.setState({
            showMenu: !this.state.showMenu
        });
    };

    toggleConfirmationModal = () => {
        this.setState({
            isOpen: !this.state.isOpen,
            showMenu: false
        });
    };

    confirmDelete = (fileId) => {
        this.setState({
            isOpen: !this.state.isOpen
        });
        this.props.deleteCallback(fileId);
    };

    render() {
        const { showMenu, isOpen } = this.state;
        const { openCallback, file, fileId, title, edit } = this.props;
        return(
            <div className="popout-menu" ref={node => this.node = node}>
                <Modal
                    show={isOpen}
                    delay={null}
                    hasOptions={true}
                    doCancel={this.toggleConfirmationModal}
                    doConfirm={() => this.confirmDelete(fileId)}
                    confirmText='Yes, delete this item.'
                    cancelText='No, do not delete this item.'
                >
                    <h2>Delete this Item?</h2>
                    <p>Are you sure you want to delete this item?</p>
                </Modal>
                <button className="popout-menu__trigger" onClick={this.toggleMenu}>
                    <span className="icon menu-trigger__icon">
                        <svg width="12" height="50" viewBox="0 0 12 50"><title>MENU</title><path d="M6.003 19A6.002 6.002 0 0 0 0 25c0 3.314 2.69 6 6.003 6A5.998 5.998 0 0 0 12 25c0-3.314-2.684-6-5.997-6zm0-7A6 6 0 0 0 12 6a6 6 0 1 0-5.997 6zm0 26A6.002 6.002 0 0 0 0 44c0 3.314 2.69 6 6.003 6A5.998 5.998 0 0 0 12 44c0-3.314-2.684-6-5.997-6z"/></svg>
                    </span>
                </button>
                {showMenu === true &&
                    <ul className="popout-menu__actions">
                        <li className="popout-menu__action" onClick={(e) => openCallback(e, file, false)}>Open</li>
                        {edit === true &&
                            <li className="popout-menu__action" onClick={(e) => openCallback(e, file, true)}>Edit</li>
                        }
                        <li className="popout-menu__action" onClick={this.toggleConfirmationModal}>Delete</li>
                    </ul>
                }
            </div>
        )
    }
}
