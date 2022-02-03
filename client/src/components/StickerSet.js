import React, { Component } from "react";
const tipAmount = '0.1';
const imgUrl = 'http://localhost:3000';

export default class StickerSet extends Component {
    constructor(props) {
        super(props);
        console.info('StickerSet-Constructor');
    }

    render() {
        console.info('StickerSet-Render-props:');
        for (const [key, value] of Object.entries(this.props)) {
            if (key != 'fetchStickerSetList' && key != 'tip')
                console.log(`${key}: ${value}`)
        }
        return (
            this.props.stickerset != null ?
                <div className="image-item stickeritem"  >
                    <div>{this.props.stickerset.name}</div>
                    <div>Tips: {this.props.stickerset.tips}</div>
                    <img className="stickeritem"
                        src={this.props.stickerset.thumbnail == 'dummy thumbnail' ?
                            "https://images.unsplash.com/photo-1640590272119-e2c936055d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDMyM3wwfDF8cmFuZG9tfHx8fHx8fHx8MTY0MzI2MTU0MA&ixlib=rb-1.2.1&q=80&w=1080"
                            : imgUrl + this.props.stickerset.thumbnail} />
                    <a
                        href="/"
                        onClick={async (event) => {
                            event.preventDefault();
                            await this.props.tip(this.props.stickerset.name, this.props.stickerset.owner.wallet, tipAmount);
                        }}
                    >
                        Tip Owner
                    </a>
                </div>
                :
                ''
        );
    }

}