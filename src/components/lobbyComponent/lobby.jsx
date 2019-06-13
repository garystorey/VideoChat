import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { queryRooms } from "../../utils/sharepointConnect";
import { getGreetingTime } from "../../utils/getGreetingTime";

import './lobby.css';

export default class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.userId,
            userName: props.userName,
            rooms: [],
            showExpandedInfo: false,
            redirect: false
        };
    }

    componentDidMount() {
        queryRooms().then((rooms) => {
            this.setState({
                rooms: rooms,
                showExpandedInfo: rooms.map((element) => false)
            });

            if (rooms.length === 1) {
                this.props.history.push({
                    pathname: 'store' + rooms[0].ServerRelativeUrl + '/reports',
                    state: {
                        roomName: rooms[0].Name1,
                        redirect: true
                    }
                });
            }
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            userId: newProps.userId,
            userName: newProps.userName
        });
    }

    toggleExpandedInfo = (index) => {
        const expandedState = [...this.state.showExpandedInfo];
        expandedState[index] = !this.state.showExpandedInfo[index];

        this.setState({
            showExpandedInfo: expandedState
        });
    };

    render() {
        const { rooms, userName, showExpandedInfo } = this.state;
        return (
            <div className="lobby">
                <div className="wrapper--inner">
                    <h1 className="greeting">Good {getGreetingTime(moment())}, {userName}</h1>
                    <ul className="lobby__room-list">
                        {rooms.length > 0 && rooms.map((room, index) =>
                            <li className="lobby__room" key={index}>
                                <div className="room-info__trigger" onClick={() => this.toggleExpandedInfo(index)}>
                                    {showExpandedInfo[index] === false &&
                                        <svg className="icon icon__more-info" width="50" height="50" viewBox="0 0 50 50"><title>More info</title><path d="M25 0C11.213 0 0 11.213 0 25s11.213 25 25 25c13.785 0 25-11.213 25-25S38.785 0 25 0zm-1.087 8.696a2.175 2.175 0 1 1-.002 4.346 2.175 2.175 0 0 1 .002-4.346zm7.609 30.434H18.478a1.087 1.087 0 0 1 0-2.173h5.433V19.565h-3.259a1.087 1.087 0 0 1 0-2.174H25c.598 0 1.087.487 1.085 1.087v18.479h5.437c.598 0 1.087.486 1.087 1.086 0 .6-.49 1.087-1.087 1.087z" /></svg>
                                    }
                                    {showExpandedInfo[index] === true &&
                                        <svg className="icon icon__more-info close" width="50" height="50" viewBox="0 0 50 50"><title>Close Info</title><path d="M21.82 25L.662 3.843A2.245 2.245 0 0 1 .66.66a2.245 2.245 0 0 1 3.183.002L25 21.82 46.157.662A2.245 2.245 0 0 1 49.34.66a2.245 2.245 0 0 1-.002 3.183L28.18 25l21.158 21.157c.879.88.886 2.298.002 3.183a2.245 2.245 0 0 1-3.183-.002L25 28.18 3.843 49.338c-.88.879-2.298.886-3.183.002a2.245 2.245 0 0 1 .002-3.183L21.82 25z" /></svg>
                                    }
                                </div>
                                <Link
                                    to={{
                                        pathname: 'store' + room.ServerRelativeUrl + '/reports',
                                        state: {
                                            roomName: room.Name1,
                                            redirect: false
                                        }
                                    }}
                                    className="lobby__room-link"
                                >
                                    <p>Store {room.storeId}</p>
                                    <h2 className="room-name">{room.Name1}</h2>
                                    {showExpandedInfo[index] === false &&
                                        <div className="room-info--default">
                                            <div className="manager">
                                                <p>{room.Manager1Position}</p>
                                                <h3 className="manager-name">{room.Manager1Name}</h3>
                                            </div>
                                        </div>
                                    }
                                    {showExpandedInfo[index] === true &&
                                        <div className="room-info--expanded store-details">
                                            <div className="store-details__location">
                                                <h3>Location:</h3>
                                                <div className="store-address">
                                                    <p className="store-address__street">{room.address1}</p>
                                                    <p className="store-address__street">{room.address2}</p>
                                                    <p className="store-address__city-state-zip">{room.city}, {room.state} {room.zip}</p>
                                                </div>
                                            </div>
                                            <div className="store-details__hours">
                                                <h3>Hours:</h3>
                                                <ul className="store-hours">
                                                    <li><span className="day">Mon - Sat:</span>  <span className="time">{room.MondayHours}</span></li>
                                                    <li><span className="day">Sun:</span>  <span className="time">{room.SundayHours}</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    }
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}


