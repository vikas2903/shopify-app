import React, { useEffect, useState } from 'react';

const stepImages = [
  'https://cdn.shopify.com/s/files/1/0796/7847/2226/files/step01.jpg?v=1749622624',
  'https://cdn.shopify.com/s/files/1/0796/7847/2226/files/step02.jpg?v=1749622624',
  'https://cdn.shopify.com/s/files/1/0796/7847/2226/files/step03.jpg?v=1749622624',
  'https://cdn.shopify.com/s/files/1/0796/7847/2226/files/step04.jpg?v=1749622624',
  'https://cdn.shopify.com/s/files/1/0796/7847/2226/files/step06.jpg?v=1749622624'
];

const StepSlider = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % stepImages.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      
      <div style={styles.imageWrapper}>
        <img
          src={stepImages[currentStep]}
          alt={`Step ${currentStep + 1}`}
          style={styles.image}
        />
        <div style={styles.stepIndicator}>Step {currentStep + 1} of 5</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '0px',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    // maxWidth: '500px',
    margin: '0 auto',
    overflow: 'hidden',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: 'auto',
    transition: 'opacity 0.5s ease-in-out',
    borderRadius: '12px',
  },
  stepIndicator: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
};

export default StepSlider;
