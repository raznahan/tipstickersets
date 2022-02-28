import React, { Component } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import StickerSet from '../components/StickerSet';

export default class StickerSetList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stickersets: []
        };
    }

    render() {
        return (
            <section className="py-5">
                <div className="container px-4 px-lg-5 mt-5">
                    <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-1 justify-content-center">
                        <InfiniteScroll
                            dataLength={this.props.stickersets.length}
                            next={() => { this.props.fetchStickerSetList(10, this.props.page) }}
                            hasMore={this.props.hasMore}
                            className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center"
                            loader={
                                <img
                                    src="https://res.cloudinary.com/chuloo/image/upload/v1550093026/scotch-logo-gif_jq4tgr.gif"
                                    alt="loading"
                                />}>
                            {/* <div className="image-grid" style={{ marginTop: "30px" }}> */}
                            {
                                this.props.stickersets.map((stickerset, index) => (
                                    <StickerSet stickerset={stickerset} key={index} tip={this.props.tip} />
                                ))
                            }

                            {/* </div> */}
                        </InfiniteScroll>
                    </div>
                </div>
            </section>

            /* <div className="hero is-fullheight is-bold is-info">
                <div className="hero-body">
                    <div className="container">
                        <div className="header content">
                            <h2 className="subtitle is-6">List of availabe sticker sets</h2>
                            <h1 className="title is-1">
                                Tip whichever you want!
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
            </div> */

        );
    }
}
