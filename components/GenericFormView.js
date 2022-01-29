import React, {Component} from "react";
import {Form, Input, Message, Button} from 'semantic-ui-react';
import web3Instance from "../ethereum/web3";
import Campaign from '../ethereum/campaign';
import { Router } from "../routes";

class GenericFormView extends Component {

    state = {
        errorMessage: '',
        successMessage: '',
        value: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({errorMessage: '',successMessage: '', loading: true});
        try {
            const accounts = await web3Instance.eth.getAccounts();
            const campaign = Campaign(this.props.address);
            console.log(this.props.address);
            console.log(accounts);
            await campaign.methods
            .contribute()
            .send({from: accounts[0], 
                   value: web3Instance.utils.toWei(this.state.value, 'ether')
                  });
            this.setState({successMessage: `Great! You contributed ${this.state.value} to the campaign.`});
            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch(err) {
            this.setState({errorMessage: `Ooppss ${err}`});
        }
        this.setState({loading: false});
    };
    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.successMessage}>
          <Form.Field>
            <label>{this.props.formTitle}</label>
            <Input
              label={this.props.inputTypeTitle}
              labelPosition="right"
              value={this.state.value}
              onChange={(event) =>
                this.setState({ value: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Message success header="Great!" content={this.state.successMessage} />
          <Button loading={this.state.loading} primary>{this.props.buttonTitle}</Button>
        </Form>
        );
    }
}
export default GenericFormView;