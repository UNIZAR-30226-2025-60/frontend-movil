import React, { createContext, useState, useContext } from 'react';

// Crea el contexto
const UsuarioContext = createContext();

// Usa el contexto
export const useUsuario = () => useContext(UsuarioContext);

// Provee el contexto
export const UsuarioProvider = ({ children }) => {
    const [correoUsuario, setCorreoUsuario] = useState(null);
    return (
        <UsuarioContext.Provider value={{ correoUsuario, setCorreoUsuario }}>
            {children}
        </UsuarioContext.Provider>
    );
};
