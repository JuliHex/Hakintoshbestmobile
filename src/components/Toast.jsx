import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
    const [message, setMessage] = useState(null);
    const timer = useRef();
    const show = useCallback(text => {
        setMessage(text);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setMessage(null), 1800);
    }, []);

    return (
        <ToastContext.Provider value={show}>
            {children}
            <div className="toast" role="status" hidden={!message}>{message}</div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
