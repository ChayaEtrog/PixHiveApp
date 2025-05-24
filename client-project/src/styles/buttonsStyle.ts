export const gradientBorderButton = {
  border: '2px solid',
  borderImageSlice: 1,
  borderImageSource: 'linear-gradient(to right, #47dcd1, #dc8dec)',
  color: '#743ad5',
  backgroundColor: '#fff',
  padding: '6px 30px',
  borderRadius: 0,
  width: '10vw',
  transition: 'all 0.3s ease-out',
  backgroundSize: '200% 200%',
  backgroundPosition: 'left center',
  '&:hover': {
    backgroundImage: 'linear-gradient(45deg, #47dcd1 , #dc8dec)',
    backgroundPosition: 'right center',
    color: 'white',
    border: 0,
    borderRadius: 0,
  },
  '&:active': {
    backgroundImage: 'linear-gradient(45deg, #47dcd1 , #dc8dec)',
    backgroundPosition: 'right center',
    color: 'white',
    border: 0,
    borderRadius: 0,
  },
};
 export const iconButtonStyle = {
    border: 'none',
    color: '#743ad5',
    borderRadius: 0,
    width: '5vw',
    '@media (max-width:1200px)': { 
      width: '70%',
    }
  };
  
 export const GradientButton ={
    background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)', 
    border: 0,
    borderRadius: 0,
    color: 'white',
    padding: '10px 30px',
  }