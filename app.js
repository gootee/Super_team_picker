const knex = require("./db/client");
const express = require('express');
const logger = require('morgan');
const path = require('path');
const methodOverride = require('method-override');
const app = express();

app.use(express.urlencoded({ extended: true }));

console.log(__dirname);
app.use(express.static(path.join(__dirname, 'public')));

const cohortRouter = require("./routes/cohorts")
// const rootRouter = require("./routes/root");
// const articlesRouter = require("./routes/articles");

app.use(methodOverride((req, res) => {
  if (req.body && req.body._method) {
    const method = req.body._method
    return method;
  }
}))

//  -= MIDDLEWARE =-

app.use(logger('dev'));

// app.set allows us to change settings in our express app

// app.use(function(req, res, next) {
//   const url = req.url;

//   // check to see if user is trying to go to /contact_us
//   if(url === '/contact_us') {
//     // check to see if user is logged in
//     if(res.locals.username) {
//       next(); // if the user is logged in then they can visit /contact_us
//     } else {
//       res.redirect('/'); //otherwise they get redirected to the root path
//     }
//   }
//   next();
// })
app.get("/", (req, res) => {
  res.render('./cohorts/welcome');
})

app.set('view engine', 'ejs'); // here we are telling express to render tempaltes using ejs

app.use("/cohorts", cohortRouter);
// app.use(rootRouter);
// app.use("/articles", articlesRouter);

const PORT = 4546;
const ADDRESS = 'localhost';

app.listen(PORT, ADDRESS, () => {
  console.log(`Express Server started on ${ADDRESS}:${PORT}`);
});