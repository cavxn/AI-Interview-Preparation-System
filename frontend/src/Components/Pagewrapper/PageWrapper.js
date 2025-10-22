// src/components/PageWrapper.js
import React from 'react';
const PageWrapper = ({ children }) => (
  <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
    {children}
  </div>
);
export default PageWrapper;
