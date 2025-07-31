import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const apiBase = "https://pulse-point-server-blue.vercel.app";

const fetchBloodRequests = async () => {
  const token = localStorage.getItem("access-token");
  const res = await fetch(`${apiBase}/donation-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch blood requests");
  return res.json();
};

const createRequest = async (newRequest) => {
  const token = localStorage.getItem("access-token");
  const res = await fetch(`${apiBase}/donation-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newRequest),
  });
  if (!res.ok) throw new Error("Failed to create blood request");
  return res.json();
};

export const useBloodRequests = () =>
  useQuery({
    queryKey: ["bloodRequests"],
    queryFn: fetchBloodRequests,
    retry: 1,
  });

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bloodRequests"] });
    },
  });
};
