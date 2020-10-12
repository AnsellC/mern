import React from 'react';
import axios from 'axios';
import config from '../config';

interface Props {
    auth: Function;
    error: Function;
}

interface State {
    email: string;
    password: string;
    loading: boolean;
    [index: string]: any;
}

class Login extends React.Component<Props, State> {
    state = {
        email: '',
        password: '',
        loading: false,
    };

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    loginHandler = async () => {
        this.setState({
            loading: true,
        });

        try {
            const result = await axios.post(`${config.serverBaseUrl}/login`, {
                email: this.state.email,
                password: this.state.password,
            });

            const token = result.data.token;
            if (!token) {
                throw new Error('Failed to get token.');
            }
            localStorage.setItem('token', token);
            const res = await axios.get(`${config.serverBaseUrl}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            this.props.auth(res);
        } catch (error) {
            this.props.error(error.message);
        }
        this.setState({
            loading: false,
        });
    };

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    // See const loginText below
    get loginText() {
        return this.state.loading ? 'Please wait...' : 'Login';
    }

    // See const loginText below

    render() {
        return (
            <div className="login-modal">
                <div>
                    <strong>Email</strong>
                    <br />
                    <input
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        type="text"
                    ></input>
                </div>
                <div>
                    <strong>Password</strong>
                    <br />
                    <input
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                    ></input>
                </div>
                <div style={{ textAlign: 'center', margin: '2em' }}>
                    <button type="submit" onClick={this.loginHandler}>
                        {this.loginText}
                    </button>
                </div>
            </div>
        );
    }
}

export default Login;
