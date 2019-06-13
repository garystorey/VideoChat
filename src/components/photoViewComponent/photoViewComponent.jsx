import React, { Component } from 'react';
import ImageEditor from '../imageEditorComponent';

import './photoViewer.css'

export default class PdfViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    };

    render() {
        const { edit, photoLink, photoAlt, photoId, photoHeight, photoWidth, roomId, deleteUrl } = this.props;

        return (
            <div className="photo--full" title={photoAlt}>
                {edit === true &&
                    <ImageEditor
                        src={photoLink}
                        fileName={photoAlt}
                        photoId={photoId}
                        height={photoHeight}
                        width={photoWidth}
                        roomId={roomId}
                        deleteUrl={deleteUrl}
                    />
                }
                {edit === false &&
                    <div className="wrapper--inner no-editor">
                        <img src={photoLink} title={photoAlt} alt={photoAlt} />
                    </div>
                }
            </div>
        )
    }
}
