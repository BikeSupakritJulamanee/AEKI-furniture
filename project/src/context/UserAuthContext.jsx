import React, { createContext, useContext, useEffect, useState } from 'react'

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth"

import { auth } from '../firebase';

const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {

    const [user, setUser] = useState({});

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
        
    }

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function logOut() {
        return signOut(auth);
    }
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setDate(expires.getDate() + days);
    
        const cookieValue = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
        document.cookie = cookieValue;
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
            setUser(currentuser);
            if (currentuser) {
                setCookie("userCookie", JSON.stringify(currentuser.uid), 7); 
            } else {
                setCookie("userCookie", "", -1); 
            }
        })
        return () => {
            unsubscribe();
            
        }
    }, [])

    return (
        <UserAuthContext.Provider value={{ user, login, signUp, logOut }} >
            {children}
        </UserAuthContext.Provider>
    )
}

export function useUserAuth() {
    return useContext(UserAuthContext);
}

