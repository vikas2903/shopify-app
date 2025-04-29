import React from "react";

function GridItem({ img, title }) {  
  return (
    <div className="grid-item">
      <img src={img} alt={title} />
      <p>{title}</p>
    </div>
  );
}

export default GridItem;
