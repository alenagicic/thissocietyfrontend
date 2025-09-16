import React, { createContext, useState } from 'react';

export const ScrollContext = createContext(null);

export default function ScrollProvider ({ children }) {
  const [commentIdToScrollTo, setCommentIdToScrollTo] = useState(null);

  const value = {
    commentIdToScrollTo,
    setCommentIdToScrollTo,
  };

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
};