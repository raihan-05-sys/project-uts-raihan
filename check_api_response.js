const axios = require('axios');
(async () => {
  try {
    const res = await axios.get('https://api.tif.uin-suska.ac.id/setoran-dev/v1/dosen/pa-saya');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('HTTP', err.response.status, err.response.statusText);
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
})();
