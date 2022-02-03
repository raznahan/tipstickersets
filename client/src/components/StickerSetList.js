import React, { Component } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import StickerSet from '../components/StickerSet';
const tipAmount = '0.1';


// const StickerSet = (props) => (
//     <tr>
//         <td>{props.stickerset.name}</td>
//         <td>{props.stickerset.title}</td>
//         <td>{props.stickerset.owner.wallet}</td>
//         <td>{Number(props.stickerset.tips).toFixed(4)}</td>
//         <td>
//             {/* <Link to={"/edit/" + props.stickerset._id}>Edit</Link> | */}
//             <a
//                 href="/"
//                 onClick={async (event) => {
//                     event.preventDefault();
//                     await props.tip(props.stickerset.name, props.stickerset.owner.wallet, tipAmount);
//                     //await props.updateStickerSetTip(props.stickerset.name,tipAmount);
//                 }}
//             >
//                 Tip Owner
//             </a>
//         </td>
//     </tr>
// );

export default class StickerSetList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stickersets: [],
            loading: false,
            hasMore: true,
            page: 1
        };
        console.info('StickerSetList-Constructor');

    }
    async componentDidMount() {
        await this.fetchStickerSetList();
    }

    async fetchStickerSetList(count = 10, page = 1) {
        console.log('fetchStickerSetList called: page' + page);
        //this.setState({ loading: true });
        axios
            .get(`http://localhost:3000/api/stickersets?count=${count}&page=${page}`)
            .then((response) => {
                console.log('response received');
                this.setState({ stickersets: this.state.stickersets.concat(response.data.stickersetList) });
                Number(this.state.stickersets.length) < Number(response.data.itemsCount)
                    ? this.setState({ hasMore: true }) : this.setState({ hasMore: false });
                this.setState({ page: Number(this.state.page) + 1 })
                this.fetchTipAmounts(this.state.stickersets);
                this.setState({ loading: false });
            })
            .catch(function (error) {
                console.log("error-" + error);
            });

    }

    async fetchTipAmounts(stickersets) {
        console.log('reached fetchTip');
        for (let i = 0; i < stickersets.length; i++) {
            const item = stickersets[i];
            if (item.isTipped) {
                const tips = await this.props.getStickerSetTip(item.name);
                if (tips) {
                    item.tips = tips;
                    stickersets[i] = item;
                    console.log('tip set-' + item.name);
                }
                console.log('foreach-' + item.name);
            }

        }
        this.setState({ stickersets });
    };


    render() {
        console.info('StickerSetList-Render');
        for (const [key, value] of Object.entries(this.props)) {
            if (key != 'fetchStickerSetList' && key != 'tip')
                console.log(`${key}: ${value}`)
        }

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
                            dataLength={this.state.stickersets.length}
                            next={() => { this.fetchStickerSetList(5, this.state.page) }}
                            hasMore={this.state.hasMore}
                            loader={
                                <img
                                    src="https://res.cloudinary.com/chuloo/image/upload/v1550093026/scotch-logo-gif_jq4tgr.gif"
                                    alt="loading"
                                />}>
                            <div className="image-grid" style={{ marginTop: "30px" }}>
                                {
                                    this.state.stickersets.map((stickerset, index) => (
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
