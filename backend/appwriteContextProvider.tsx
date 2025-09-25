import { createContext, useContext } from 'react'
import { useAppwrite } from './useAppwrite'
import { getUser } from './appwrite'

interface User {
    $id: string,
    name: string,
    email: string
}

interface AppwriteContextType {
    user: User | null;
    isLoggedIn: boolean;
    loading: boolean;
    refetch: () => Promise<void>;
}
// creeaza contextul cu valoare implicita undefined pentru a detecta utilizarea in afara providerului
const AppwriteContext = createContext<AppwriteContextType | undefined>(undefined);

export const AppwriteContextProvider = ({ children }: { children: React.ReactNode }) => { // Componentă provider care ambalează subarborele UI
    // Rulează hook-ul cu fn= getUser; extrage data și o redenumește user. error este returnat dar nu e expus în context 
    const { data: user, loading, error, refetch } = useAppwrite({ fn: getUser });

    const isLoggedIn = !!user;

    // providerul transmite { user, isLoggedIn, loading, refetch } catre descendenti si reda children.
    return (
        <AppwriteContext.Provider value={{ user, isLoggedIn, loading, refetch }}>
            {children}
        </AppwriteContext.Provider>
    )

}

// Hook de consum al contextului pentru a evita importuri directe ale contextului. 
export const useAppwriteContext = () => {
    const context = useContext(AppwriteContext); // Consumă contextul curent
    if (!context) {
        throw new Error('useAppwriteContext must be used within a AppwriteContextProvider');
    }
    return context;
}