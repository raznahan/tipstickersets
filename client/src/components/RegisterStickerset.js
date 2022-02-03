import React, { Component } from "react";
import axios from 'axios';


export default class AddStickerSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stickerSetName: "",
    };
  }
  onChangestickerSetName = async (e) => {
    await checkStickerSetValidity(e.target.value);
    this.setState({
      stickerSetName: e.target.value,
    });
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

  checkStickerSetValidity = async (name) => {
    axios
      .get(`http://localhost:3000/api/stickersets/register?count=${count}&page=${page}`)
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