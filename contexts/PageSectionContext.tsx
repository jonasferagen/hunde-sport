import { createContext, useContext } from 'react';

export type PageSectionType = 'primary' | 'secondary' | 'accent';

interface PageSectionContextProps {
    sectionType: PageSectionType;
}

const PageSectionContext = createContext<PageSectionContextProps | undefined>(undefined);

export const PageSectionProvider = PageSectionContext.Provider;

export const usePageSection = (): PageSectionContextProps => {
    const context = useContext(PageSectionContext);
    if (!context) {
        return { sectionType: 'secondary' }; // Default value
    }
    return context;
};
