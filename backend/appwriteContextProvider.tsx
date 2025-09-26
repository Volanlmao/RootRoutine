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
// creeaza contextul cu valoare undefined pentru a detecta utilizarea in afara providerului
const AppwriteContext = createContext<AppwriteContextType | undefined>(undefined);

export const AppwriteContextProvider = ({ children }: { children: React.ReactNode }) => { // componenta care ambaleaza subarborele UI
    // ruleaza hook-ul cu fn= getUser; extrage data di o redenumeste user
    const { data: user, loading, error, refetch } = useAppwrite({ fn: getUser });

    const isLoggedIn = !!user;

    // providerul transmite { user, isLoggedIn, loading, refetch } catre descendenti si reda children.
    return (
        <AppwriteContext.Provider value={{ user, isLoggedIn, loading, refetch }}>
            {children}
        </AppwriteContext.Provider>
    )

}

// Hook de consum al contextului pentru a evita importuri directe ale contextului
export const useAppwriteContext = () => {
    const context = useContext(AppwriteContext); // Consuma contextul curent
    if (!context) {
        throw new Error('useAppwriteContext must be used within a AppwriteContextProvider');
    }
    return context;
}