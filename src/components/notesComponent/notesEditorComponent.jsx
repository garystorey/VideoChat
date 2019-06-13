import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from 'react-rte';
import Moment from 'react-moment'
import 'moment-timezone'

import { notesUrl } from "../../utils/config";
import { addEditNote } from "../../utils/sharepointConnect";

/* UI Components */
import Modal from "../confirmationModalComponent";
import './notesEditor.css'

export default class NotesEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            readOnly: false,
            noteId: null,
            noteTitle: '',
            noteBody: RichTextEditor.createEmptyValue(),
            noteTags: [],
            noteEditor: '',
            noteCreated: '',
            noteModified: '',
            isOpen: false
        }
    }

    componentWillMount() {
        this.setState({
            readOnly: this.props.readOnly,
            noteId: this.props.noteId,
            noteTitle: this.props.noteTitle,
            noteBody: RichTextEditor.createValueFromString(this.props.noteBody, 'html'),
            noteTags: this.props.noteTags,
            noteEditor: this.props.noteEditor,
            noteCreated: this.props.noteCreated,
            noteModified: this.props.noteModified
        });
    }

    titleChange = (event) => {
        this.setState({
            noteTitle: event.target.value
        });
    };

    richTextChange = (value) => {
        this.setState({
            noteBody: value
        });
    };

    editNote = () => {
        this.setState({
            readOnly: false
        })
    };

    /*
    addTag = () => {
        console.log("adding a tag");
    };

    removeTag = (tag) => {
        console.log("remove this tag", tag);
    };
    */

    doSave = (e) => {
        e.preventDefault();
        const updatedNotesUrl = notesUrl.replace('{{STOREID}}', this.props.roomId);

        let id = this.state.noteId,
            title = this.state.noteTitle,
            body = this.state.noteBody.toString('html');

        addEditNote(id, title, body, updatedNotesUrl)
            .then(res => {
                if (res.ok === true) {
                    this.props.closeNoteCallback(true);
                }
            });
    };

    cancelEdit = () => {
        let previousNoteBody = RichTextEditor.createValueFromString(this.props.noteBody, 'html'),
            previousTitle = this.props.noteTitle;

        this.setState({
            isOpen: !this.state.isOpen,
            readOnly: true,
            noteBody: previousNoteBody,
            noteTitle: previousTitle
        });

        if (this.state.noteId === null) {
            this.props.closeNoteCallback(false);
        }
    };

    doClose = () => {
        this.props.closeNoteCallback(false);
    };

    toggleConfirmationModal = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    };

    render () {
        const { readOnly, noteTitle, noteBody, noteEditor, noteCreated, noteEdited, isOpen } = this.state;
        const toolbarConfig = {
            // Optionally specify the groups to display (displayed in the order listed).
            display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'HISTORY_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
                {label: 'Bold', style: 'BOLD' },
                {label: 'Italic', style: 'ITALIC' },
                {label: 'Underline', style: 'UNDERLINE' },
            ],
            BLOCK_TYPE_BUTTONS: [
                {label: 'UL', style: 'unordered-list-item' },
                {label: 'OL', style: 'ordered-list-item' }
            ]
        };
        return (
            <div className="notes-editor">
                <Modal
                    show={isOpen}
                    delay={null}
                    hasOptions={true}
                    doCancel={this.toggleConfirmationModal}
                    doConfirm={this.cancelEdit}
                    confirmText='Yes, I want to cancel this update.'
                    cancelText='No, continue editing.'
                >
                    <h2>Cancel Update</h2>
                    <p>
                        Are you sure you want to cancel this update?<br/>
                        Your changes will <em>not</em> be saved.
                    </p>
                </Modal>
                <ul className="notes-nav">
                    <li className="notes-nav__trigger" onClick={this.doClose}>
                        <span className="icon icon__nav-arrow">
                            <svg width="27" height="50" viewBox="0 0 27 50"><title>All Notes</title><path d="M5.976 24.848l20.328 20.967a2.454 2.454 0 0 1-.074 3.497 2.52 2.52 0 0 1-3.534-.073l-22-22.691a2.454 2.454 0 0 1 .012-3.437l22-22.363a2.52 2.52 0 0 1 3.535-.047 2.454 2.454 0 0 1 .049 3.496L5.976 24.848z"/></svg>
                        </span>
                        All Notes
                    </li>
                </ul>
                <div className="notes-editor__wrapper">
                    {readOnly === false &&
                    <ul className="notes-editor__controls">
                        <li className="notes-editor__control">
                            <button type="button" onClick={this.toggleConfirmationModal} className="editor-button__cancel">Cancel</button>
                        </li>
                        <li className="notes-editor__control">
                            <button type="button" onClick={this.doSave} className="editor-button__save">Save</button>
                        </li>
                    </ul>
                    }
                    {readOnly === true &&
                    <ul className="notes-editor__controls">
                        <li className="notes-editor__control">
                            <button type="button" onClick={this.editNote} className="editor-button__edit">Edit</button>
                        </li>
                    </ul>
                    }
                    {/*
                    <ul className="note__tags">
                        {readOnly === false &&
                        <li>
                            <span className="icon icon__tag">
                                <svg width="50" height="32" viewBox="0 0 50 32"><title>Tag List</title><path fill="#B4B8BE" d="M39 1l10 9c.833.77 1 1.853 1 3v6c0 1.146-.167 2.23-1 3l-10 9c-.73.677-1.768 1-2.756 1H4c-2.196 0-4-1.756-4-4V4c0-2.243 1.804-4 4-4h32c.988 0 2.27.323 3 1zm-5 20a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/></svg>
                            </span>
                        </li>
                        }
                        {noteTags.map(tag =>
                            <li className="note__tag" key={tag}>
                                {tag} {readOnly === false && <span className="icon icon__remove-tag" onClick={() => this.removeTag(tag)}>x</span>}
                            </li>
                        )}
                        {readOnly === false &&
                            <li className="note__tag add-tag" onClick={this.addTag}>Add Tag</li>
                        }
                    </ul>
                    */}
                    <input
                        type="text"
                        className="notes-editor__title"
                        name="noteTitle"
                        placeholder="Title your note"
                        onChange={this.titleChange}
                        value={noteTitle}
                        readOnly={readOnly}
                    />
                    <ul className="notes-editor__timestamp note__timestamp">
                        <li>Created: <Moment format="M/D/YYYY h:mm A">{noteCreated}</Moment></li>
                        <li>
                            Last Modified: <Moment format="M/D/YYYY h:mm A">{noteEdited}</Moment>
                            <span className="note__author">by {noteEditor}</span>
                        </li>
                    </ul>
                    <RichTextEditor
                        className="notes-editor__text"
                        toolbarConfig={toolbarConfig}
                        value={noteBody}
                        onChange={this.richTextChange}
                        placeholder="Type your notes here"
                        readOnly={readOnly}
                    />
                </div>
            </div>
        );
    }
}

NotesEditor.propTypes = {
    onChange: PropTypes.func
};
