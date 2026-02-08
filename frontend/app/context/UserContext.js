// src/context/UserContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();


export const UserProvider = ({ children }) => {
  const [firstName, setFirstName] = useState('');
  const [photoUri, setPhotoUri] = useState(null); // Add photoUri to context
  return (
    <UserContext.Provider value={{ firstName, setFirstName, photoUri, setPhotoUri }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
