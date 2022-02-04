import Link from 'next/link';
import React from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Layout from '../../../../components/layout';
import Campaign from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';

class CampaignNewRequest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            description: '',
            value: '',
            recipient: '',
            spinnerState: false,
            errorMessage: ''
        }
    }

    onSubmit = async (event) => {
        event.preventDefault();

        try {
            const campaign = Campaign(this.props.address);
            const { description, value, recipient } = this.state;
            
            this.setState({spinnerState: true, errorMessage: ''});

            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
                from: accounts[0]
            });
        } catch(err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({spinnerState: false});
        }
    }


    render() {
        return (
            <Layout>
                <Link href={`/campaigns/requests/${this.props.address}`}>
                    <a>
                    Back
                    </a>
                </Link>

                <h3>Create Request</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                            value={this.state.description}
                            onChange={event => this.setState({description: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value (ether)</label>
                        <Input
                            value={this.state.value}
                            onChange={event => this.setState({value: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => this.setState({recipient: event.target.value})}
                        />
                    </Form.Field>

                    <Button loading={this.state.spinnerState} primary type="submit">
                        Create!
                    </Button>
                    
                    <Message error header="Oops!" content={this.state.errorMessage} />
                </Form>
            </Layout>
        );
    }
}

export async function getServerSideProps(context) {
    const { address } = context.query;
    return {
        props: {
            address: address
        }
    };
}


export default CampaignNewRequest;
