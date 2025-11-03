// pages/PersistReadyGate.jsx
import React from "react";
import { useSelector } from "react-redux";

const PersistReadyGate = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  if (!auth) return null; // wait until persisted data loads
  return children;
};

export default PersistReadyGate;
