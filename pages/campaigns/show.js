import React, {Component} from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Button, Card, Grid, GridColumn, GridRow } from "semantic-ui-react";
import web3Instance from "../../ethereum/web3";
import GenericFormView from "../../components/GenericFormView";
import {Link} from '../../routes';
class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaignAddress = props.query.address;
        const campaign = Campaign(campaignAddress);
        const summary = await campaign.methods.getSummary().call();
        console.log(summary); 
        return {
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approversCount: summary[3],
            campaignOwner: summary[4],
            campaignAddress: campaignAddress  
        };
    }
    render() {
        return (
            <Layout>
            <h3>Campaign Show</h3>
            <Grid>
                <GridRow>
                <GridColumn width={10}>
                    {this.renderCards()}
                </GridColumn>

                <GridColumn width={6}>
                    <GenericFormView address ={this.props.campaignAddress} formTitle='Amount to Contribute' 
                                 inputTypeTitle= 'ether' 
                                 buttonTitle= 'Contribute'/>
                </GridColumn>

                </GridRow>
                
                <GridRow>
                    <GridColumn>
                    <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                        <a>
                            <Button primary>View Requests</Button>
                        </a>
                    </Link>
                    </GridColumn>     
                </GridRow>
            </Grid>
            </Layout>
        );
    }
    renderCards() {
        const {balance,
            campaignOwner,
        minimumContribution,
        requestCount,
        approversCount} = this.props;
        const items = [{
            header: campaignOwner,
            meta: 'Address of Manager',
            description: 'The manager created this campaign and can create requests.',
            style: {overflowWrap: 'break-word'}
        },
        {
            header: minimumContribution,
            meta: 'Minimum Contribution (wei)',
            description: 'You can contribute at least this much wei to become an approver.',
            style: {overflowWrap: 'break-word'} 
        }, {
            header: requestCount,
            meta: 'Number of requests',
            description: 'A request tries to withdraw money from the contract.',
            style: {overflowWrap: 'break-word'} 
        } ,  {
            header: approversCount,
            meta: 'Number of Approvers',
            description: 'Number of people who have already donated to this campaign',
            style: {overflowWrap: 'break-word'} 
        } , {
            header: web3Instance.utils.fromWei(balance, 'ether'),
            meta: 'Campaign balance (ether)',
            description: 'shows the total amount contributed.',
            style: {overflowWrap: 'break-word'} 
        }
    
    ];
        return <Card.Group items={items} />;
    }

}

export default CampaignShow;