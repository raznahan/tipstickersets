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
      verificationImageText:""
    };
  }
  resetToDefault = () => {
    this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: true, verificationImage: "",verificationImageText:"" });
  };
  onChangestickerSetName = async (e) => {

    if (this.stickerSetName.value.length < 3) {
      this.resetToDefault();
      return false;
    }

    if (!this.props.wallet) {
      this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: true });
      return false// wallet not connected;
    }
    const stickerSetNameIsValid = await this.validateStickerSetName(this.stickerSetName.value);
    if (stickerSetNameIsValid) {
      this.setState({
        stickerSetName: this.stickerSetName.value,
        submitbtnIsDisabaled: false,
        verifybtnIsDisabled: true,
        verificationImage: "",
        verificationImageText:""
      });
    }
    else {
      this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: true, verificationImage: "",verificationImageText:""});
      return false;
    }

  };

  verifyOwnership = async (e) => {
    e.preventDefault();

    try {
      const ownershipResult = await axios.post("http://localhost:3000/api/setverification/verifyownership",
        { stickerSetName: this.stickerSetName.value, wallet: this.props.wallet });

      if (ownershipResult) {
        this.setState({
          submitbtnIsDisabaled: true,
          verifybtnIsDisabled: true,
          resultMessage: "Sticker set is successfully registered. You can try registering another sticker set.",
          verificationImage:"",
          verificationImageText:""
        });
        this.stickerSetName.value = '';
      }
    }
    catch (err) {
      this.setState({
        submitbtnIsDisabaled: true,
        verifybtnIsDisabled: false,
        resultMessage: "Ownership verification failed. Try again."
      });
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
          console.log('image created');
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
        this.setState({ submitbtnIsDisabaled: false, verifybtnIsDisabled: true });
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
      this.setState({ verificationImage: 'data:image/png;base64,' + response.data,
      verificationImageText:"Right-click and save as to download the image." });

      return true;
    }
    catch (error) {
      console.log("error in showVerificationImage:" + error);
      return false;
    }
  };

  render() {
    return (
      <div style={{ marginTop: 20 }}>
        <h3>Register your sticker set</h3>
        <form onSubmit={this.verifyOwnership}>
          <div className="form-group">
            <label>StickerSet Name: </label>
            <input
              id="stickerSetName"
              type="text"
              className="form-control"
              ref={(input) => { this.stickerSetName = input }}
              onChange={this.onChangestickerSetName}
            />
          </div>
          <div id="stego" className="half">
            <h2>Verification Image:</h2>
            <img id="verifimage" src={this.state.verificationImage} />
            <div className="note">{this.state.verificationImageText}</div>
          </div>
          <div className="form-group">
            <input
              id="submitbtn"
              disabled={this.state.submitbtnIsDisabaled}
              type="button"
              value="Submit StickerSet"
              onClick={this.submitStickerSet}
              className="btn btn-primary"
            />
          </div>
          <div className="form-group">
            <input
              id="verifybtn"
              disabled={this.state.verifybtnIsDisabled}
              type="submit"
              value="Verify Ownership"
              className="btn btn-primary"
            />
          </div>
        </form>
        <p id="messageBox" className="note">{this.state.resultMessage}</p>
      </div>
    );
  }
}