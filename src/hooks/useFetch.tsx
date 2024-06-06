import { useEffect, useState } from "react"

export const useFetch = (url: string | URL | Request) => {
    const [data, setData] = useState(null);
    const [pendiente, setPendiente] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        async function getData(url: string | URL | Request) {
            try {
              const resp = await fetch(url);
              if (!resp.ok) {
                throw {
                  err: true,
                  status: resp.status,
                  statusText: !resp.statusText ? "Error desconocido" : resp.statusText
                }
              }

              const datos = await resp.json();
              
              setData(datos);
              setPendiente(false);
              setError(false);
            } catch (err) {
              setPendiente(true);
              setError(err);
            }
          }

          getData(url)
    }, [url]);

    return { data, pendiente, error };
}