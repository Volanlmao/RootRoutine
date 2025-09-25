import { useCallback, useEffect, useState } from "react";

interface useAppwriteProps<T, P extends Record<string, string | number>> {
    fn: (params: P) => Promise<T>;
    params?: P;
    enabled?: boolean;
}

interface UseAppwriteReturn<T, P> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (params?: P) => Promise<void>;
}

// Declară hook-ul generic.
// T = tipul rezultatului promis de fn.
// P = mapa cheie ->(string|number) pentru parametri.
// Deconstructor: fn, params (default obiect gol tipat ca P), enabled=false
export const useAppwrite = <T, P extends Record<string, string | number>>({ fn, params = {} as P, enabled = false }: useAppwriteProps<T, P>): UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null); // Stoc pentru rezultatul curent
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    //Definește funcția memoizată de fetch:
    // Resetează error, setează loading=true.
    // Apelează fn cu fetchParams (forțat ca P).
    // La succes: setData(result).
    // La eșec: stochează eroarea ca string (vezi mai jos).
    // În finally: loading=false.
    // Dependențe: doar fn – corect pentru a reface funcția dacă se schimbă implementarea fn.
    const fetchData = useCallback(async (fetchParams?: P) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fn(fetchParams as P);
            setData(result);
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }

    }, [fn])

    useEffect(() => {
        if (!enabled) {
            fetchData(params);
        }
    }, [])

    const refetch = async (fetchParams?: P) => await fetchData(fetchParams);

    return { data, loading, error, refetch };

}