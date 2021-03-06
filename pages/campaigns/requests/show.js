import React, { Component} from "react";
import Layout from "../../../components/Layout";
import {Button, Table} from 'semantic-ui-react';;
import {Link} from "../../../routes";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

class RequestShow extends Component {
    
    static async getInitialProps(props)  {
        const {address} = props.query;
        const campaign = Campaign(address);
        const contributerCount = await campaign.methods.contributersCount().call();
        const requestCount = await campaign.methods.getRequestCount().call();
        const requests = await Promise.all(
            Array(requestCount).fill().map((element, index) => {
            return campaign.methods.requests(index).call()
        }));
        //  Array(parseInt(requestCount))
        console.log(requests);
        return {address,requestCount,requests,contributerCount}
    }

    renderRow() {
        return this.props.requests.map((request,index) => {
            return <RequestRow 
            key={index}
            id={index} 
            contributerCount={this.props.contributerCount}
            request={request} 
            address={this.props.address}/>
        })
    }
    render() {

    const {Header, Row, HeaderCell, Body} = Table;

        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                    <Button primary floated="right" style={{marginBottom: 10}}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRow()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} request.</div>
            </Layout>
        );
    }
}
export default RequestShow;