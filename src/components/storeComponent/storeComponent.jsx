import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { baseUrl, reportUrl, documentUrl, notesUrl, photosUrl } from "../../utils/config";

import './stores.css';

/* UI Components */
import { ResizableBox } from 'react-resizable'
import StoreReports from '../storeReportsComponent'
import StorePhotos from '../storePhotosComponent'
import VideoShare from '../videoShareComponent'
import NotesList from '../notesComponent/notesListComponent'

/* Nav Component */
const Nav = (props) => {
    const { roomId } = props;
    const navItems = [
        { title: 'Store Reports', url: `/store/${roomId}/reports` },
        { title: 'Documents', url: `/store/${roomId}/documents` },
        { title: 'Photos', url: `/store/${roomId}/photos` }
    ];

    return (
        <nav className="primary-nav">
            <ul className="navigation__list">
                {navItems.map((item, i) => (
                    <li key={item.url}>
                        <NavLink
                            to={item.url}
                            activeClassName="active"
                        >
                            {item.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

Nav.propTypes = {
    roomId: PropTypes.string,
};

export default class StoreComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            videoWidth: (window.innerWidth * 0.65),
            userId: props.userId,
            userName: props.userName,
            roomId: props.match.params.roomId,
            roomName: '',
            section: 'reports',
            roomWidthClass: 'room--standard',
            columnWidthClass: 'standard',
            hideNav: false
        };

        this.resizeCallback = this.resizeCallback.bind(this);
    }

    componentDidMount() {
        this.setState({
            roomName: this.props.location.state !== undefined ? this.props.location.state.roomName : '',
            section: (!this.props.match.params.section) ? 'reports' : this.props.match.params.section
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            userId: newProps.userId,
            userName: newProps.userName,
            section: newProps.match.params.section
        });
    }

    resizeCallback(resizeValue) {
        this.setState({
            videoWidth: (window.innerWidth * resizeValue),
            hideNav: (resizeValue <= 0.35),
            roomWidthClass: (resizeValue <= 0.25) ? 'room--minimized' : 'room--standard',
            columnWidthClass: (resizeValue <= 0.25) ? 'collapsed' : 'standard'
        });
    };

    render() {
        const { userId, userName, roomId, roomName, videoWidth, columnWidthClass, roomWidthClass, hideNav, section } = this.state;
        const updatedNotesUrl = notesUrl.replace('{{STOREID}}', roomId);
        const updatedDocsUrl = documentUrl.replace('{{STOREID}}',roomId);
        const updatedPhotosUrl = photosUrl.replace('{{STOREID}}', roomId);
        const deleteUrl = baseUrl.replace('{{STOREID}}', roomId);
        const url = (section === 'reports') ? reportUrl : (section === 'documents') ? updatedDocsUrl : null;

        return (
            <section className="main">
                <div className="wrapper--virtual-tour">
                    <ResizableBox className={columnWidthClass + " column__video"} width={videoWidth} height={Infinity} axis="x">
                        <VideoShare roomId={roomId} userId={userId} userName={userName} roomWidthClass={roomWidthClass} />
                        <NotesList
                            sourceUrl={updatedNotesUrl}
                            deleteUrl={deleteUrl}
                            roomId={roomId}
                        />
                    </ResizableBox>
                    <div className="column__store-info">
                        {!hideNav && <Nav roomId={roomId} roomName={roomName} />}
                        {(section === 'photos')
                            ? <StorePhotos resizeCallback={this.resizeCallback} sourceUrl={updatedPhotosUrl} deleteUrl={deleteUrl} roomId={roomId} />
                            : <StoreReports resizeCallback={this.resizeCallback} sourceUrl={url} deleteUrl={deleteUrl} section={section} roomId={roomId} />
                        }
                    </div >
                </div>
            </section>
        );
    }
}

StoreComponent.propTypes = {
    documentHeight: PropTypes.number,
    documentWidth: PropTypes.number
};

