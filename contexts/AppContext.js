import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  scenario: null,
  roles: {},
  actions: [],
  metrics: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SCENARIO':
      return { ...state, scenario: action.payload };
    case 'SET_ROLES':
      return { ...state, roles: action.payload };
    case 'ADD_ACTION':
      return { ...state, actions: [...state.actions, action.payload] };
    case 'SET_METRICS':
      return { ...state, metrics: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
