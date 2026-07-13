const express = require('express');
const app = express();
const port = 3006;



app.listen(port, () => {
  console.log(`Media service is running on port ${port}`);
})