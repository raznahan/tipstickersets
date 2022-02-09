import React, { Component } from "react";
import axios from 'axios';


export default class AddStickerSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stickerSetLink: "",
    };
  }
  onChangestickerSetName = async (e) => {
    if (e.target.value.length < 7)
      return false;

    let url;
    try {
      url = new URL(string);
    } catch (e) {
      return false;
    }
    if (!props.wallet)
      return false// wallet not connected;

    if (await registerStickerSet(e.target.value,props.wallet)) {
      this.setState({
        stickerSetLink: e.target.value,
      });
      await showVerificationImage();
    }
    else
      return false;

  }

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

  registerStickerSet = async (link,wallet) => {
    axios
      .post('http://localhost:3000/api/stickersets/register', {ownerWalletAddress:wallet,stickerSetLink:link})
      .then((response) => {
        if (response.status == 200)
          return true;
        else return false;
      })
      .catch(function (error) {
        console.log("error-" + error);
        return false;
      });

  };

  showVerificationImage = async (link) => {
    axios
      .post('http://localhost:3000/api/setvification/createverificationimage', link)
      .then((response) => {
        const encodedImage = response.data;
        const verificationImage = document.getElementById("verimage");
        verificationImage.src = encodedImage;
      })
      .catch(function (error) {
        console.log("error-" + error);
        return false;
      });

  };

  render() {
    return (
      <div style={{ marginTop: 20 }}>
        <h3>Register your sticker set</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>StickerSet Link: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.stickerSetName}
              onChange={this.onChangestickerSetName}
            />
          </div>
          <div id="stego" class="half">
            <h2>Verification Image:</h2>
            <img id="verimage" src="" />
            <div class="note">Right-click and save as to download the image.</div>
          </div>
          <div className="form-group">
            <input
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