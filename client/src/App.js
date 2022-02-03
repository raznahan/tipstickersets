import React, { Component } from 'react';
import Web3 from 'web3';
import { Route, Routes } from "react-router-dom";
import Identicon from 'identicon.js';
import './App.css';
import TipStickerSets from './build/TipStickerSets.json';
import Navbar from './components/Navbar';
import RegisterStickerSet from './components/RegisterStickerset';
//import { stickerSetSchema } from '../../server/models/stickerSet';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import StickerSetList from './components/StickerSetList';
const apiPath = 'http://localhost:3000/api';


const updateStickerSetTip = (name, tipAmount) => {
    var data = { name: name, tips: tipAmount }
    axios
        .post(apiPath + '/stickersets/updateTip', data)
        .then((response) => {
        })
        .catch(function (error) {
            console.log(error);
        })
};

class App extends Component {
    constructor(props) {
        console.log('App-Constructor');
        super(props);
        this.state = {
            account: '',
            tipstickersets: null,
            stickersets: [],
            page: 1,
            hasMore: true
        }
    }

    async componentDidMount() {
        console.log('App-ComponentDidMount');
        await this.loadWeb3();
        await this.loadBlockchianData();
        await this.fetchStickerSetList();
    }

    async loadWeb3() {
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

    loadBlockchianData = async () => {
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

    fetchStickerSetList = async (count = 10, page = 1) => {
        axios
            .get(`http://localhost:3000/api/stickersets?count=${count}&page=${page}`)
            .then((response) => {
                this.setState({ stickersets: this.state.stickersets.concat(response.data.stickersetList) });
                Number(this.state.stickersets.length) < Number(response.data.itemsCount)
                    ? this.setState({ hasMore: true }) : this.setState({ hasMore: false });
                this.setState({ page: Number(this.state.page) + 1 })
                this.fetchTipAmounts(this.state.stickersets);
            })
            .catch(function (error) {
                console.log("error-" + error);
            });

    }

    fetchTipAmounts = async (stickersets) => {
        for (let i = 0; i < stickersets.length; i++) {
            const item = stickersets[i];
            if (item.isTipped) {
                const tips = await this.getStickerSetTip(item.name);
                if (tips) {
                    item.tips = tips;
                    stickersets[i] = item;
                }
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
                <Routes>
                    <Route exact path="/" element={<StickerSetList
                        stickersets={this.state.stickersets}
                        tip={this.tip}
                        fetchStickerSetList={this.fetchStickerSetList}
                        page={this.state.page}
                        hasMore={this.state.hasMore}
                    />
                    }>
                    </Route>
                    <Route path='/register' element={<RegisterStickerSet />}>
                    </Route>
                </Routes>

            </div>
        );
    }
}

export default App;