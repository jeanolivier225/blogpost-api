import { useState } from "react";

const useAlert = () => {

    const [alertState, setAlertState] = useState(null);
    
    const setAlert = (response: any) => {
        
        const alert = response ? {...response} : null;
        
        setAlertState(alert);
    }
    
    return [
        alertState,
        setAlert
    ];
    
}

export default useAlert;