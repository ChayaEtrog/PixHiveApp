export const gradientBorderButton = {
    border: '2px solid',
    borderImageSlice: 1,
    borderImageSource: 'linear-gradient(to right, #47dcd1, #dc8dec)',
    color: '#743ad5',
    backgroundColor: '#fff',
    padding: '10px 30px',
    borderRadius: 0,
    width: '10vw',
    display: {xs: 'none',lg:'inline'} ,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)',
      border: 0,
      borderRadius: 0,
      color: 'white',
    },
    '&:active': {
      background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)',
      border: 0,
      borderRadius: 0,
      color: 'white',
    },
  };
  
 export const iconButtonStyle = {
    border: 'none',
    color: '#743ad5',
    borderRadius: 0,
    width: '5vw',
    '@media (max-width:1200px)': { // lg לפי MUI
      width: '70%',
    }
  };
  
 export const GradientButton ={
    background: 'linear-gradient(45deg, #47dcd1 , #dc8dec)', // הגדרת הגרדיאנט
    border: 0,
    borderRadius: 0,
    color: 'white',
    padding: '10px 30px',
  }