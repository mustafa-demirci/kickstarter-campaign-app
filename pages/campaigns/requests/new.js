import React, {Component} from "react";
import Layout from "../../../components/Layout";
import {Form, Button, Message, Input, FormField} from 'semantic-ui-react';
import web3Instance from "../../../ethereum/web3";
import Campaign from "../../../ethereum/campaign";
import {Router, Link} from '../../../routes';
class RequestNew extends Component {
    static async getInitialProps(props) {
        const {address} = props.query;
        return {address};
    }
    state = {
        description: '',
        amount: '',
        recipientAddress: '',
        loading: false,
        errorMessage: '',
        successMessage: ''
    }
    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} success={!!this.state.successMessage}>
                    <FormField>
                        <label>Description</label>
                        <Input value={this.state.description} 
                               onChange={(event) => this.setState({description: event.target.value})}>
                        </Input>
                    </FormField>
                    <FormField>
                        <label>Amount</label>
                        <Input value={this.state.amount} 
                               onChange={(event) => this.setState({amount: event.target.value})} 
                               label='ether' 
                               labelPosition="right">
                        </Input>
                    </FormField>
                    <FormField>
                        <label>Recipient</label>
                        <Input value={this.state.recipientAddress} 
                               onChange={(event) => this.setState({recipientAddress: event.target.value})}>
                        </Input>
                    </FormField>
                        <Button primary loading={this.state.loading}>Create!</Button>
                        <Message error header="Oopss!" content={this.state.errorMessage}></Message>
                        <Message success header="Great" content={this.state.successMessage}></Message>
                </Form>
            </Layout>
        );
    }
    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: '', successMessage:''});
        const campaign = Campaign(this.props.address);
        const accounts = await web3Instance.eth.getAccounts();
        campaign.events.CreatedRequest({})
        .on('data', async (event) => {
            console.log(event.returnValues);
            this.setState({successMessage: 'Great, you created your requests'});
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        })
        .on('error', console.error());
        try {
            await campaign.methods.createRequest(
                    this.state.description,
                    web3Instance.utils.toWei(this.state.amount, 'ether'),
                    this.state.recipientAddress
                    ).send({from: accounts[0]});
            this.setState({successMessage: 'Great, you created your requests'});
            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch(err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    };
}

export default RequestNew;