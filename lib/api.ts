export const api = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH',
  resource: string,
  clientId: string,
  userId: string,
  hashedUserId?: string,
  data?: unknown
): Promise<unknown> => {
  const token = hashedUserId
    ? btoa(clientId + ':' + userId + ':' + hashedUserId)
    : btoa(clientId + ':' + userId);
  const res = await fetch(
    `${endpoint}/${clientId}/users/${encodeURIComponent(userId)}/${resource}`,
    {
      method,
      body: JSON.stringify(data),
      headers: {
        Authorization: `Basic ${token}`
      }
    }
  );

  try {
    const responseData = await res.json();
    return responseData;
  } catch (e) {
    return undefined;
  }
};
