import Router from 'next/router';
import React from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributeForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            errorMessage: '',
            spinnerState: false
        };
    }

    onSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);

        this.setState({spinnerState: true, errorMessage: ''});

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')             
            });
            Router.replace(`/campaigns/${this.props.address}`);
        } catch (err) {
            this.setState({errorMessage: err.message});
        } finally {
            this.setState({spinnerState: false, value: ''});
        }
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label="ether"
                        labelPosition="right" 
                    />
                </Form.Field>

                <Button loading={this.state.spinnerState} primary type="submit">
                    Contribute!
                </Button>

                <Message error header="Oops!" content={this.state.errorMessage} />
            </Form>
        );
    }
}

export default ContributeForm;
