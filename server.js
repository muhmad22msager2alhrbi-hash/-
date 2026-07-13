import express from 'express';
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.post('/api/proxy', async (req, res) => {
  const { url, method, headers, body } = req.body;

  try {
    const options = {
      method: method || 'GET',
      headers: headers || {},
    };

    if (body && Object.keys(body).length > 0) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('🚀 Proxy running on port 3000'));