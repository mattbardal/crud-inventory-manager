/* postData(url, data)
 * 
 * Function to make a POST request to the server to update 
 * the database with a new entry.
 *
 */
async function postData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors', 
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response.json(); 
}

/* deleteData(url)
 * 
 * Function to make a DELETE request to the server to update 
 * the database by removing an entry.
 *
 */
async function deleteData(url) {
  const response = await fetch(url, {
      method: 'DELETE'
  });

  return response.json(); 
}

/* getData(url)
 * 
 * Function to make a GET request to the server grab data
 * from the database.
 *
 */
async function getData(url) {
  const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', 
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/json'
      }
  });

  return response.json(); 
}

/* updateData(url, data)
 * 
 * Function to make a PATCH request to the server update
 * a spoecified entry in the database.
 *
 */
async function updateData(url, data) {
  const response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors', 
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

  return response.json(); 
}