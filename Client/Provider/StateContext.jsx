
import { useEffect } from 'react';
import { createContext, useContext, useState } from 'react';
import axios from 'axios'
const StateContext = createContext();

export const usestate = () => useContext(StateContext);


export const StateProvider = ({ children }) => {

    const [data, setData] = useState({
        room: "",
        roomId: "",
        name: "",
    });
    const [loading, setLoading] = useState(false);
    const [isPopup, setIsPopup] = useState(false);
    const [isuserconnect, setIsUserConnect] = useState(false);

    const check_server = async () => {
        setLoading(true)
        await axios.get(`${import.meta.env.VITE_DOMAIN}/api`).then((res) => {
            console.log(res)
            setLoading(false)
        })
    }

    useEffect(() => {
        check_server()
    }, [])

    return (
        <StateContext.Provider value={{ data, setData, loading, setLoading, isPopup, setIsPopup, isuserconnect, setIsUserConnect }}>
            {children}
        </StateContext.Provider>
    );
};
