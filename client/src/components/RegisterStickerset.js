import React, { Component } from "react";
import axios from 'axios';


export default class AddStickerSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stickerSetName: "",
      submitbtnIsDisabaled: true,
      verifybtnIsDisabled: true
    };
  }
  insertHttpsIfNeeded = (link) => {
    return !link.startsWith('http') ?
      [link.slice(0, 0), 'https://', link.slice(0)].join('') : link;
  };

  onChangestickerSetName = async (e) => {
    if (this.stickerSetName.value.length < 3) {
      this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: true });
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
        submitbtnIsDisabaled: false
      });
      //await showVerificationImage();
    }
    else {
      this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: true });
      return false;
    }

  };

  onSubmit = async (e) => {
    e.preventDefault();

    // When post request is sent to the create url, axios will add a new record(newperson) to the database.
    const newperson = {
      person_name: this.state.person_name,
      person_position: this.state.person_position,
      person_level: this.state.person_level,
    };

    axios
      .post("http://localhost:5000/record/add", newperson)
      .then((res) => console.log(res.data));

    // We will empty the state after posting the data to the database
    this.setState({
      person_name: "",
      person_position: "",
      person_level: "",
    });
  }

  submitStickerSet = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/stickersets/register',
        { stickerSetName: this.stickerSetName.value, ownerWalletAddress: this.props.wallet });
      console.log('response status:' + response.status + '\nresponse message:' + response.data);
      if (response.status == 200) {
        this.setState({ submitbtnIsDisabaled: true, verifybtnIsDisabled: false });
        const verificationImageCreated = await this.showVerificationImage(this.stickerSetName.value);
        if (verificationImageCreated) {
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
        console.log('response not 200: ' + response.status + "\ndata:" + response.data);
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
      //console.log("error-" + error);
      return false;
    }
  };

  showVerificationImage = async (name) => {
    try {
      const response = await axios.post('http://localhost:3000/api/setverification/createverificationimage',
        { stickerSetName: name, wallet: this.props.wallet });
      document.getElementById("verifimage").setAttribute(
        'src', 'data:image/png;base64,' + response.data);
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
        <form onSubmit={this.onSubmit}>
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
            <img id="verifimage" src="" />
            <div className="note">Right-click and save as to download the image.</div>
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
      </div>
    );
  }
}