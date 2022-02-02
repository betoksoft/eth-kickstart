import { withRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/layout';

class CampaignDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    static async getInitialProps(router) {
        const { address } = router.query;

        console.log('ADDRESS>>>>>>>>>>>>>>', address);
    }


    render() {
        return (
            <Layout>
                <h1>Test campaign detail!</h1>
            </Layout>
        );
    }
}

export default withRouter(CampaignDetail);
