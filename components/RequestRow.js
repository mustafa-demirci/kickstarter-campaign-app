import React,{Component} from "react";
import web3Instance from "../ethereum/web3";
import { Button, Label, TableCell, TableRow } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
class RequestRow extends Component {
    render(props) {
        const {id, request, contributerCount} = this.props;
        const readyToFinalize = request.approvalCount > contributerCount / 2;
        return <TableRow disabled={request.complete} positive={readyToFinalize && !request.complete} negative={!readyToFinalize && !request.complete}>
            <TableCell>
                {id}
            </TableCell>
            <TableCell>
                {request.description}
            </TableCell>
            <TableCell>
                {web3Instance.utils.fromWei(request.value, 'ether')}
            </TableCell>
            <TableCell>
                {request.recipient}
            </TableCell>
            <TableCell>                 
                {`${request.approvalCount}/${contributerCount}`}
            </TableCell>
            <TableCell>
                {request.complete ? null : (
                <Button onClick={this.approve} color="green" basic>Approve</Button>
                )}
            </TableCell>
            <TableCell>
                {request.complete ? null : (
                <Button onClick={this.finalize} color="purple" basic>Finalize</Button>)
                }
            </TableCell>
        </TableRow>
    }
    finalize = async () => {
        const campaign = Campaign(this.props.address);
        const accounts = await web3Instance.eth.getAccounts();
        try {
            await campaign.methods.finalizeRequest(this.props.id)
            .send({from: accounts[0]});
        } catch(err) {
            console.log(err.message);
        }
    }
    approve = async () => {
        const campaign = Campaign(this.props.address);
        const accounts = await web3Instance.eth.getAccounts();
        try {
            await campaign.methods.approveRequest(this.props.id)
            .send({from: accounts[0]});
        } catch(err) {
            console.log(err.message);
        }
    }
}

export default RequestRow;