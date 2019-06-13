import React, {Component} from 'react';
import { OTPublisher } from 'opentok-react';

import './publisher.css';

export default class PublisherComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            videoSource: this.props.videoSource,
            defaultUI: true
        };

        this.publisherEventHandlers = {
            accessDenied: () => {
                console.log('User denied access to media source');
            },
            streamCreated: () => {
                console.log('PublisherComponent stream created');
            },
            streamDestroyed: ({ reason }) => {
                console.log(`Publisher stream destroyed because: ${reason}`);
                if (this.state.videoSource === 'screen') {
                    this.props.screenShareCallback();
                }
            }
        };
    }

    onPublish = () => {
        console.log('Publish Success');
    };

    onError = (err) => {
        this.setState({ error: `Failed to publish: ${err.message}` });
    };

    render() {
        const { session, publishAudio, publishVideo, height, width } = this.props;
        const { error, videoSource, defaultUI } = this.state;
        return (
            <div className={"publisher publisher__" + videoSource}>
                {error ? <div>{error}</div> : null}
                <OTPublisher
                    session={session}
                    properties={{
                        insertDefaultUI: defaultUI ? defaultUI : true,
                        publishAudio: publishAudio,
                        publishVideo: publishVideo,
                        videoSource: videoSource === 'screen' ? 'screen' : undefined,
                        width: width,
                        height: height,
                        name: 'Outgoing',
                        style: {
                            buttonDisplayMode: 'off',
                            nameDisplayMode: 'on'
                        }
                    }}
                    onPublish={this.onPublish}
                    onError={this.onError}
                    eventHandlers={this.publisherEventHandlers}
                />
            </div>
        );
    }
}
