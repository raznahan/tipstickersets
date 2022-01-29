import React, { Component } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
const tipAmount = '0.1';


const StickerSet = (props) => (
    <tr>
        <td>{props.stickerset.name}</td>
        <td>{props.stickerset.title}</td>
        <td>{props.stickerset.owner.wallet}</td>
        <td>{Number(props.stickerset.tips).toFixed(4)}</td>
        <td>
            {/* <Link to={"/edit/" + props.stickerset._id}>Edit</Link> | */}
            <a
                href="/"
                onClick={async (event) => {
                    event.preventDefault();
                    await props.tip(props.stickerset.name, props.stickerset.owner.wallet, tipAmount);
                    //await props.updateStickerSetTip(props.stickerset.name,tipAmount);
                }}
            >
                Tip Owner
            </a>
        </td>
    </tr>
);


export default class StickerSetList extends Component {
    constructor(props) {
        super(props);
        this.state = { stickersets: [], loading: false };
    }

    componentDidMount() {
        console.log('StickerSetList-ComponentDidMount');
    }


    deleteRecord(name) {
        this.setState({ loading: true });
        axios.delete("http://localhost:3000/" + id).then((response) => {
            console.log(response.data);
        });

        this.setState({
            record: this.state.stickersets.filter((el) => el._id !== id),
        });
    }

    stickerSetList() {
        console.log('stickerSetList Called: ' + this.props.stickersets);
        //return <div>Hi</div>
        return this.props.stickersets.map((stickerset) => {
            return (
                <StickerSet
                    stickerset={stickerset}
                    tip={this.props.tip}
                    //updateStickerSetTip={this.props.updateStickerSetTip}
                    key={stickerset._id}
                />
            );
        });
    }

    render() {
        console.log('StickerSetList-render called');
        return (
            <div>
                <h3>Stickersets</h3>
                {
                    this.state.loading
                        ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
                        :
                        <table className="table table-striped" style={{ marginTop: 20 }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Title</th>
                                    <th>Owner</th>
                                    <th>Tips(ETH)</th>
                                </tr>
                            </thead>
                            <tbody>{this.stickerSetList()}</tbody>
                        </table>
                }

            </div>
        );
    }
}
