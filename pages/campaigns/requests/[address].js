import Link from 'next/link';
import { withRouter } from 'next/router';
import React from 'react';
import { Button, Table, TableHeaderCell } from 'semantic-ui-react';
import Layout from '../../../components/layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class CampaignRequests extends React.Component {

    constructor(props) {
        super(props);
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                key={index}
                id={index}
                request={request}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />
        });
    }


    render() {
        return (
            <Layout>
                <h3>Requests</h3>


                <Link href={`/campaigns/requests/new/${this.props.address}`}>
                    <a>
                        <Button primary floated="right" style={{marginBottom: 10}}>Add request</Button>
                    </a>
                </Link>

                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Approval Count</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            <Table.HeaderCell>Finalize</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>
                </Table>

                <div> Found {this.props.requestCount } requests.</div>
            </Layout>
        );
    }
}


export async function getServerSideProps(context) {
    const { address } = context.query;

    const campaign = Campaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.getApproversCount().call();

    const requests = await Promise.all(
        Array(requestCount).fill().map(async (element, index) => {
            const requestObject = await campaign.methods.requests(index).call();
            return JSON.parse(JSON.stringify(requestObject));
        })
    );

    return {
        props: {
            address,
            requests,
            requestCount,
            approversCount
        }
    };
}


export default withRouter(CampaignRequests);
