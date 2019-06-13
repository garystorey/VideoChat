import React, { Component } from 'react';
import PhotoViewer from '../photoViewComponent'
import PopoutMenu from '../popoutMenuComponent'
import Loader from '../loaderComponent'
import Moment from 'react-moment'

import {querySharepoint, addFile, deleteFromSharepoint} from "../../utils/sharepointConnect";

import './storePhotos.css';

const Thumbnail = (res) => {
    const photo = res.photo;
    const regexPattern = /^(.*)\/PublishingImages\/(.*).(jpg|gif|png|bmp|JPG|GIF|PNG|BMP)$/;
    const fileName = photo.File.ServerRelativeUrl;
    const photoThumbnail = fileName.replace(regexPattern, "$1/PublishingImages/_t/$2_$3.jpg");
    const timeStamp = Math.floor(new Date(photo.Modified).getTime() / 1000);

    return(
        <div className="photo__thumbnail"
             title={photo.File.Name}
             style={{backgroundImage: `url('${photoThumbnail}?ver=${timeStamp})`}}
        >
        </div>
    )
};

export default class StorePhotosComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            fetching: false,
            photos: [],
            photoId: null,
            photoLink: null,
            photoAlt: null,
            resized: false
        };
    };

    componentDidMount() {
        this.getPhotos();
    }

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

    getPhotos = () => {
        this.setState({
            fetching: true,
            photos: []
        });

        querySharepoint(this.props.sourceUrl).then((photos) => {
            this.setState({
                fetching: false,
                photos: photos
            });
        });
    };

    openPhoto = (e, photo, edit) => {
        console.log("photo edit", photo, edit);

        e.preventDefault();
        const timeStamp = Math.floor(new Date(photo.Modified).getTime() / 1000);
        const photoURL = photo.File.ServerRelativeUrl + '?ver=' + timeStamp;

        this.props.resizeCallback(0.35);
        this.setState({
            photoLink: photoURL,
            photoAlt: photo.File.Name,
            photoId: photo.Id,
            photoHeight: photo.ImageHeight,
            photoWidth: photo.ImageWidth,
            edit: edit
        })
    };

    closePhoto = (e) => {
        e.preventDefault();
        this.props.resizeCallback(0.65);
        this.setState({
            photoLink: null,
            photoAlt: null,
            resized: false
        });
        this.getPhotos();
    };

    addNewPhoto = (e) => {
        this.setState({
            loading: true
        });

        addFile(e.target.files[0], 'PublishingImages', 'Post', this.props.roomId)
            .then(response => {
                if (response.d.ID !== null || response.d.ID !== undefined) {
                    this.getPhotos();
                    // Remove the loader if the images uploads successfully
                    this.setState({
                        loading: false
                    })
                } else {
                    console.error('ERROR', response);
                }
        });
    };

    deletePhoto = (id) => {
        deleteFromSharepoint(id, 'Images', this.props.deleteUrl)
            .then(res => {
                if (res.ok === true) {
                    this.getPhotos();
                }
            })
    };

    refreshPhotos = (e) => {
        e.preventDefault();
        this.getPhotos()
    };

    render() {
        const { fetching, loading, photos, photoLink, photoAlt, photoId, photoHeight, photoWidth, resized, edit } = this.state;
        return (
            <div className="photos">
                {photoLink &&
                    <div className="single-photo">
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
                                {photoAlt}
                            </li>
                            <li className="window-control button--close-file">
                                <button type="button" className="button--close" onClick={this.closePhoto}>
                                    CLOSE <svg className="icon icon-close" width="50" height="50" viewBox="0 0 50 50"><title>Close File</title><path d="M21.82 25L.662 3.843A2.245 2.245 0 0 1 .66.66a2.245 2.245 0 0 1 3.183.002L25 21.82 46.157.662A2.245 2.245 0 0 1 49.34.66a2.245 2.245 0 0 1-.002 3.183L28.18 25l21.158 21.157c.879.88.886 2.298.002 3.183a2.245 2.245 0 0 1-3.183-.002L25 28.18 3.843 49.338c-.88.879-2.298.886-3.183.002a2.245 2.245 0 0 1 .002-3.183L21.82 25z"/></svg>
                                </button>
                            </li>
                        </ul>
                        <PhotoViewer
                            photoLink={photoLink}
                            photoAlt={photoAlt}
                            photoId={photoId}
                            photoHeight={photoHeight}
                            photoWidth={photoWidth}
                            roomId={this.props.roomId}
                            deleteUrl={this.props.deleteUrl}
                            edit={edit}
                        />
                    </div>
                }
                {photoLink === null &&
                    <div className="wrapper--sharepoint-list">
                        <ul className="sharepoint-list__controls">
                            <li className="sharepoint-list__control refresh-photos">
                                <button type="button" className="refresh-photos__trigger" onClick={this.refreshPhotos}>
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
                                    <p>Loading store photos...</p>
                                </div>
                            }
                            {(photos.length === 0 && fetching === false) &&
                            <div className="add-photo-input--large">
                                <label>
                                    <div className="icon icon__add-photo icon-blankphotos"/>
                                    <span className="title">This store does not have any photos currently.</span>
                                    <span className="subTitle">Click here to upload a photo.</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={this.addNewPhoto}
                                    />
                                </label>
                            </div>
                            }
                            {(photos.length > 0 && fetching === false) &&
                            <ul className="photo-gallery">
                                <li className="photo add-photo-input">
                                    <label>
                                        <span className="icon">
                                            <svg width="50" height="50" viewBox="0 0 50 50"><title>Add File</title><path d="M28 23h19.5a2.5 2.5 0 1 1 0 5H28v19.5a2.5 2.5 0 1 1-5 0V28H2.5a2.5 2.5 0 1 1 0-5H23V2.5a2.5 2.5 0 1 1 5 0V23z"/></svg>
                                        </span>
                                        Add a Photo
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={this.addNewPhoto}
                                        />
                                    </label>
                                </li>
                                {loading === true &&
                                <li className="photo photo__loader">
                                    <Loader/>
                                </li>
                                }
                                {photos.map(photo =>
                                    <li
                                        key={photo.File.UniqueId}
                                        className="photo photo-gallery__thumbnail"
                                    >
                                        <button
                                            type="button"
                                            className="photo__trigger"
                                            onClick={(e) => this.openPhoto(e, photo, false)}
                                        >
                                            <Thumbnail photo={photo}/>
                                        </button>
                                        <div className="thumbnail__footer">
                                            <Moment format="MMM D, YYYY" className="timestamp">{photo.Created}</Moment>
                                            <PopoutMenu
                                                openCallback={this.openPhoto}
                                                deleteCallback={this.deletePhoto}
                                                file={photo}
                                                fileId={photo.Id}
                                                edit={true}
                                            />
                                        </div>
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
