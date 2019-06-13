import React, { Component } from 'react'
import Moment from 'react-moment'
import 'moment-timezone'
import PdfViewer from '../pdfViewerComponent/pdfViewerComponent'
import PopoutMenu from '../popoutMenuComponent/popoutMenuComponent'
import Loader from '../loaderComponent'
import { querySharepoint, addFile, deleteFromSharepoint } from "../../utils/sharepointConnect"

import './storeReports.css';

export default class StoreReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            fetching: false,
            reports: [],
            pdfFile: null,
            pdfDocumentName: null,
            resized: false
        };
    };

    componentDidMount() {
        this.getFiles(this.props.sourceUrl);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            reports: []
        });

        this.getFiles(newProps.sourceUrl);
    }

    getFiles = (url) => {
        this.setState({
            fetching: true
        });

        querySharepoint(url).then((reports) => {
            this.setState({
                reports: reports,
                fetching: false
            });
        });
    };

    openPDF = (pdf, title) => {
        if (this.state.resized === false) {
            this.props.resizeCallback(0.35);
        }

        this.setState({
            pdfFile: pdf,
            pdfDocumentName: title
        });
    };

    closePDF = (e) => {
        e.preventDefault();
        this.props.resizeCallback(0.65);
        this.setState({
            pdfFile: null,
            pdfDocumentName: null,
            resized: false
        })
    };

    uploadDocument = (e) => {
        this.setState({
            loading: true
        });

        addFile(e.target.files[0], 'Documents', 'Post', this.props.roomId)
            .then(response => {
                if (response.d.ID !== null || response.d.ID !== undefined) {
                    this.getFiles(this.props.sourceUrl);
                    // Remove the loader if the file uploads successfully
                    this.setState({
                        loading: false
                    });
                } else {
                    console.error('ERROR', response);
                }
            });
    };

    deleteDocument = (id) => {
        deleteFromSharepoint(id, 'Documents', this.props.deleteUrl)
            .then(res => {
                if (res.ok === true) {
                    this.getFiles(this.props.sourceUrl);
                }
            })
    };

    refreshFiles = (e) => {
        e.preventDefault();
        this.getFiles(this.props.sourceUrl);
    };

    expandParentWindow = (e)  => {
        e.preventDefault();
        this.props.resizeCallback(0);
        this.setState({
            resized: true
        })
    };

    collapseParentWindow = (e)  => {
        e.preventDefault();
        this.props.resizeCallback(0.35);
        this.setState({
            resized: false
        })
    };

    render() {
        const { fetching, loading, reports, pdfFile, pdfDocumentName, resized } = this.state;
        const { section } = this.props;
        return (
            <div className="reports">
                {pdfFile &&
                    <div className="wrapper--pdf">
                        <ul className="window-controls">
                            <li className="window-control button--open-close">
                                {resized === false ?
                                    <button type="button" className="button--expand" onClick={this.expandParentWindow}>
                                        <svg className="icon" width="50" height="50" viewBox="0 0 50 50"><title>Expand</title><path d="M32.558 23.077c1.453 0 2.702 1.014 2.702 2.375 0 1.362-1.249 2.376-2.702 2.376H7.932l7.762 7.782a2.21 2.21 0 0 1-.069 3.201 2.335 2.335 0 0 1-3.22-.066L.652 26.963a2.21 2.21 0 0 1 .012-3.147l11.752-11.611a2.335 2.335 0 0 1 3.221-.043 2.21 2.21 0 0 1 .045 3.201l-7.807 7.714h24.683zM47.564 0h.064A2.372 2.372 0 0 1 50 2.372v45.256A2.372 2.372 0 0 1 47.628 50h-.064a2.372 2.372 0 0 1-2.372-2.372V2.372A2.372 2.372 0 0 1 47.564 0z"/></svg>
                                        &nbsp;EXPAND
                                    </button>
                                :
                                    <button type="button" className="button--collapse" onClick={this.collapseParentWindow}>
                                        COLLAPSE&nbsp;
                                        <svg className="icon" width="50" height="50" viewBox="0 0 50 50"><title>Collapse</title><path d="M47.564 0h.064A2.372 2.372 0 0 1 50 2.372v45.256A2.372 2.372 0 0 1 47.628 50h-.064a2.372 2.372 0 0 1-2.372-2.372V2.372A2.372 2.372 0 0 1 47.564 0zm-27.68 15.352a2.21 2.21 0 0 1 .068-3.202 2.335 2.335 0 0 1 3.22.066l11.753 11.782a2.21 2.21 0 0 1-.012 3.147L23.16 38.757a2.335 2.335 0 0 1-3.221.043 2.21 2.21 0 0 1-.045-3.202l7.864-7.77H2.702C1.248 27.828 0 26.814 0 25.452c0-1.36 1.248-2.375 2.702-2.375h24.887l-7.706-7.725z"/></svg>
                                    </button>
                                }
                            </li>
                            <li className="window-control document-name">
                                {pdfDocumentName}
                            </li>
                            <li className="window-control button--close-file">
                                <button type="button" className="button--close" onClick={this.closePDF}>
                                    CLOSE <svg className="icon icon-close" width="50" height="50" viewBox="0 0 50 50"><title>Close File</title><path d="M21.82 25L.662 3.843A2.245 2.245 0 0 1 .66.66a2.245 2.245 0 0 1 3.183.002L25 21.82 46.157.662A2.245 2.245 0 0 1 49.34.66a2.245 2.245 0 0 1-.002 3.183L28.18 25l21.158 21.157c.879.88.886 2.298.002 3.183a2.245 2.245 0 0 1-3.183-.002L25 28.18 3.843 49.338c-.88.879-2.298.886-3.183.002a2.245 2.245 0 0 1 .002-3.183L21.82 25z"/></svg>
                                </button>
                            </li>
                        </ul>
                        <PdfViewer
                            pdfFile={pdfFile}
                        />
                    </div>
                }
                {pdfFile === null &&
                    <div className="wrapper--sharepoint-list">
                        <ul className="sharepoint-list__controls">
                            <li className="sharepoint-list__control refresh-files">
                                <button type="button" className="refresh-files__trigger" onClick={this.refreshFiles}>
                                    <span className="icon icon__refresh">
                                        <svg width="50" height="39" viewBox="0 0 50 39"><title>Refresh</title><path d="M49.506 23.862l-5.699-8.573a1.816 1.816 0 0 0-1.41-.809 1.848 1.848 0 0 0-1.508.656l-6.557 7.929a1.815 1.815 0 0 0 .245 2.555c.773.633 1.92.522 2.56-.245l3.371-4.076c-.887 6.309-5.84 11.93-12.03 13.403-5.242 1.254-10.67-.284-14.515-4.115-.689-.683-1.886-.68-2.57.004a1.813 1.813 0 0 0 .003 2.565c3.63 3.613 8.412 5.604 13.464 5.604 1.496 0 2.999-.178 4.465-.529 7.64-1.822 13.554-8.288 14.76-15.96l2.391 3.597c.537.805 1.717 1.042 2.52.508a1.8 1.8 0 0 0 .777-1.15 1.8 1.8 0 0 0-.267-1.364m-33.621-7.408a1.803 1.803 0 0 0-.653-1.227 1.801 1.801 0 0 0-1.33-.406c-.483.046-.92.278-1.23.65L8.755 20.21c-.05-2.962.742-5.884 2.317-8.517 2.306-3.851 6.043-6.635 10.255-7.639 5.582-1.336 11.422.536 15.234 4.886.658.751 1.81.828 2.565.172.366-.319.584-.761.617-1.245a1.802 1.802 0 0 0-.445-1.315C34.594 1.182 27.38-1.125 20.48.524c-5.158 1.23-9.725 4.622-12.53 9.309a19.89 19.89 0 0 0-2.708 8.015l-1.907-2.87a1.826 1.826 0 0 0-2.521-.51c-.405.268-.68.677-.777 1.152-.097.474-.002.959.267 1.362l5.7 8.576c.328.492.858.78 1.515.81.545 0 1.056-.24 1.403-.658l6.556-7.93c.309-.373.453-.845.407-1.326"/></svg>
                                    </span>
                                </button>
                            </li>
                        </ul>
                        <div className="wrapper--inner">
                            {fetching === true &&
                                <div className="placeholder--fetch">
                                    <Loader/>
                                    <p>Loading store {section}...</p>
                                </div>
                            }
                            {(reports.length === 0 && fetching === false) &&
                            <div className="placeholder">
                                {section === 'documents' &&
                                <div className="placeholder__documents add-document-input--large">
                                    <label className="upload-files__trigger--large">
                                        <div className="icon icon__add-doc icon-blankdocuments"/>
                                        <span className="title">This store has no documents.</span>
                                        <span className="subTitle">Click here to add documents.</span>
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={this.uploadDocument}
                                        />
                                    </label>
                                </div>
                                }
                                {section === 'reports' &&
                                <div className="placeholder__reports">
                                    <div className="icon icon__documents icon-blankreports"/>
                                    <span className="title">This store has no reports.</span>
                                    <span className="subTitle">Reports will be added automatically.</span>
                                </div>
                                }
                            </div>
                            }
                            {(reports.length > 0 && fetching === false) &&
                            <ul className="report-list">
                                {section === 'documents' &&
                                <li className="add-document-input">
                                    <label className="upload-files__trigger">
                                        <span className="icon icon__upload-document">
                                            <svg width="50" height="66" viewBox="0 0 50 66"><title>Upload Document</title><g><path d="M2.262 66A2.263 2.263 0 0 1 0 63.728V2.272A2.268 2.268 0 0 1 2.275 0h29.717L50 16.51v47.219A2.272 2.272 0 0 1 47.738 66H2.262zM26.88 53.136V34.303l6.924 6.737c.73.711 1.903.711 2.635-.002a1.852 1.852 0 0 0-.005-2.66l-10.118-9.845a1.893 1.893 0 0 0-2.634 0l-10.12 9.847c-.75.73-.75 1.93 0 2.66.731.711 1.904.711 2.634 0l6.924-6.737v18.833c0 1.037.85 1.864 1.88 1.864 1.03 0 1.88-.827 1.88-1.864z"/><path fill="#FFF" fillOpacity=".35" d="M32 0v13.742A2.264 2.264 0 0 0 34.261 16H50"/></g></svg>
                                        </span>
                                        Upload a Document
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={this.uploadDocument}
                                        />
                                    </label>
                                </li>
                                }
                                {loading === true &&
                                    <li className="report">
                                        <Loader/>
                                    </li>
                                }
                                {reports.map(report =>
                                    <li className="report" key={report.File.UniqueId}>
                                        <div className="file-trigger"
                                             title={report.File.Name}
                                             onClick={() => this.openPDF(report.File.ServerRelativeUrl, report.File.Name)}>
                                            <div className="icon icon__pdf">
                                                <svg viewBox="0 0 100 132.4"><path fill="#DC2E2A" d="M9.2 132C4 132 0 128 0 122.8V9.2C0 4 4 0 9.2 0H64l36 33.2v90c0 4.8-4 9.2-9.2 9.2L9.2 132z"/><path id="Overlay" fill="#010101" d="M64 0v24.4c0 5.2 4 8.8 9.2 8.8H100" opacity=".35"/><path fill="#fff" d="M29.4 88.5c1.5 0 2.9.2 4 .5 1.1.4 2.1.9 2.8 1.5.7.7 1.3 1.4 1.6 2.3.4.9.5 1.9.5 3s-.2 2.1-.6 3.1-.9 1.7-1.7 2.4c-.7.7-1.7 1.2-2.8 1.6-1.1.4-2.4.6-3.9.6h-3.2v8.1h-4.3V88.5h7.6zm0 11.6c.8 0 1.5-.1 2.1-.3.6-.2 1.1-.5 1.5-.8.4-.4.7-.8.9-1.3.2-.5.3-1.1.3-1.8 0-.6-.1-1.2-.3-1.7-.2-.5-.5-.9-.9-1.3s-.9-.6-1.5-.8c-.6-.2-1.3-.3-2.1-.3h-3.2v8.3h3.2z" /><path fill="#fff" d="M62.3 100c0 1.7-.3 3.3-.8 4.7-.6 1.4-1.4 2.6-2.4 3.7-1 1-2.3 1.8-3.7 2.4-1.4.6-3 .8-4.8.8h-8.8V88.5h8.8c1.8 0 3.4.3 4.8.9 1.4.6 2.7 1.4 3.7 2.4s1.8 2.2 2.4 3.7c.5 1.3.8 2.8.8 4.5zm-4.4 0c0-1.3-.2-2.4-.5-3.4s-.8-1.9-1.5-2.6-1.4-1.2-2.3-1.6c-.9-.4-1.9-.6-3-.6h-4.5v16.3h4.5c1.1 0 2.1-.2 3-.6.9-.4 1.7-.9 2.3-1.6s1.1-1.6 1.5-2.6c.3-.9.5-2 .5-3.3z" /><path fill="#fff" d="M70.4 91.9v6.8h8.7v3.4h-8.7v9.4h-4.3v-23h14.6v3.4H70.4z" /></svg>
                                            </div>
                                            <div className="file__details">
                                                <div className="file__details--name">{report.File.Name}</div>
                                                <div className="file__details--timestamp">
                                                    <Moment format="M/D/YYYY h:mm A">{report.Modified}</Moment>
                                                </div>
                                            </div>
                                        </div>
                                        {section === 'documents' &&
                                        <PopoutMenu
                                            openCallback={this.openPDF}
                                            deleteCallback={this.deleteDocument}
                                            file={report.File.ServerRelativeUrl}
                                            title={report.File.Name}
                                            fileId={report.Id}
                                            edit={false}
                                        />
                                        }
                                    </li>
                                )}
                            </ul>
                            }
                        </div>
                    </div>
                }
            </div>
        )
    }
}
