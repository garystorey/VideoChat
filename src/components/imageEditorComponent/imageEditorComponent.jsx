import React, { Component } from 'react'
import Modal from '../confirmationModalComponent'
import Loader from '../loaderComponent'
import AvatarEditor from 'react-avatar-editor'

import { addFile } from "../../utils/sharepointConnect";

import './imageEditor.css';

export default class ImageEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            angle: 0,
            source: this.props.src,
            fileName: this.props.fileName,
            height: this.props.height,
            width: this.props.width,
            isChanged: "no-change",
            isConfirmationOpen: false,
            loading: false
        }
    };

    doSaveChanges = (e) => {
        e.preventDefault();
        if (this.editor) {
            const canvasScaled = this.editor.getImageScaledToCanvas().toDataURL();
            fetch(canvasScaled)
                .then(res => res.blob())
                .then(blob => {
                    const formData = new FormData();
                    formData.append("file", blob, this.state.fileName);

                    for(const entry of formData.entries()) {
                        this.saveUpdatedFile(entry[1]);
                    }
                });
        }
    };

    saveUpdatedFile = (file) => {
        this.setState({
            loading: true
        });

        addFile(file, 'PublishingImages', 'Post', this.props.roomId)
            .then(response => {
                if (response.d.ID !== null || response.d.ID !== undefined) {
                    console.log("Success", response);
                    this.setState({
                        isConfirmationOpen: !this.state.isConfirmationOpen,
                        loading: false,
                        isChanged: "no-change"
                    });
                } else {
                    console.error('ERROR', response);
                }
            });
    };

    rotateLeft = (e)  => {
        e.preventDefault();
        let newAngle = this.state.angle - 90;
        this.setState({
            angle: newAngle,
            isChanged: "changed"
        })
    };

    rotateRight = (e)  => {
        e.preventDefault();
        let newAngle = this.state.angle + 90;
        this.setState({
            angle: newAngle,
            isChanged: "changed"
        })
    };

    toggleConfirmationModal = (e) => {
        e.preventDefault();
        this.setState({
            isConfirmationOpen: !this.state.isConfirmationOpen
        });
    };

    setEditorRef = (editor) => this.editor = editor;

    render() {
        const { angle, source, height, width, loading, isChanged, isConfirmationOpen } = this.state;
        return (
            <div className="image-editor">
                <div className="image-editor__tools">
                    <ul className="editor-toolbar">
                        <li className="editor__rotate--left">
                            <button onClick={this.rotateLeft} aria-label="Rotate Left">
                                <svg width="50" height="41" viewBox="0 0 50 41"><title>Rotate Image Left</title><path d="M28.533 13h14.934A6.533 6.533 0 0 1 50 19.533v14.934A6.533 6.533 0 0 1 43.467 41H28.533A6.533 6.533 0 0 1 22 34.467V19.533A6.533 6.533 0 0 1 28.533 13zm.194 4A2.727 2.727 0 0 0 26 19.727v14.546A2.727 2.727 0 0 0 28.727 37h14.546A2.727 2.727 0 0 0 46 34.273V19.727A2.727 2.727 0 0 0 43.273 17H28.727zm-14.166.502a2.231 2.231 0 0 1 3.172.223 2.294 2.294 0 0 1-.22 3.21l-7.398 6.51c-.03.027-.067.033-.098.057a2.192 2.192 0 0 1-.44.253c-.121.058-.237.119-.364.153-.048.013-.086.047-.136.058-.106.02-.205-.008-.309-.002-.096.006-.19.042-.285.035-.049-.003-.092-.031-.14-.037a2.157 2.157 0 0 1-.43-.117 2.115 2.115 0 0 1-.38-.162 2.309 2.309 0 0 1-.366-.285c-.072-.065-.16-.1-.224-.175l-6.39-7.435a2.294 2.294 0 0 1 .22-3.21 2.23 2.23 0 0 1 3.171.224L6.2 19.425c.544-4.745 2.605-9.355 6.198-12.99A21.516 21.516 0 0 1 27.753 0C28.995 0 30 1.019 30 2.276c0 1.256-1.005 2.274-2.247 2.274a17.047 17.047 0 0 0-12.176 5.103c-3.114 3.15-4.713 7.192-4.95 11.311l3.934-3.46z"/></svg>
                            </button>
                        </li>
                        <li className="editor__rotate--right">
                            <button onClick={this.rotateRight} aria-label="Rotate Right">
                                <svg width="50" height="41" viewBox="0 0 50 41"><title>Rotate Image Right</title><path d="M21.467 13H6.533A6.533 6.533 0 0 0 0 19.533v14.934A6.533 6.533 0 0 0 6.533 41h14.934A6.533 6.533 0 0 0 28 34.467V19.533A6.533 6.533 0 0 0 21.467 13zm-.194 4A2.727 2.727 0 0 1 24 19.727v14.546A2.727 2.727 0 0 1 21.273 37H6.727A2.727 2.727 0 0 1 4 34.273V19.727A2.727 2.727 0 0 1 6.727 17h14.546zm14.166.502a2.231 2.231 0 0 0-3.172.223 2.294 2.294 0 0 0 .22 3.21l7.398 6.51c.03.027.067.033.098.057.133.106.283.179.44.253.121.058.237.119.364.153.048.013.086.047.136.058.106.02.205-.008.309-.002.096.006.19.042.285.035.049-.003.092-.031.14-.037.151-.021.289-.067.43-.117.131-.046.257-.09.38-.162.135-.08.249-.18.366-.285.072-.065.16-.1.224-.175l6.39-7.435a2.294 2.294 0 0 0-.22-3.21 2.23 2.23 0 0 0-3.171.224L43.8 19.425c-.544-4.745-2.605-9.355-6.198-12.99A21.516 21.516 0 0 0 22.247 0C21.005 0 20 1.019 20 2.276c0 1.256 1.005 2.274 2.247 2.274a17.047 17.047 0 0 1 12.176 5.103c3.114 3.15 4.713 7.192 4.95 11.311l-3.934-3.46z"/></svg>
                            </button>
                        </li>
                        <li className="divider"></li>
                        <li className={"editor__save " + isChanged}>
                            <button onClick={this.doSaveChanges} aria-label="Save Changes">
                                <svg width="50" height="50" viewBox="0 0 50 50"><title>Save Changes</title><path d="M48.851 5.385A3.897 3.897 0 0 1 50 8.159v37.924A3.921 3.921 0 0 1 46.083 50H3.916A3.921 3.921 0 0 1 0 46.083V3.916A3.92 3.92 0 0 1 3.916 0h37.926c1.048 0 2.031.408 2.772 1.149l4.237 4.236zm-4.268 40.693h1.5l-.005-37.919-4.236-4.238h-3.607v10.79a3.92 3.92 0 0 1-3.917 3.916H13.721a3.921 3.921 0 0 1-3.917-3.916V3.921H3.915l.006 42.162h3.922v-.001h36.74v-.004zM34.313 3.921H20.582l.006 10.789 13.73-.004-.005-10.785zm-17.647 0h-2.947l.007 10.79h2.94V3.921zm13.77 8.695a1.923 1.923 0 0 1-1.924-1.922v-2.89a1.922 1.922 0 0 1 3.846 0v2.89c0 1.06-.86 1.922-1.922 1.922z"/></svg>
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="wrapper--inner editor">
                    <Modal
                        show={isConfirmationOpen}
                        hasOptions={false}
                        doCancel={this.toggleConfirmationModal}
                        doConfirm={null}
                    >
                        <h2 className="title--call-ended">
                            File Saved
                        </h2>
                        <p>Changes have been saved.</p>
                    </Modal>
                    {loading === true &&
                        <Loader/>
                    }
                    {loading === false &&
                        <AvatarEditor
                            ref={this.setEditorRef}
                            image={source}
                            height={height}
                            width={width}
                            border={0}
                            scale={1}
                            rotate={angle}
                            style={{
                                maxWidth: width,
                                width: "100%",
                                height: "auto"
                            }}
                        />
                    }
                </div>
            </div>
        )
    }
}
