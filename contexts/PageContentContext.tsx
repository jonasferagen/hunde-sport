import { createContext, useContext } from 'react';

export type variant = 'primary' | 'secondary' | 'accent' | 'default' | 'card';

interface PageContentContextProps {
    styleVariantName: variant;
}

const PageContentContext = createContext<PageContentContextProps | undefined>(undefined);

export const PageContentProvider = PageContentContext.Provider;

export const usePageContentContext = (): PageContentContextProps => {
    const context = useContext(PageContentContext);
    if (!context) {
        return { styleVariantName: 'default' }; // Default value
    }
    return context;
};
