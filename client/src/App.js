import React, { Component } from 'react';
import Web3 from 'web3';
import { Route, Routes } from "react-router-dom";
import Identicon from 'identicon.js';
import './App.css';
import TipStickerSets from './build/TipStickerSets.json'
import Navbar from './components/Navbar'
//import { stickerSetSchema } from '../../server/models/stickerSet';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import StickerSet from './components/StickerSet';
const apiPath = 'http://localhost:3000/api';


const updateStickerSetTip = (name, tipAmount) => {
    var data = { name: name, tips: tipAmount }
    axios
        .post(apiPath + '/stickersets/updateTip', data)
        .then((response) => {
            //this.setState({ loading: false });
        })
        .catch(function (error) {
            console.log(error);
        })
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            tipstickersets: null,
            stickersets: [],
            hasMore: true,
            page: 1,
            loading: false
        }
    }

    async componentDidMount() {

        console.log('App-ComponentDidMount');
        await this.loadWeb3();

        await this.loadBlockchianData();

        await this.fetchStickerSetList();

    }

    async loadWeb3() {
        console.log('App-loadWeb3');
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()

        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying metamask!')
        }
    }

    async loadBlockchianData() {
        console.log('App-loadBlockchianData');
        const web3 = window.web3;
        var accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = await web3.eth.net.getId()
        const networkData = TipStickerSets.networks[networkId]

        if (networkData) {
            const tipstickersets = new web3.eth.Contract(TipStickerSets.abi, networkData.address)
            this.setState({ tipstickersets })
            this.setState({ loading: false })
        }
        else {
            window.alert('TipStickerSets network not deployed to detected network.')
        }
    }

    async fetchStickerSetList(count = 10, page = 1) {
        console.log('fetchStickerSetList called: page' + page);
        this.setState({ loading: true });
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
                const tips = await this.getStickerSetTip(item.name);
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

    getStickerSetTip = async (name) => {
        console.log('name: ' + name);
        const stickerSet = await this.state.tipstickersets.methods.stickerSets(name).call();
        if (stickerSet)
            return web3.utils.fromWei(stickerSet.tips, 'Ether');
    }

    tip = async (name, owner, tipAmount) => {
        let tipAmountWei = window.web3.utils.toWei(tipAmount, 'Ether');
        this.state.tipstickersets.methods.TipStickerSetOwner(name, owner).send({ from: this.state.account, value: tipAmountWei })
            .on('transactionHash', (hash) => {
                updateStickerSetTip(name, tipAmount);
                this.setState({ loading: false });
            })
    }


    render() {
        console.log('App-render called');
        return (
            <div>
                <Navbar account={this.state.account} />
                {
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
                                    hasMore={true}
                                    loader={
                                        <img
                                            src="https://res.cloudinary.com/chuloo/image/upload/v1550093026/scotch-logo-gif_jq4tgr.gif"
                                            alt="loading"
                                        />}>
                                    <div className="image-grid" style={{ marginTop: "30px" }}>
                                        {this.state.stickersets.map((stickerset,index) => (
                                            <StickerSet stickerset={stickerset} key={index} tip={this.tip} />
                                        ))}
                                    </div>
                                </InfiniteScroll>
                            </div>
                        </div>
                    </div>


                    // <Routes>
                    //     <Route exact path="/" element={<StickerSetList tip={this.tip} stickersets={this.state.stickersets} />} />
                    // </Routes>
                }
            </div>
        );
    }
}

export default App;