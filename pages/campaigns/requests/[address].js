import Link from 'next/link';
import { withRouter } from 'next/router';
import React from 'react';
import { Button } from 'semantic-ui-react';
import Layout from '../../../components/layout';

class CampaignRequests extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <Layout>
                <h3>Requests</h3>


                <Link href={`/campaigns/requests/new/${this.props.address}`}>
                    <a>
                        <Button primary>Add request</Button>
                    </a>
                </Link>
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


export default withRouter(CampaignRequests);
