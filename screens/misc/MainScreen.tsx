import { BottomBar } from '@/components/menu/BottomBar';
import { SideBar } from '@/components/menu/SideBar';
import { LayoutProvider } from '@/contexts';
import { JSX } from 'react';

interface MainScreenProps {
    children: React.ReactNode;
}

export const MainScreen = ({ children }: MainScreenProps): JSX.Element => {
    return (
        <LayoutProvider>
            <SideBar />
            <BottomBar />
            {children}
        </LayoutProvider>
    );
};


