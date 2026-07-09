import { useFetch } from "../hooks/api-hooks/useFetch";

export function useGetAllNews(onSuccess, onError) {
  const { response, isLoading } = useFetch(["get-all-news"], "news", {
    gcTime: 60000 * 2,
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
      gcTime: 60000 * 2,
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
      gcTime: 60000 * 2,
      onSuccess,
      onError,
    }
  );
  return { response, isLoading };
}
