// src/context/UserContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [heightFt, setHeightFt] = useState(null);
  const [heightIn, setHeightIn] = useState(null);
  const [tolerance, setTolerance] = useState(5);
  const [phone, setPhone] = useState('');
  const [emergencyContact1, setEmergencyContact1] = useState('');
  const [emergencyContact2, setEmergencyContact2] = useState('');

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        photoUri,
        setPhotoUri,
        age,
        setAge,
        gender,
        setGender,
        weight,
        setWeight,
        heightFt,
        setHeightFt,
        heightIn,
        setHeightIn,
        tolerance,
        setTolerance,
        phone,
        setPhone,
        emergencyContact1,
        setEmergencyContact1,
        emergencyContact2,
        setEmergencyContact2,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
