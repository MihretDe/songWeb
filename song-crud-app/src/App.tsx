/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled";

const Title = styled.h1`
  color: #2b6cb0;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
  margin-top: 2rem;
`;

const App: React.FC = () => {
  return (
    <div>
      <Title>🎵 Song CRUD App (with Redux Toolkit + Saga + TS)</Title>
    </div>
  );
};

export default App;
