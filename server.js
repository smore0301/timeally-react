const express = require('express');
const path = require('path');

const app = express();

app.use(function(req,res,next) {
  if(req.headers["x-forwarded-proto"] == "http") {
    res.redirect("https://www.timeally.io" + req.url);
  } else {
    return next();
  }
});

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

// app.get("*", function(request, response){
//   response.redirect("https://" + request.headers.host + request.url);
// });

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on PORT ${port}`));
