/* global OT */
import React, { Component } from 'react';
import { createSession, preloadScript } from 'opentok-react';
import Modal from "../confirmationModalComponent";

import { getSession } from "../../utils/server";

import config from "../../utils/config";
import PublisherComponent from './PublisherComponent';
import SubscriberComponent from './SubscriberComponent';

import CopyToClipboard from '../copyComponent';

import './rooms.css';

const app = navigator.appVersion;
const isChrome = app.indexOf('Chrome') > -1;
const version = app.substring(app.indexOf('Chrome')+7,app.indexOf('Chrome')+9);



class Video extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            defaultHeight: '100%',
            defaultWidth: '100%',
            publisherHeight: '150px',
            publisherWidth: '267px',
            publishVideo: true,
            publishAudio: true,
            isFullScreen: false,
            showThumbnail: true,
            isConfirmationOpen: false,
            isReminderOpen: false,
            connection: 'Not Connected',
            screenShare: false,
            streams: []
        };
    }

    componentDidMount() {
        const that=this;
        this.sessionEventHandlers = {
            sessionConnected: () => {
                this.setState({ connection: 'Connected' });
            },

            sessionDisconnected: () => {
                this.setState({
                    connection: 'Disconnected',
                    sessionId: null,
                    token: null
                });
            },
            sessionReconnected: () => {
                this.setState({ connection: 'Reconnected' });
            },
            sessionReconnecting: () => {
                this.setState({ connection: 'Reconnecting' });
            },
        };
        if (isChrome && version <= 71) {

            OT.registerScreenSharingExtension('chrome',config.CHROME_EXTENSION_ID,2);

            OT.checkScreenSharingCapability(function(response) {
                if (!response.supported || response.extensionRegistered === false) {
                    console.log('screen sharing not supported, or extension not registered');
                }
                that.setState({ screenSharePlugin: response.extensionInstalled });
            });
        } else {
            this.setState({ screenSharePlugin:true });
        }
    }

    componentWillUnmount() {
        if (this.sessionHelper !== undefined) {
            this.sessionHelper.disconnect();
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.roomWidthClass === 'room--minimized' && this.state.showThumbnail === true) {
            this.setState({ showThumbnail: false });
        }

        if (this.props.roomWidthClass === 'room--minimized' && newProps.roomWidthClass === 'room--standard' && this.state.showThumbnail === false) {
            this.setState({ showThumbnail: true });
        }
    }

    onSessionError = error => {
        this.setState({ error });
    };

    sessionStartEnd = (connection, sessionId, token) => {
        this.sessionHelper = createSession({
            apiKey: config.API_KEY,
            sessionId: sessionId,
            token: token,
            onStreamsUpdated: streams => {
                this.setState({ streams });
            }
        });

        if (connection === true) {
            this.sessionHelper.session.on(this.sessionEventHandlers);
        }

        if (connection === false) {
            this.sessionHelper.session.disconnect();
        }
    };

    togglePublisherAudio = (e) => {
        e.preventDefault();
        this.setState({ publishAudio: !this.state.publishAudio });
    };

    togglePublisherVideo = (e) => {
        e.preventDefault();
        this.setState({ publishVideo: !this.state.publishVideo });
    };

    toggleScreenShare = (e) => {
        e.preventDefault();
        this.setState({ screenShare: !this.state.screenShare });
    };

    externalScreenShareToggle = () => {
        this.setState({ screenShare: false });
    };

    toggleThumbnailVideo = (e) => {
        e.preventDefault();
        this.setState({ showThumbnail: !this.state.showThumbnail });
    };

    joinCall = (e) => {
        e.preventDefault();
        getSession({ storeId: this.props.roomId, name: this.props.userName, userId: this.props.userId }).then((data) => {
            this.setState({ sessionId: data.sessionId, token: data.token });
            this.sessionStartEnd(true, data.sessionId, data.token);
        });
    };

    toggleConfirmationModal = (e) => {
        e.preventDefault();
        this.setState({
            isConfirmationOpen: !this.state.isConfirmationOpen
        });
    };

    toggleReminderModal = () => {
        this.setState({
            isReminderOpen: !this.state.isReminderOpen
        })
    };

    endCall = (e) => {
        e.preventDefault();
        this.sessionStartEnd(
            false,
            this.state.sessionId,
            this.state.token
        );

        this.setState({
            isConfirmationOpen: !this.state.isConfirmationOpen,
            isReminderOpen: true
        });
    };

    render() {
        const { connection, isFullScreen, isConfirmationOpen, isReminderOpen, publishVideo, publishAudio, publisherHeight, publisherWidth, defaultHeight, defaultWidth, screenShare } = this.state;
        return (
            <div className="rooms">
                <div className={"room " + this.props.roomWidthClass}>
                    <Modal
                        show={isConfirmationOpen}
                        delay={null}
                        hasOptions={true}
                        doCancel={this.toggleConfirmationModal}
                        doConfirm={this.endCall}
                        confirmText='Yes, end this call.'
                        cancelText='No, keep talking.'
                    >
                        <h2 className="title">
                            <span className="icon end-call">
                                <svg width="26" height="19" viewBox="0 0 26 19" xmlns="http://www.w3.org/2000/svg"><path d="M16.741 13.496a.719.719 0 0 1 1.093.75.713.713 0 0 1-.31.452l-4.061 3.46a.716.716 0 0 1-.929 0l-4.07-3.469a.713.713 0 0 1-.072-1.13.709.709 0 0 1 .52-.178.712.712 0 0 1 .493.242l2.878 2.427V8.566a.718.718 0 0 1 1.434 0v7.495l2.89-2.45c.03-.037.08-.08.134-.115zm5.11-11.978C24.528 2.624 26 4.2 26 5.958v2.076A2.254 2.254 0 0 1 24.862 10a2.253 2.253 0 0 1-1.722.223l-5.518-1.485a2.276 2.276 0 0 1-1.678-2.189v-1.38a28.151 28.151 0 0 0-5.89.001l.001 1.379a2.277 2.277 0 0 1-1.678 2.19L2.86 10.222a2.264 2.264 0 0 1-1.97-.39A2.264 2.264 0 0 1 0 8.03V5.95A3.663 3.663 0 0 1 1.2 3.35 8.916 8.916 0 0 1 4.15 1.517C6.55.539 9.693 0 13 0c3.307 0 6.45.54 8.851 1.518zM16.1 3.744c.73.079 1.28.692 1.278 1.426V6.56c.004.371.258.7.617.796l5.518 1.48c.25.069.52.015.726-.143l.064-.05a.835.835 0 0 0 .254-.613V5.948c0-1.124-1.185-2.257-3.25-3.107-2.218-.907-5.168-1.407-8.307-1.407-3.128 0-6.077.504-8.304 1.42A7.532 7.532 0 0 0 2.21 4.376a2.28 2.28 0 0 0-.787 1.587v2.082a.84.84 0 0 0 .428.724c.195.108.42.135.635.073l5.52-1.498a.838.838 0 0 0 .616-.797V5.17A1.426 1.426 0 0 1 9.9 3.744a29.56 29.56 0 0 1 6.2 0z" fill="#C52033" /></svg>
                            </span>
                            &nbsp;End this call?
                        </h2>
                        <p>Ending this call will stop sending audio and video to all subscribers.<br/> You can still access notes, documents, and photos.</p>
                    </Modal>
                    <Modal
                        show={isReminderOpen}
                        hasOptions={false}
                        doCancel={this.toggleReminderModal}
                        doConfirm={null}
                    >
                        <h2 className="title--call-ended">
                            Your call has ended.
                        </h2>
                        <p>You can still upload and view documents and photos.<br/>If your review is over, please make sure to close this browser tab!
                        </p>
                    </Modal>
                    <div className="connection-status">
                        <span className="u-left">Status: <span className="status">{connection}</span></span>
                        <span className="u-right">
                            <CopyToClipboard message="Copied!" value={(this.state.sessionId) ? this.state.sessionId : 'making copies'}>
                                <span>
                                    <svg width="13" enableBackground="new 0 0 50 50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="m46.875 12.5c1.726 0 3.125 1.399 3.125 3.125v31.25c0 1.726-1.399 3.125-3.125 3.125h-31.25c-1.726 0-3.125-1.399-3.125-3.125v-9.375h-9.375c-1.726 0-3.125-1.399-3.125-3.125v-31.25c0-1.726 1.399-3.125 3.125-3.125h31.25c1.726 0 3.125 1.399 3.125 3.125v9.375zm0 34.375v-31.25h-15.032-16.218v1.25 3.75 3.125 3.75 3.125 16.25zm-33.736-33.125c.571-.755 1.467-1.25 2.486-1.25h18.75v-9.375h-31.25v31.25h9.375v-3.75h-5.312c-.863 0-1.562-.699-1.562-1.562s.698-1.563 1.562-1.563h5.312v-3.75h-5.312c-.863 0-1.562-.699-1.562-1.562s.699-1.562 1.562-1.562h5.312v-3.75h-5.312c-.863 0-1.562-.699-1.562-1.562s.699-1.562 1.562-1.562h5.951zm6.549 26.25h16.125c.863 0 1.562.699 1.562 1.562s-.699 1.562-1.562 1.562h-16.125c-.863 0-1.562-.699-1.562-1.562s.698-1.562 1.562-1.562zm23.124-6.875c.863 0 1.562.699 1.562 1.562s-.699 1.562-1.562 1.562h-23.124c-.863 0-1.562-.699-1.562-1.562s.699-1.562 1.562-1.562zm0-6.875c.863 0 1.562.699 1.562 1.562s-.699 1.562-1.562 1.562h-23.124c-.863 0-1.562-.699-1.562-1.562s.699-1.562 1.562-1.562zm-24.687-5.312c0-.863.699-1.562 1.562-1.562h23.125c.863 0 1.562.699 1.562 1.562s-.698 1.562-1.562 1.562h-23.124c-.864 0-1.563-.699-1.563-1.562zm13.75-12.5c0 .863-.699 1.562-1.562 1.562h-23.125c-.863 0-1.562-.699-1.562-1.562s.699-1.562 1.562-1.562h23.125c.863-.001 1.562.698 1.562 1.562z" fill="#ccc" transform="" /></svg>
                                    <span style={{ "paddingLeft": 8 }}>Copy Session Info</span>
                                </span>
                            </CopyToClipboard>
                        </span>
                    </div>
                    <ul className="subscriber__wrapper">
                        {connection !== 'Connected' &&
                            <li className="start-call__screen">
                                <div className="start-call__trigger" onClick={this.joinCall}>
                                    <div className="start-call start-call__button">
                                        <svg className="icon" width="25" height="20" viewBox="0 0 25 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.42 2.471a.719.719 0 0 1-.466-1.24c.14-.131.323-.2.514-.193L18.78.533a.716.716 0 0 1 .76.532l1.345 5.176a.713.713 0 0 1-.59.967.709.709 0 0 1-.527-.153.712.712 0 0 1-.265-.48l-.965-3.639-4.293 6.13a.718.718 0 0 1-1.175-.822l4.3-6.14-3.773.35a.626.626 0 0 1-.176.017zM2.363 9.351C.806 6.911.503 4.775 1.511 3.335l1.192-1.7a2.254 2.254 0 0 1 2.06-.958c.603.054 1.15.339 1.538.804l3.668 4.382c.655.784.704 1.917.119 2.755l-.791 1.13a28.151 28.151 0 0 0 4.826 3.379l.789-1.13a2.277 2.277 0 0 1 2.63-.832l5.372 1.949a2.264 2.264 0 0 1 1.39 1.45c.214.669.1 1.411-.305 1.986l-1.193 1.703a3.663 3.663 0 0 1-2.475 1.443c-1.162.164-2.33.1-3.47-.191-2.524-.575-5.408-1.936-8.117-3.833-2.71-1.897-4.975-4.142-6.38-6.32zm5.988 1.476a1.43 1.43 0 0 1-.229-1.901l.798-1.14a.837.837 0 0 0-.048-1.006L5.2 2.403a.83.83 0 0 0-.676-.299l-.081.004a.835.835 0 0 0-.56.357L2.688 4.17c-.645.922-.324 2.53.88 4.41 1.297 2.015 3.427 4.117 5.998 5.917 2.562 1.795 5.267 3.073 7.616 3.6.957.25 1.935.309 2.912.178a2.28 2.28 0 0 0 1.555-.847l1.194-1.706a.84.84 0 0 0 .064-.839.827.827 0 0 0-.478-.424l-5.38-1.939a.838.838 0 0 0-.963.3l-.79 1.129c-.42.603-1.222.79-1.866.434a29.56 29.56 0 0 1-5.079-3.556z" fill="#FFF" /></svg>
                                    </div>
                                    <h3 className="title">Click to Start Call</h3>
                                </div>
                            </li>
                        }
                        {connection === 'Connected' && this.state.streams.length === 0 &&
                            <li className="start-call__screen">
                                <h3 className="title waiting">Waiting on the other party to join.</h3>
                                <div className="loading-ripple">
                                    <div></div>
                                    <div></div>
                                </div>
                            </li>
                        }
                        {connection === 'Connected' && isFullScreen === false &&
                            this.state.streams.map(stream => {
                                return (
                                    <SubscriberComponent
                                        key={stream.id}
                                        session={this.sessionHelper.session}
                                        stream={stream}
                                        publishAudio={true}
                                        publishVideo={true}
                                        screenShare={screenShare}
                                        height={defaultHeight}
                                        width={defaultWidth}
                                    />
                                );
                            })
                        }
                    </ul>
                    <div className={this.state.showThumbnail ? 'publisher__wrapper expanded' : 'publisher__wrapper collapsed'}>
                        {connection === 'Connected' &&
                            <PublisherComponent
                                session={this.sessionHelper.session}
                                publishAudio={publishAudio}
                                publishVideo={publishVideo}
                                videoSource='camera'
                                height={publisherHeight}
                                width={publisherWidth}
                            />
                        }
                        {screenShare &&
                            <PublisherComponent
                                session={this.sessionHelper.session}
                                videoSource='screen'
                                screenShareCallback={this.externalScreenShareToggle}
                                publishAudio={false}
                                defaultUI={false}
                                height='0'
                                width='0'
                            />
                        }
                        {(connection === 'Connected' && this.props.roomWidthClass !== 'room--minimized')&&
                            <button type="button" id="showHideThumbnail" className={this.state.showThumbnail ? 'expanded' : 'collapsed'} onClick={this.toggleThumbnailVideo}>
                                {this.state.showThumbnail ?
                                    <span className="icon show-hide-thumbnail show-thumbnail">
                                        <svg width="19" height="19" viewBox="0 0 19 19"><title>Minimize</title><path fill="#FFF" d="M11.91 1.85c-.496 0-.898-.381-.898-.85 0-.47.402-.85.898-.85h6.042c.495 0 .897.38.897.85v17c0 .469-.402.849-.897.849H1.047c-.496 0-.897-.38-.897-.849v-6.819c0-.469.401-.849.897-.849.497 0 .898.38.898.849v5.969h15.108V1.85H11.91zM8.026 8.841l-6.563.002a.81.81 0 1 1 0-1.621l4.611-.001L.236 1.383A.81.81 0 1 1 1.382.237l5.832 5.832V1.47a.81.81 0 0 1 1.622 0v6.56a.8.8 0 0 1-.056.282c-.006.016-.016.032-.024.049-.019.042-.033.086-.059.123a.83.83 0 0 1-.375.295.811.811 0 0 1-.296.062z"/></svg>
                                    </span>
                                    :
                                    <span className="icon show-hide-thumbnail hide-thumbnail">
                                        <svg width="19" height="19" viewBox="0 0 19 19"><title>Maximize</title><path fill="#FFF" d="M11.855 1.714c-.5 0-.905-.384-.905-.857S11.355 0 11.855 0h6.09c.5 0 .905.384.905.857v17.136c0 .474-.405.857-.905.857H.905c-.5 0-.905-.383-.905-.857v-6.872c0-.474.405-.858.905-.858s.906.384.906.858v6.015H17.04V1.714h-5.185zM.816.009L7.432.007a.816.816 0 1 1 0 1.634l-4.648.001 5.884 5.884c.16.16.239.369.239.578a.817.817 0 0 1-1.394.578L1.634 2.803v4.636a.817.817 0 1 1-1.634 0V.826C0 .725.023.632.056.543.063.526.072.51.08.493.099.45.114.406.139.369.167.327.202.292.241.252A.823.823 0 0 1 .517.071.827.827 0 0 1 .816.009z"/></svg>
                                    </span>
                                }
                            </button>
                        }
                    </div>
                    <div className="publisher-controls">
                        {connection === 'Connected' ?
                            <ul className="video-controls">
                                <li className="video-control">
                                    <button type="button" id="videoButton"
                                            className={this.state.publishVideo ? 'enabled' : 'disabled'}
                                            onClick={this.togglePublisherVideo}>
                                        {this.state.publishVideo &&
                                            <svg width="26" height="16" viewBox="0 0 26 16"><title>Video Enabled</title><path d="M25.59 2.142c.253.14.41.407.41.695v9.358a.798.798 0 0 1-1.215.677l-4.276-2.643v1.675a3.132 3.132 0 0 1-3.13 3.128H3.13A3.132 3.132 0 0 1 0 11.904V3.129A3.132 3.132 0 0 1 3.129 0h14.25a3.132 3.132 0 0 1 3.129 3.129v1.674l4.276-2.643a.796.796 0 0 1 .807-.018zm-1.183 8.625V4.265l-3.899 2.41v1.681l3.899 2.41zm-5.49 1.137V3.13c0-.847-.69-1.537-1.537-1.537H3.129c-.847 0-1.537.69-1.537 1.537v8.775c0 .848.69 1.536 1.537 1.536h14.25c.848 0 1.538-.688 1.538-1.536z" fill="#FFF"/></svg>
                                        }
                                        {!this.state.publishVideo &&
                                            <svg width="26" height="18" viewBox="0 0 26 18"><title>Video Disabled</title><path fill="#FFF" d="M18.917 8.175l6.88-4.444a.791.791 0 0 1 .203.523v9.358a.798.798 0 0 1-.796.796.798.798 0 0 1-.419-.12l-4.276-2.643v1.676a3.133 3.133 0 0 1-3.129 3.128H6.104l2.465-1.592h8.811a1.54 1.54 0 0 0 1.537-1.536V8.175zm5.49 4.008v-6.5l-3.899 2.41v1.68l3.9 2.41zM.107 17.01c-.223-.372-.086-.877.304-1.129L24.783.14c.39-.252.888-.155 1.11.216.223.371.086.877-.304 1.13L1.216 17.223a.852.852 0 0 1-.451.14.74.74 0 0 1-.658-.355zm1.485-4.272l-1.55 1C.023 13.6 0 13.465 0 13.322V4.546a3.132 3.132 0 0 1 3.13-3.13h14.25c.462 0 .898.108 1.294.289l-2.019 1.304H3.13c-.848 0-1.537.689-1.537 1.537v8.19z"/></svg>
                                        }
                                    </button>
                                </li>
                                <li className="video-control">
                                    <button type="button" id="muteButton"
                                            className={this.state.publishAudio ? 'enabled' : 'disabled'}
                                            onClick={this.togglePublisherAudio}>
                                        {this.state.publishAudio &&
                                            <svg width="16" height="26" viewBox="0 0 16 26"><title>Audio Enabled</title><path d="M15.483 10.695c0 4-3.049 7.301-6.945 7.701v6.011h2.891a.797.797 0 0 1 0 1.593H4.055a.796.796 0 1 1 0-1.593h2.89v-6.01C3.05 17.995 0 14.694 0 10.694a.796.796 0 1 1 1.593 0 6.156 6.156 0 0 0 6.149 6.15 6.156 6.156 0 0 0 6.148-6.15.796.796 0 1 1 1.593 0zm-7.741 4.484a4.489 4.489 0 0 1-4.484-4.484V4.483A4.488 4.488 0 0 1 7.742 0a4.488 4.488 0 0 1 4.483 4.483v6.211a4.489 4.489 0 0 1-4.483 4.485zM4.852 4.483v6.212a2.895 2.895 0 0 0 2.89 2.892 2.894 2.894 0 0 0 2.89-2.892V4.483a2.894 2.894 0 0 0-2.89-2.89 2.894 2.894 0 0 0-2.89 2.89z" fill="#FFF"/></svg>
                                        }
                                        {!this.state.publishAudio &&
                                            <svg width="26" height="26" viewBox="0 0 26 26"><title>Audio Disabled</title><path fill="#FFF" d="M19.686 9.898c.44 0 .797.356.797.796 0 4-3.05 7.302-6.945 7.702v6.011h2.89a.796.796 0 1 1 0 1.593H9.055a.796.796 0 0 1 0-1.593h2.89v-6.01a7.702 7.702 0 0 1-3.94-1.584l1.446-.933c.953.607 2.08.964 3.29.964a6.156 6.156 0 0 0 6.15-6.15c0-.44.357-.796.796-.796zm-2.479.974c-.096 2.389-2.054 4.308-4.465 4.308a4.453 4.453 0 0 1-1.687-.336l1.995-1.287a2.883 2.883 0 0 0 2.175-1.405l1.982-1.28zm-17.1 7.73c-.223-.371-.086-.877.304-1.13l24.372-15.74c.39-.251.888-.154 1.11.217.223.37.086.877-.304 1.129L1.216 18.818a.842.842 0 0 1-.451.139.738.738 0 0 1-.658-.355zm6.505-7.515l-1.489.961A7.74 7.74 0 0 1 5 10.694a.796.796 0 1 1 1.592 0c0 .133.012.263.02.393zm3.24-2.091l-1.594 1.029V4.484A4.49 4.49 0 0 1 12.742 0c2.392 0 4.334 1.888 4.46 4.249l-1.569 1.014v-.78a2.894 2.894 0 0 0-2.89-2.89 2.894 2.894 0 0 0-2.892 2.89v4.513z"/></svg>
                                        }
                                    </button>
                                </li>
                                <li className="video-control">
                                    <button type="button" id="screenShareButton" className={this.state.screenShare ? 'enabled' : 'disabled'} onClick={this.toggleScreenShare}>
                                        {this.state.screenShare &&
                                            <svg width="26" height="22" viewBox="0 0 26 22"><title>Screenshare Connected</title><path d="M1.668 0h22.447c.92 0 1.668.748 1.668 1.668v14.214a1.67 1.67 0 0 1-1.668 1.668H13.65v2.083h3.794a.54.54 0 0 1 .54.54v.438a.54.54 0 0 1-.54.539H8.34a.54.54 0 0 1-.539-.54v-.438a.54.54 0 0 1 .54-.539h3.793V17.55H1.668A1.67 1.67 0 0 1 0 15.882V1.668C0 .748.748 0 1.668 0zm-.151 1.668v14.214c0 .08.07.151.151.151h22.447c.081 0 .152-.07.152-.151V1.668a.155.155 0 0 0-.152-.151H1.668c-.08 0-.151.07-.151.151zM10.903 13C9.91 13 9.1 12.211 9.1 11.241v-4.63c0-.969.809-1.758 1.803-1.758.296 0 .59.073.853.211l4.494 2.358c.562.294.91.87.91 1.505 0 .633-.348 1.21-.91 1.504l-4.494 2.358a1.842 1.842 0 0 1-.853.211zm-.286-1.759c0 .206.264.294.435.206l4.494-2.358a.178.178 0 0 0 .098-.162.18.18 0 0 0-.098-.163l-4.494-2.357a.318.318 0 0 0-.149-.037c-.138 0-.286.092-.286.242v4.63z"  fill="#FFF"/></svg>
                                        }
                                        {!this.state.screenShare &&
                                            <svg width="26" height="22" viewBox="0 0 26 22"><title>Screenshare Disconnected</title><path fill="#FFF" d="M24.47 4.768L26 3.78v12.235c0 .928-.755 1.683-1.682 1.683H13.765v2.092h3.826c.3 0 .543.244.543.544v.442c0 .3-.244.543-.543.543H8.409a.544.544 0 0 1-.543-.543v-.442c0-.3.243-.544.543-.544h3.826v-2.092H3.9l2.369-1.53h18.049a.157.157 0 0 0 .153-.153V4.768zM.108 17.009c-.223-.371-.086-.877.304-1.129L24.783.14c.391-.252.888-.155 1.11.216.223.371.086.877-.304 1.129L1.217 17.225a.859.859 0 0 1-.452.14.74.74 0 0 1-.658-.356zm1.422-4.412L0 13.585V1.682C0 .755.755 0 1.682 0h19.903l-2.368 1.53H1.682a.157.157 0 0 0-.153.152v10.915z"/></svg>
                                        }
                                    </button>
                                </li>
                                <li className="video-control">
                                    <button type="button" id="endCallButton" className="end-call" onClick={this.toggleConfirmationModal}>
                                        <svg width="26" height="19" viewBox="0 0 26 19" xmlns="http://www.w3.org/2000/svg"><path d="M16.741 13.496a.719.719 0 0 1 1.093.75.713.713 0 0 1-.31.452l-4.061 3.46a.716.716 0 0 1-.929 0l-4.07-3.469a.713.713 0 0 1-.072-1.13.709.709 0 0 1 .52-.178.712.712 0 0 1 .493.242l2.878 2.427V8.566a.718.718 0 0 1 1.434 0v7.495l2.89-2.45c.03-.037.08-.08.134-.115zm5.11-11.978C24.528 2.624 26 4.2 26 5.958v2.076A2.254 2.254 0 0 1 24.862 10a2.253 2.253 0 0 1-1.722.223l-5.518-1.485a2.276 2.276 0 0 1-1.678-2.189v-1.38a28.151 28.151 0 0 0-5.89.001l.001 1.379a2.277 2.277 0 0 1-1.678 2.19L2.86 10.222a2.264 2.264 0 0 1-1.97-.39A2.264 2.264 0 0 1 0 8.03V5.95A3.663 3.663 0 0 1 1.2 3.35 8.916 8.916 0 0 1 4.15 1.517C6.55.539 9.693 0 13 0c3.307 0 6.45.54 8.851 1.518zM16.1 3.744c.73.079 1.28.692 1.278 1.426V6.56c.004.371.258.7.617.796l5.518 1.48c.25.069.52.015.726-.143l.064-.05a.835.835 0 0 0 .254-.613V5.948c0-1.124-1.185-2.257-3.25-3.107-2.218-.907-5.168-1.407-8.307-1.407-3.128 0-6.077.504-8.304 1.42A7.532 7.532 0 0 0 2.21 4.376a2.28 2.28 0 0 0-.787 1.587v2.082a.84.84 0 0 0 .428.724c.195.108.42.135.635.073l5.52-1.498a.838.838 0 0 0 .616-.797V5.17A1.426 1.426 0 0 1 9.9 3.744a29.56 29.56 0 0 1 6.2 0z" fill="#FFF" /></svg>
                                    </button>
                                </li>
                            </ul>
                        : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default preloadScript(Video);
