import { createContext, useState } from "react"; 
import exploreData from '../data/data.json';

export const ExploreContext = createContext(null);

export const ExploreContextProvider = ({ children }) => {
  
  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState('001');

  const contextValue = {
    showPopup,
    setShowPopup,
    exploreData,
    selectedId,
    setSelectedId
  };

  return (
    <ExploreContext.Provider value={contextValue}>
      {children}
    </ExploreContext.Provider>
  );
};

