import {createContext, useContext} from 'react'
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
 
const AppwriteContext = createContext<AppwriteContextType | undefined>(undefined);
 
export const AppwriteContextProvider = ({children}: {children: React.ReactNode}) => {
    const {data: user, loading, error, refetch} = useAppwrite({fn: getUser});  // Va scoate utilizatorul logat
   
    const isLoggedIn = !!user;
    // !null => !true => false
    // !{name: "John"} => !false => true
 
    return (
        <AppwriteContext.Provider value={{user, isLoggedIn, loading, refetch}}>
            {children}
        </AppwriteContext.Provider>
    )
   
}
 
export const useAppwriteContext = () => {
    const context = useContext(AppwriteContext);
    if (!context) {
        throw new Error('useAppwriteContext must be used within a AppwriteContextProvider');
    }
    return context;
}