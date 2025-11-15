/**
 * Sends a message to the FiveM NUI callback
 * @param {string} eventName - The event name to send
 * @param {object} data - The data to send with the event
 * @returns {Promise} - Promise that resolves with the response
 */
export async function fetchNui(eventName, data = {}) {
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  };

  // In development mode (not in FiveM), return mock data
  if (!window.GetParentResourceName) {
    return { ok: true, data: {} };
  }

  const resourceName = window.GetParentResourceName ? window.GetParentResourceName() : 'ng-demo';
  const resp = await fetch(`https://${resourceName}/${eventName}`, options);

  return await resp.json();
}
