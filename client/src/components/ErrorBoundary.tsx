import React from 'react';

interface Props {}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            error: null,
            hasError: false,
        };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            hasError: true,
        });
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
