import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CountriesList } from "../constants/countrieslist";

export function useCountriesList(onSuccess, onError) {
  const fetchData = async () => {
    try {
      // Use the local list — GeoNames remote API is often rate-limited / unreachable.
      return CountriesList.geonames;
    } catch (error) {
      throw new Error("Failed to fetch countries");
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-all-countries"],
    queryFn: fetchData,
    gcTime: Infinity,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data !== undefined) {
      onSuccess?.(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isError) {
      onError?.(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]);

  return { countries: data, isLoading, isError };
}

export function useCitiesForCountry(countryCode, onSuccess, onError) {
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `https://secure.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=1000&username=jamshaidjavaid`
      );
      return data.geonames;
    } catch (error) {
      throw new Error("Failed to fetch cities");
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["get-cities-for-country", countryCode],
    queryFn: fetchData,
    gcTime: Infinity,
    enabled: Boolean(countryCode),
  });

  useEffect(() => {
    if (data !== undefined) {
      onSuccess?.(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (isError) {
      onError?.(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error]);

  return { cities: data, isLoading, isError };
}
