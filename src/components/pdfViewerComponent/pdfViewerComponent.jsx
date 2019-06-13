import React, { Component } from 'react';

import './pdfViewer.css'

export default class PdfViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        const { pdfFile } = this.props;
        return (
            <div className="react-pdf__Wrapper">
                <object data={pdfFile} type="application/pdf" width="100%" height="94%">
                    <p>
                        This browser does not support PDFs.
                        Please download the PDF to view it: <a href={pdfFile}>Download PDF</a>.
                    </p>
                </object>
            </div>
        )
    }
}

