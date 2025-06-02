import { createContext, useState } from "react"; 
import exploreData from '../data/data.json';

// Create context with default values to avoid null context
export const ExploreContext = createContext({
  showPopup: false,
  setShowPopup: () => {},
  exploreData: [],
  selectedId: '001',
  setSelectedId: () => {},
  blockId: '001',
  setblockId: () => {}
  
});

export const ExploreContextProvider = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState('001');
  const [blockId, setblockId] = useState('001');

  const contextValue = {
    showPopup,
    setShowPopup,
    exploreData,
    selectedId,
    setSelectedId,
    blockId,
    setblockId
  };

  return (
    <ExploreContext.Provider value={contextValue}>
      {children}
    </ExploreContext.Provider>
  );
};

