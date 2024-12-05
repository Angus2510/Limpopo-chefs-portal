import React from 'react';

const GoogleSheetEmbed = () => {
  return (
    <div className="google-sheet-container">
      <iframe 
        src="https://docs.google.com/spreadsheets/d/1UgUZkdNGyRbdmEh0zj3aikoMa4h-xF3tEej-1n5VeYU/edit?usp=sharing" 
        title="Google Sheet"
        width="100%" 
        height="600" 
        frameborder="0" 
        marginheight="0" 
        marginwidth="0">
      </iframe>
    </div>
  );
};

export default GoogleSheetEmbed;