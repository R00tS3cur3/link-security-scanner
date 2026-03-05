import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    background: '#0a0e27',
                    color: '#ff0055',
                    padding: '50px',
                    fontFamily: 'Courier New, monospace',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        maxWidth: '600px',
                        background: 'rgba(255, 0, 85, 0.1)',
                        border: '2px solid #ff0055',
                        padding: '40px',
                        textAlign: 'center'
                    }}>
                        <h1 style={{
                            fontSize: '48px',
                            marginBottom: '20px',
                            textShadow: '0 0 10px #ff0055'
                        }}>
                            ⚠️ เกิดข้อผิดพลาด
                        </h1>

                        <p style={{
                            fontSize: '18px',
                            marginBottom: '30px',
                            color: '#00ff88'
                        }}>
                            แอปพลิเคชันเกิดข้อผิดพลาดที่ไม่คาดคิด
                        </p>

                        {this.state.error && (
                            <div style={{
                                background: '#060813',
                                padding: '20px',
                                marginBottom: '30px',
                                textAlign: 'left',
                                fontSize: '14px',
                                color: '#ffaa00',
                                borderLeft: '4px solid #ff0055',
                                overflowX: 'auto'
                            }}>
                                <strong>Error:</strong> {this.state.error.toString()}
                            </div>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '15px 40px',
                                fontSize: '18px',
                                background: '#00ff88',
                                color: '#0a0e27',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontFamily: 'Courier New, monospace',
                                textTransform: 'uppercase',
                                letterSpacing: '2px'
                            }}
                        >
                            🔄 รีเฟรชหน้า
                        </button>

                        <p style={{
                            marginTop: '30px',
                            fontSize: '12px',
                            color: '#00ff88',
                            opacity: 0.6
                        }}>
                            ถ้าปัญหายังคงเกิดขึ้น กรุณาตรวจสอบ console (F12)
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
