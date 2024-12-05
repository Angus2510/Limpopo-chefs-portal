'use client';
import { createContext, ReactNode, useState, useContext, useEffect } from 'react';

export interface SidebarContextInterface {
    openSidebar: boolean,
    setOpenSidebar: (state: boolean) => void
}

export const SidebarContext = createContext<SidebarContextInterface>({
    openSidebar: true,
    setOpenSidebar: () => {},
});

type Props = {
    children: ReactNode
};

export default function SidebarProvider({ children }: Props) {
    const [openSidebar, setOpenSidebar] = useState<boolean>(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1200) {
                setOpenSidebar(false);
            } else {
                setOpenSidebar(true);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <SidebarContext.Provider value={{ openSidebar, setOpenSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
    return useContext(SidebarContext);
}
