import React from 'react';
import { useNavigate } from 'react-router-dom';

const Error = () => {
    const navigate = useNavigate();

    return (
        <section style={styles.page_404}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="col-sm-10 col-sm-offset-1 text-center" style={{ textAlign: 'center' }}>
                            <div style={styles.four_zero_four_bg}>
                                <h1 style={styles.four_zero_four_bg_h1}>404</h1>
                            </div>

                            <div style={styles.contant_box_404}>
                                <h3 className="h2" style={{ fontSize: '30px' }}>
                                    Look like you're lost
                                </h3>
                                <p>the page you are looking for not available!</p>
                                <button
                                    onClick={() => navigate('/')}
                                    style={styles.link_404}
                                >
                                    Go to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const styles = {
    page_404: {
        padding: '40px 0',
        background: '#fff',
        fontFamily: "'Arvo', serif",
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    },
    four_zero_four_bg: {
        backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)',
        height: '400px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    },
    four_zero_four_bg_h1: {
        fontSize: '80px',
        textAlign: 'center',
        margin: '0'
    },
    link_404: {
        color: '#fff',
        padding: '10px 20px',
        backgroundColor: '#39ac31',
        margin: '20px 0',
        display: 'inline-block',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        textDecoration: 'none'
    },
    contant_box_404: {
        marginTop: '40px',
    }
};

export default Error;