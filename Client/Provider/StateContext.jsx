
import { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const usestate = () => useContext(StateContext);


export const StateProvider = ({ children }) => {

    const  [data, setData]  = useState({
        room: "",
        roomId: "",
    });
    return (
        <StateContext.Provider value={{ data, setData }}>
            {children}
        </StateContext.Provider>
    );
};
