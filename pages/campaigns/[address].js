import { withRouter } from 'next/router';
import React from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import Link from 'next/link';

class CampaignDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    renderCards() {
        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'The manager created this campaign and can create requests to withdraw money.',
                style: { overflowWrap: 'word-break' },
                fluid: true
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become an approver.',
                fluid: true
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Request must be approve by approvers.',
                fluid: true
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who already donated to this campaign.',
                fluid: true
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much this campaign has left to spend.',
                fluid: true
            }
        ];

        return <Card.Group items={items} />
    }

    render() {
        return (
            <Layout>
                <h3>Campaign show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10} stretched={true}>
                            {this.renderCards()}

                            <Link href={`/campaigns/requests/${this.props.address}`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                        <Grid.Column width={6} stretched={true}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}


export async function getServerSideProps(context) {
    const { address } = context.query;

    const campaign = Campaign(address);

    const summary = await campaign.methods.getSummary().call();

    return {
        props: {
            address: address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        }
    };
}

export default withRouter(CampaignDetail);
