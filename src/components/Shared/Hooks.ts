import { useEffect, useState } from "react";
import { getData } from "../../services/GenericFetch";
import { Base } from "../../types/Base";

export const useFetchData = <T extends Base>(endpoint: string) => {
    const [data, setData] = useState<T[]>([]);
    const [filteredData, setFilteredData] = useState<T[]>([]);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await getData<T[]>(endpoint); // Ajusta según tu servicio
          setData(result);
          setFilteredData(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [endpoint]);
  
    return { data, filteredData, setFilteredData };
  };

  export const useFilterData = <T extends Base>(
    data: T[],
    query: string,
    filterBy: (entity: T) => boolean
  ) => {
    const [filteredData, setFilteredData] = useState<T[]>([]);
  
    useEffect(() => {
      let filtered = data.filter((entity) =>
        filterBy(entity)
      );
  
      setFilteredData(filtered);
    }, [query, data]);
  
    return filteredData;
  };