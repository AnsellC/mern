import React, { FormEvent } from 'react';
import Login from '../components/Login';

interface Credentials {
    email: string;
    id: string;
    admin: boolean;
}

class Dashboard extends React.Component {
    state = {
        error: '',
        isLoggedIn: false,
        email: '',
        id: '',
        admin: false,
    };

    setError(error: string) {
        this.setState({
            error: error,
        });
    }

    authorize(credentials: Credentials) {
        this.setError('');
        this.setState({
            isLoggedIn: true,
            ...credentials,
        });
    }

    render() {
        let ErrorMessage, Page;
        if (this.state.error) {
            ErrorMessage = <div className="error">{this.state.error}</div>;
        } else {
            ErrorMessage = '';
        }

        if (!this.state.isLoggedIn) {
            Page = <Login auth={this.authorize.bind(this)} error={this.setError.bind(this)} />;
        } else {
            Page = `Welcome`;
        }

        return (
            <div className="full-page">
                {ErrorMessage}
                {Page}
            </div>
        );
    }
}

export default Dashboard;
