import { useFetch } from "../hooks/api-hooks/useFetch";

export function useGetAllNews(onSuccess, onError) {
  const { response, isLoading } = useFetch(["get-all-news"], "news", {
    cacheTime: 60000 * 2,
    onSuccess,
    onError,
  });
  return { response, isLoading };
}

export function useGetAllGalleries(onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-all-galleries"],
    "business/gallery",
    {
      cacheTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}

export function useGetSingleGallery(id, onSuccess, onError) {
  const { response, isLoading } = useFetch(
    ["get-single-gallery", id],
    `business/gallery/${id}`,
    {
      cacheTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
