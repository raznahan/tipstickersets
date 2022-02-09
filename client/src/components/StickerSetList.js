import React, { Component } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import StickerSet from '../components/StickerSet';
const tipAmount = '0.1';

export default class StickerSetList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stickersets: []
        };
    }

    render() {
        return (
            <div className="hero is-fullheight is-bold is-info">
                <div className="hero-body">
                    <div className="container">
                        <div className="header content">
                            <h2 className="subtitle is-6">Code Challenge #16</h2>
                            <h1 className="title is-1">
                                Infinite Scroll Unsplash Code Challenge
                            </h1>
                        </div>
                        <InfiniteScroll
                            dataLength={this.props.stickersets.length}
                            next={() => { this.props.fetchStickerSetList(5, this.props.page) }}
                            hasMore={this.props.hasMore}
                            loader={
                                <img
                                    src="https://res.cloudinary.com/chuloo/image/upload/v1550093026/scotch-logo-gif_jq4tgr.gif"
                                    alt="loading"
                                />}>
                            <div className="image-grid" style={{ marginTop: "30px" }}>
                                {
                                    this.props.stickersets.map((stickerset, index) => (
                                        <StickerSet stickerset={stickerset} key={index} tip={this.props.tip} />
                                    ))
                                }

                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        );
    }
}
