import { createContext, useContext } from 'react';

export type PageContentType = 'primary' | 'secondary' | 'accent' | 'default';

interface PageContentContextProps {
    type: PageContentType;
}

const PageContentContext = createContext<PageContentContextProps | undefined>(undefined);

export const PageContentProvider = PageContentContext.Provider;

export const usePageContent = (): PageContentContextProps => {
    const context = useContext(PageContentContext);
    if (!context) {
        return { type: 'default' }; // Default value
    }
    return context;
};
