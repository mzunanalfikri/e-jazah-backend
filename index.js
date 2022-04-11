const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 8080;
// const programmingLanguagesRouter = require('./src/routes/programmingLanguages.route');
const testingRouter = require('./src/routes/testing.route')
const userRouter = require('./src/routes/user.route')
const ijazahRouter = require('./src/routes/ijazah.route')

app.use(bodyParser.json());
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.json({'message': 'ok'});
})

app.use('/', userRouter)
app.use('/ijazah', ijazahRouter)
app.use('/testing', testingRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});
  
  return;
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
