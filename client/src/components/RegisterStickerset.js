import React, { Component } from "react";
import axios from 'axios';


export default class AddStickerSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stickerSetName: "",
      submitbtnIsDisabaled: true,
      verifybtnIsDisabled: true,
      resultMessage: "",
      verificationImage: "",
      verificationImageText: "",
      loadingGifInput: "",
      loadingGifVerify: ""
    };
  }
  resetToDefault = () => {
    this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: true, verificationImage: "", verificationImageText: "" });
  };
  applyLoaderInput = () => {
    this.setState({ loadingGifInput: "loading" });
  }
  removeLoaderInput = () => {
    this.setState({ loadingGifInput: "" });
  }
  applyLoaderVerify = () => {
    this.setState({ loadingGifVerify: "loading" });
  }
  removeLoaderVerify = () => {
    this.setState({ loadingGifVerify: "" });
  }
  onChangestickerSetName = async (e) => {
    if (this.stickerSetName.value.length < 3) {
      this.resetToDefault();
      return false;
    }
    this.applyLoaderInput();

    if (!this.props.wallet) {
      this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: true });
      this.removeLoaderInput();
      return false// wallet not connected;
    }
    const stickerSetNameIsValid = await this.validateStickerSetName(this.stickerSetName.value);
    if (stickerSetNameIsValid) {
      this.setState({
        stickerSetName: this.stickerSetName.value,
        submitbtnIsDisabaled: false,
        verifybtnIsDisabled: true,
        verificationImage: "",
        verificationImageText: "",
        resultMessage: ""
      });
      this.removeLoaderInput();
    }
    else {
      this.removeLoaderInput();
      this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: true, verificationImage: "", verificationImageText: "" });
      return false;
    }

  };

  verifyOwnership = async (e) => {
    e.preventDefault();

    this.applyLoaderVerify();

    try {
      const ownershipResult = await axios.post("http://localhost:3000/api/setverification/verifyownership",
        { stickerSetName: this.stickerSetName.value, wallet: this.props.wallet });

      if (ownershipResult) {
        this.setState({
          submitbtnIsDisabaled: true,
          verifybtnIsDisabled: true,
          resultMessage: "Sticker set is successfully registered. Now people can find and tip your sticker set! You can try registering another sticker set.",
          verificationImage: "",
          verificationImageText: ""
        });
        this.stickerSetName.value = '';
        this.removeLoaderVerify();
      }
    }
    catch (err) {
      this.setState({
        submitbtnIsDisabaled: true,
        verifybtnIsDisabled: false,
        resultMessage: "Ownership verification failed. Try again."
      });
      this.removeLoaderVerify();
    }

  }
  submitStickerSet = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/stickersets/register',
        { stickerSetName: this.stickerSetName.value, ownerWalletAddress: this.props.wallet });
      if (response.status == 200) {
        this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: false });
        const verificationImageCreated = await this.showVerificationImage(this.stickerSetName.value);
        if (verificationImageCreated) {
          this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: false });
          return true;
        }
        else {
          this.setState({ submitbtnIsDisabaled: false, verifybtnIsDisabled: true });
          return false;
        }
      }
      else if (response.status == 400 && response.data == "Already exists") {
        console.log('Already exists');
      }
      else {
        this.setState({ submitbtnIsDisabaled: false, verifybtnIsDisabled: true });
        return false;
      }
    }
    catch (err) {
      if (err.response.status == 400 && err.response.data == "stickerset already exists") {
        console.log('StickerSet already exists');
        //Show error message to user
        this.setState({ submitbtnIsDisabaled: false, verifybtnIsDisabled: true, resultMessage: "Sticker set already exists" });
        return false;
      }
      console.log('error in sending request to /register:' + err);
      this.setState({ submitbtnIsDisabaled: false, verifybtnIsDisabled: true });
      return false;
    }

  }
  validateStickerSetName = async (name) => {
    try {
      const response = await axios.post('http://localhost:3000/api/setverification/validatesetname', { stickerSetName: name });
      if (response.status == 200) {
        return "true";
      }
      else return false;
    }
    catch (error) {
      return false;
    }
  };

  showVerificationImage = async (name) => {
    try {
      const response = await axios.post('http://localhost:3000/api/setverification/showverificationimage',
        { stickerSetName: name, wallet: this.props.wallet });
      this.setState({
        verificationImage: 'data:image/png;base64,' + response.data,
        verificationImageText: "Now, in order to verify your ownership over this sticker set," +
          "you need to add the image above to your sticker set.\nThis should be the last sticker showing up in the set." +
          " Also, the image dimension is 512x300, which is a valid dimension for Telegram stickers.\nAfter you're done " +
          "with adding the image above as a sticker, click 'Verify Ownership' button."
      });

      return true;
    }
    catch (error) {
      console.log("error in showVerificationImage:" + error);
      return false;
    }
  };

  render() {
    return (
      <div className="RegisterSticker-Header">
        <h3>Register your sticker set</h3>
        <form onSubmit={this.verifyOwnership}>
          <div className="form-group">
            <label>StickerSet Name: </label>
            <input
              id="stickerSetName"
              type="text"
              placeholder="Enter sticker set name"
              className={"form-control " + this.state.loadingGifInput}
              ref={(input) => { this.stickerSetName = input }}
              onChange={this.onChangestickerSetName}
            />
          </div>
          <div id="stego" className="half">
            <img id="verifimage" className="verification-image" src={this.state.verificationImage} />
            <div className="note verification-image">{this.state.verificationImageText}</div>
          </div>
          <div className="row verification-image">
            <div className="form-group col-md-4">
              <input
                id="submitbtn"
                disabled={this.state.submitbtnIsDisabaled}
                type="button"
                value="Submit StickerSet"
                onClick={this.submitStickerSet}
                className="btn btn-primary"
              />
            </div>
            <div className="form-group col-md-8">
              <input
                id="verifybtn"
                disabled={this.state.verifybtnIsDisabled}
                type="submit"
                value="Verify Ownership"
                className={"btn btn-primary " + this.state.loadingGifVerify}
              />
            </div>
          </div>
        </form>
        <p id="messageBox" className="note">{this.state.resultMessage}</p>
      </div>
    );
  }
}