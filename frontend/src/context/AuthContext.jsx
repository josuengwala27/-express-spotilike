import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Créer le Contexte
const AuthContext = createContext(null);

// 2. Créer le Provider (Composant qui fournira le contexte)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stocker les infos user { id, username, email, role, token }
  const [loadingInitial, setLoadingInitial] = useState(true); // Pour vérifier le localStorage au début

  // Effet pour charger l'utilisateur depuis localStorage au montage initial
  useEffect(() => {
    const storedUser = localStorage.getItem('spotilikeUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur parsing utilisateur depuis localStorage", error);
        localStorage.removeItem('spotilikeUser'); // Nettoyer si invalide
      }
    }
    setLoadingInitial(false); // Fin de la vérification initiale
  }, []);

  // Fonction pour connecter l'utilisateur
  const login = (userData) => {
    localStorage.setItem('spotilikeUser', JSON.stringify(userData));
    setUser(userData);
    // Note: La redirection sera gérée dans le composant LoginPage
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    localStorage.removeItem('spotilikeUser');
    setUser(null);
    // Note: La redirection sera gérée là où logout est appelé (ex: Navbar)
  };

  // Valeur fournie par le contexte
  const value = {
    user,         // L'objet utilisateur connecté (ou null)
    isAuthenticated: !!user, // Un booléen pratique pour vérifier si connecté
    login,        // La fonction pour se connecter
    logout,       // La fonction pour se déconnecter
    loadingInitial // Pour savoir si on vérifie encore le localStorage
  };

  // Rendre le Provider avec la valeur définie
  // On ne rend les enfants que lorsque la vérification initiale est terminée
  return (
    <AuthContext.Provider value={value}>
      {!loadingInitial && children} 
    </AuthContext.Provider>
  );
};

// 3. Créer un Hook personnalisé pour utiliser facilement le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 