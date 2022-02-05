import React from 'react'
import { Table, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class RequestRow extends React.Component {

    onApprove = async () => {
        const campaign = Campaign(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });
    }

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });
    }

    render() {
        const {id, request, approversCount} = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;
        return (
            <Table.Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Table.Cell>
                    {id}
                </Table.Cell>
                <Table.Cell>
                    {request.description}
                </Table.Cell>
                <Table.Cell>
                    {web3.utils.fromWei(request.value, 'ether')}
                </Table.Cell>
                <Table.Cell>
                    {request.recipient}
                </Table.Cell>
                <Table.Cell>
                    {request.approvalCount}/{approversCount}
                </Table.Cell>
                <Table.Cell>
                    {
                        request.complete ? null : (
                            <Button color="green" basic onClick={this.onApprove}>Approve</Button>
                        )
                    }
                </Table.Cell>
                <Table.Cell>
                    {
                        request.complete ? null : (
                            <Button color="teal" basic onClick={this.onFinalize}>Finalize</Button>
                        )
                    }
                </Table.Cell>
            </Table.Row>
        );
    }
}

export default RequestRow;
