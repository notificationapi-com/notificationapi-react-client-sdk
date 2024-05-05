export const api = (
  endpoint: string,
  method: "GET" | "POST" | "PATCH",
  resource: string,
  clientId: string,
  userId: string,
  hashedUserId?: string,
  data?: any
): Promise<any> => {
  const token = hashedUserId
    ? btoa(clientId + ":" + userId + ":" + hashedUserId)
    : btoa(clientId + ":" + userId);
  return fetch(
    `${endpoint}/${clientId}/users/${encodeURIComponent(userId)}/${resource}`,
    {
      method,
      body: JSON.stringify(data),
      headers: {
        Authorization: `Basic ${token}`,
      },
    }
  ).then((res) => res.json());
};
