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

// Declara hook-ul generic.
// T = tipul rezultatului promis de fn.
// P = mapa cheie -> (string|number) pentru parametri.
// Deconstructor: fn, params (default obiect gol scris ca P), enabled=false
export const useAppwrite = <T, P extends Record<string, string | number>>({ fn, params = {} as P, enabled = false }: useAppwriteProps<T, P>): UseAppwriteReturn<T, P> => {
    const [data, setData] = useState<T | null>(null); // stoc pentru rezultatul curent (null initial)
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // functia de fetch:
    const fetchData = useCallback(async (fetchParams?: P) => {
        setLoading(true); // Reseteaza error, seteaza loading=true.
        setError(null);
        try {
            const result = await fn(fetchParams as P); // Apeleaza fn cu fetchParams (fortat ca P).
            setData(result);
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }

    }, [fn]) // dependente: fn pentru a reface funcția daca se schimba implementarea fn.

    useEffect(() => {
        if (!enabled) {
            fetchData(params);
        }
    }, [])

    const refetch = async (fetchParams?: P) => await fetchData(fetchParams);

    return { data, loading, error, refetch };

}