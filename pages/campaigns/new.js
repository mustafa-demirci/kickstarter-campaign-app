import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import {Router} from '../../routes';

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    successMessage: "",
    loading: false
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: true,errorMessage: ''});
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });
      this.setState({ successMessage: 'Campaign created successfully :)'});
      Router.pushRoute('/')
    } catch (err) {
      this.setState({ successMessage: '', errorMessage: err.message});
    }
    this.setState({loading: false});
  };

  render() {
    return (
      <Layout>
        <h3>Create Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.successMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Message success header="Great!" content={this.state.successMessage} />
          <Button loading={this.state.loading} primary>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
