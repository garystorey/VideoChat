import React, { Component } from 'react'
import Moment from 'react-moment'
import moment from 'moment'
import 'moment-timezone'
import NotesEditor from "./notesEditorComponent"
import PopoutMenu from '../popoutMenuComponent'
import { querySharepoint, deleteFromSharepoint, getUserInfo } from "../../utils/sharepointConnect"
import { ENV } from "../../utils/config";
import PropTypes from 'prop-types'

import './notesList.css'

export default class NotesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notes: [],
            noteId: null,
            noteTitle: '',
            noteBody: '',
            viewEdit: false
        };
    }

    componentWillMount() {
        this.getNotes();
        this.startNotesPoller();
    }

    componentWillUnmount() {
        clearInterval(this.timeout);
    }

    getNotes = () => {
        if (ENV === 'production') {
            querySharepoint(this.props.sourceUrl)
                .then((notes) => {
                    return Promise.all(notes.map((note) => {
                        return getUserInfo(note.EditorId)
                            .then((res) => {
                                let EditorName = res.d.Title;
                                let EditorId = res.d.Id;

                                if (note.EditorId === EditorId) {
                                    return {EditorName, ...note};
                                }
                            });
                    }))
                        .then((data) => {
                            this.setState({
                                notes: data
                            });
                        });
                });
        }
        if (ENV !== 'production') {
            querySharepoint(this.props.sourceUrl)
                .then((notes) => {
                    this.setState({
                        notes: notes
                    });
                });
        }
    };

    refreshNotes= (e) => {
        e.preventDefault();
        this.getNotes();
    };

    startNotesPoller() {
        this.timeout = setInterval(() => {
            this.getNotes()
        }, 900000);
    }

    getTimeDiff = (modified) => {
        const now = moment();
        const modifiedTime = moment(modified);
        const difference = now.diff(modifiedTime, 'minutes');

        if (difference <= 30) {
           return true;
        }

        return null;
    };

    addNewNote = (e) => {
        e.preventDefault();
        this.setState({
            viewEdit: true,
            readOnly: false,
            noteId: null,
            noteTitle: '',
            noteBody: '',
            noteTags: []
        })
    };

    viewNote = (note) => {
        const { Id, Title, EditorName, Created, Modified, Notes, VSVTags } = note;
        this.setState({
            viewEdit: true,
            readOnly: true,
            noteId: Id,
            noteTitle: Title,
            noteBody: Notes,
            noteTags: VSVTags.results,
            noteEditor: EditorName,
            noteCreated: Created,
            noteModified: Modified
        })
    };

    deleteNote = (id) => {
        deleteFromSharepoint(id, 'Notes', this.props.deleteUrl)
            .then(res => {
                if (res.ok === true) {
                    this.getNotes();
                }
            })
    };

    closeNoteCallback = (reload) => {
        this.setState({
            viewEdit: false
        });

        if (reload === true) {
            this.getNotes();
        }
    };

    render () {
        const { notes, readOnly, viewEdit, noteId, noteTitle, noteBody, noteTags, noteEditor, noteCreated, noteModified } = this.state;
        return (
            <div className="notes">
                {viewEdit === true &&
                    <NotesEditor
                        noteId={noteId}
                        noteTitle={noteTitle}
                        noteBody={noteBody}
                        readOnly={readOnly}
                        noteTags={noteTags}
                        noteEditor={noteEditor}
                        noteCreated={noteCreated}
                        noteModified={noteModified}
                        closeNoteCallback={this.closeNoteCallback}
                        roomId={this.props.roomId}
                    />
                }
                {viewEdit === false &&
                <div className="wrapper--inner">
                    <ul className="notes__list">
                        <li className="add-note">
                            <button type="button" className="add-note__trigger" onClick={this.addNewNote}>
                                <span className="icon add-note__icon">
                                    <svg width="50" height="49" viewBox="0 0 50 49"><title>Add New Note</title><g><path d="M46 12.351v34.384A2.264 2.264 0 0 1 43.74 49H16.566L0 33.491V5.267A2.266 2.266 0 0 1 2.265 3h36.363L22.202 19.294a2.62 2.62 0 0 0-.71 1.276l-1.424 6.224c-.436 1.903 1.29 3.597 3.187 3.127l6.159-1.529a2.622 2.622 0 0 0 1.221-.69L46 12.353zm-22.424 8.76L39.838 5 45 10.144 28.818 26.31 22 28l1.576-6.888zm18.37-16.825L41 3.34 43.792.55C44.147.194 44.53.017 44.97 0c.423-.01.755.11 1.043.396l3.589 3.589c.287.287.413.622.397 1.041-.02.445-.197.83-.55 1.184L46.662 9l-4.715-4.714z"/><path fill="#FFF" fillOpacity=".35" d="M17 49V36.262A2.261 2.261 0 0 0 14.742 34H1"/></g></svg>
                                </span>
                                Create a Note
                            </button>
                            <button type="button" className="refresh-notes__trigger" onClick={this.refreshNotes}>
                                <span className="icon refresh-notes__icon">
                                    <svg width="50" height="39" viewBox="0 0 50 39"><title>Refresh</title><path d="M49.506 23.862l-5.699-8.573a1.816 1.816 0 0 0-1.41-.809 1.848 1.848 0 0 0-1.508.656l-6.557 7.929a1.815 1.815 0 0 0 .245 2.555c.773.633 1.92.522 2.56-.245l3.371-4.076c-.887 6.309-5.84 11.93-12.03 13.403-5.242 1.254-10.67-.284-14.515-4.115-.689-.683-1.886-.68-2.57.004a1.813 1.813 0 0 0 .003 2.565c3.63 3.613 8.412 5.604 13.464 5.604 1.496 0 2.999-.178 4.465-.529 7.64-1.822 13.554-8.288 14.76-15.96l2.391 3.597c.537.805 1.717 1.042 2.52.508a1.8 1.8 0 0 0 .777-1.15 1.8 1.8 0 0 0-.267-1.364m-33.621-7.408a1.803 1.803 0 0 0-.653-1.227 1.801 1.801 0 0 0-1.33-.406c-.483.046-.92.278-1.23.65L8.755 20.21c-.05-2.962.742-5.884 2.317-8.517 2.306-3.851 6.043-6.635 10.255-7.639 5.582-1.336 11.422.536 15.234 4.886.658.751 1.81.828 2.565.172.366-.319.584-.761.617-1.245a1.802 1.802 0 0 0-.445-1.315C34.594 1.182 27.38-1.125 20.48.524c-5.158 1.23-9.725 4.622-12.53 9.309a19.89 19.89 0 0 0-2.708 8.015l-1.907-2.87a1.826 1.826 0 0 0-2.521-.51c-.405.268-.68.677-.777 1.152-.097.474-.002.959.267 1.362l5.7 8.576c.328.492.858.78 1.515.81.545 0 1.056-.24 1.403-.658l6.556-7.93c.309-.373.453-.845.407-1.326"/></svg>
                                </span>
                            </button>
                        </li>
                    </ul>
                    {notes.length === 0 &&
                        <div>
                            <div className="add-note--large" onClick={this.addNewNote}>
                                <div className="icon add-note__icon--large icon-blanknotes"/>
                                <span className="title">This store does not have any notes yet.</span>
                                <span className="subTitle">Click here to add a new note.</span>
                            </div>
                        </div>
                    }
                    {notes.length > 0 &&
                    <ul className="notes__list">
                        {notes.map(note =>
                            <li className="note" key={note.Id}>
                                <div className="note__trigger" onClick={() => this.viewNote(note)}>
                                    <div className="note__header" title={note.Title}>
                                        <p className="note__title">{note.Title}</p>
                                        <ul className="note__tags">
                                            {/*
                                            {note.VSVTags.results.map(tag =>
                                                <li className="note__tag" key={tag} style={{ "cursor": "arrow"}}>{tag}</li>
                                            )}
                                             */}
                                        </ul>
                                    </div>
                                    <div className="note__timestamp">
                                        <div className="timestamp__modified">
                                            {this.getTimeDiff(note.Modified) === true &&
                                                <span className="new-entry-indicator">
                                                    <span className="icon new-entry__icon">
                                                        <svg viewBox="0 0 48 48"><title>New Item</title><path d="M24 37.8l-9.6 9.3-.1-13.4-13.4-.1 9.3-9.6-9.3-9.6 13.4-.1.1-13.4 9.6 9.3L33.6.9l.1 13.4 13.4.1-9.3 9.6 9.3 9.6-13.4.1-.1 13.4z"/></svg>
                                                    </span>
                                                    NEW
                                                </span>
                                            }
                                            <Moment format="M/D/YYYY h:mm A">{note.Modified}</Moment>
                                        </div>
                                        <div className="note__author">by {note.EditorName}</div>
                                    </div>
                                </div>
                                <PopoutMenu
                                    openCallback={this.viewNote}
                                    deleteCallback={this.deleteNote}
                                    file={note}
                                    title={noteTitle}
                                    fileId={note.Id}
                                />
                            </li>
                        )}
                    </ul>
                    }
                </div>
                }
            </div>
        );
    }
}

NotesList.propTypes = {
    Title: PropTypes.string,
    Id: PropTypes.number
};
