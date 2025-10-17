import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useCountriesList(onSuccess, onError) {
  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        "https://secure.geonames.org/countryInfoJSON?username=jamshaidjavaid"
      );
      return data.geonames;
    } catch (error) {
      throw new Error("Failed to fetch countries");
    }
  };

  const { data, isLoading, isError } = useQuery(
    ["get-all-countries"],
    fetchData,
    {
      onSuccess,
      onError,
    }
  );

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

  const { data, isLoading, isError } = useQuery(
    ["get-cities-for-country", countryCode],
    fetchData,
    {
      onSuccess,
      onError,
      cacheTime: Infinity,
    }
  );

  return { cities: data, isLoading, isError };
}
