'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MenuContextType {
  selectedMenu: string;
  setSelectedMenu: (menuId: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [selectedMenu, setSelectedMenu] = useState<string>('MAIN');

  return (
    <MenuContext.Provider value={{ selectedMenu, setSelectedMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
