import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const apiBase = import.meta.env.VITE_API_URL || "";

const fetchBloodRequests = async () => {
  const res = await fetch(`${apiBase}/api/requests`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const createRequest = async (newRequest) => {
  const res = await fetch(`${apiBase}/api/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRequest),
  });
  if (!res.ok) throw new Error("Failed to create request");
  return res.json();
};

export const useBloodRequests = () =>
  useQuery({ queryKey: ["bloodRequests"], queryFn: fetchBloodRequests });

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bloodRequests"] });
    },
  });
};
