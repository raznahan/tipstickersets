import React, { Component } from "react";
const tipAmount = '0.1';

export default class StickerSet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.props.stickerset != null ?
                <div className="col mb-5">
                    <div className="card h-100">
                        {/* <!-- Product image--> */}
                        <img className="card-img-top" src={this.props.stickerset.thumbnail == 'dummy thumbnail' ?
                            "https://images.unsplash.com/photo-1640590272119-e2c936055d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDMyM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzI2MTU0MA&ixlib=rb-1.2.1&q=80&w=1080"
                            : `https://ipfs.infura.io/ipfs/${this.props.stickerset.thumbnail}`} alt="..." />
                        {/* <!-- Product details--> */}
                        <div className="card-body p-4">
                            <div className="text-center">
                                {/* <!-- Product name--> */}
                                <h5 className="fw-bolder">{this.props.stickerset.title}</h5>
                                {/* <!-- Product price--> */}
                                Tips: {this.props.stickerset.tips}
                            </div>
                        </div>
                        {/* <!-- Product actions--> */}
                        <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                            <div className="text-center">
                                <a className="btn btn-outline-dark mt-auto" href="#"
                                    onClick={async (event) => {
                                        event.preventDefault();
                                        await this.props.tip(this.props.stickerset.name, this.props.stickerset.owner.wallet, tipAmount);
                                    }}>Tip Owner</a>
                            </div>
                        </div>
                    </div>
                </div>
                // <div className="image-item stickeritem"  >
                //     <div>{this.props.stickerset.name}</div>
                //     <div>Tips: {this.props.stickerset.tips}</div>
                //     <img className="stickeritem"
                //         src={this.props.stickerset.thumbnail == 'dummy thumbnail' ?
                //             "https://images.unsplash.com/photo-1640590272119-e2c936055d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDMyM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzI2MTU0MA&ixlib=rb-1.2.1&q=80&w=1080"
                //             : `https://ipfs.infura.io/ipfs/${this.props.stickerset.thumbnail}`} />
                //     <a
                //         href="/"
                //         onClick={async (event) => {
                //             event.preventDefault();
                //             await this.props.tip(this.props.stickerset.name, this.props.stickerset.owner.wallet, tipAmount);
                //         }}
                //     >
                //         Tip Owner
                //     </a>
                // </div>
                :
                ''
        );
    }

}