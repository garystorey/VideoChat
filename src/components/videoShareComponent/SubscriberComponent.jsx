import React, { Component } from 'react';
import Fullscreen from "react-full-screen";
import { OTSubscriber }  from 'opentok-react';

import './subscriber.css';

/*
   Possibly use this to make size changes to the camera feed by targeting the camera element
   ref={(node) => {this.wrapperPDF = node}}
*/

export default class SubscriberComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            publishAudio: props.publishAudio,
            publishVideo: props.publishVideo,
            isFullScreen: false,
            activeDrags: 0
        };

        this.subscriberEventHandlers = {
            videoEnabled: (event) => {
                console.log('SubscriberComponent video enabled');
                this.onVideoEnabled(event);
            },
            videoDisabled: (event) => {
                this.onVideoDisabled(event);
            }
        };
    }

    onSubscribe = () => {
        console.log("subscriber added");
    };

    onVideoEnabled = (event) => {
        console.log("incoming video enabled event", event);
        this.state.error !== null && this.setState({ error: null });
    };

    onVideoDisabled = (event) => {
        event.type === 'videoDisabled' && this.setState({ error: 'Incoming video has been disabled' });
    };

    onError = (err) => {
        this.setState({ error: `Failed to subscribe: ${err.message}` });
    };

    goFullScreen = (e) => {
        e.preventDefault();
        this.setState({ isFullScreen: true });
    };

    render() {
        const { stream, session, height, width } = this.props;
        const { error, publishAudio, publishVideo } = this.state;
        return (
            <li className="subscriber" data-stream-type={stream.videoType}>
                {error ?
                    <div className="video__alert video__alert--error">
                        <span className="icon icon--alert">
                            <svg width="50" height="50" viewBox="0 0 50 50"><title>Alert</title><path fill="#C52033" d="M49.682 24.235L25.768.318a1.088 1.088 0 0 0-1.536 0L.318 24.235a1.088 1.088 0 0 0 0 1.538L24.245 49.69c.421.413 1.089.413 1.51 0l23.927-23.917a1.088 1.088 0 0 0 0-1.538zM23.91 13.046a1.09 1.09 0 0 1 1.089-1.087c.598 0 1.087.487 1.085 1.087v17.395c.002.6-.487 1.087-1.085 1.087a1.09 1.09 0 0 1-1.09-1.087V13.046zm1.089 27.18a2.174 2.174 0 1 1 0-4.35 2.174 2.174 0 0 1 0 4.35z"/></svg>
                        </span>
                        {error}
                    </div>
                    : null}
                <Fullscreen
                    enabled={this.state.isFullScreen}
                    onChange={isFullScreen => this.setState({ isFullScreen })}
                >
                    <OTSubscriber
                        session={session}
                        stream={stream}
                        properties={{
                            subscribeToAudio: publishAudio,
                            subscribeToVideo: publishVideo,
                            width: width,
                            height: height,
                            style: {
                                buttonDisplayMode: 'off',
                                nameDisplayMode: 'off'
                            }
                        }}
                        style = {{
                            buttonDisplayMode: 'off'
                        }}
                        onError={this.onError}
                        onSubscribe={this.onSubscribe}
                        eventHandlers={this.subscriberEventHandlers}
                    />
                </Fullscreen>
                <button className="button-full-screen" onClick={this.goFullScreen}>
                    <svg width="20" height="20" viewBox="0 0 20 20"><title>Launch FullScreen</title><path fill="#FFF" d="M7.458 11.4a.81.81 0 1 1 1.146 1.144l-5.832 5.833h4.6a.81.81 0 1 1 0 1.621H.81a.808.808 0 0 1-.294-.057c-.009-.004-.016-.011-.025-.015a.793.793 0 0 1-.232-.154c-.005-.005-.011-.006-.016-.01-.01-.01-.013-.023-.022-.034a.78.78 0 0 1-.163-.272c-.012-.034-.033-.067-.04-.104A.854.854 0 0 1 0 19.188L0 12.626a.81.81 0 1 1 1.62 0l.001 4.612 5.837-5.839zM19.998.81L20 7.372a.81.81 0 1 1-1.62 0l-.002-4.611-5.837 5.837a.808.808 0 0 1-1.147 0 .81.81 0 0 1 0-1.146l5.832-5.832h-4.599a.81.81 0 1 1 0-1.621h6.56c.1 0 .193.023.281.056.017.006.033.016.05.023.042.02.086.034.123.06a.794.794 0 0 1 .112.096l.003.002V.24a.804.804 0 0 1 .174.26l.006.014c.036.093.062.191.062.296z"/></svg>
                </button>
            </li>
        );
    }
}
