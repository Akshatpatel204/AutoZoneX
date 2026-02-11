import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Error = memo(({ admin }) => {
  const navigate = useNavigate();

  // 1. Memoize styles to prevent object recreation on every render
  const styles = useMemo(() => ({
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
      textDecoration: 'none',
      transition: 'opacity 0.2s'
    },
    contant_box_404: {
      marginTop: '40px',
    }
  }), []);

  // 2. Optimized Navigation Handler
  const handleBackAction = () => {
    navigate(admin ? '/admin' : '/');
  };

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
                <h3 className="h2" style={{ fontSize: '30px', color: '#000' }}>
                  Look like you're lost
                </h3>
                <p style={{ color: '#000' }}>the page you are looking for not available!</p>
                
                <button
                  onClick={handleBackAction}
                  style={styles.link_404}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  {admin ? 'Go to Dashboard' : 'Go to Home'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Error.displayName = 'Error';

export default Error;