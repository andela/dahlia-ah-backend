import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import errorhandler from 'errorhandler';
import debug from 'debug';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import routes from './routes';

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();
const log = debug('dev');

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(require('method-override')());

app.use(express.static(`${__dirname}/public`));


if (!isProduction) {
  app.use(errorhandler());
}

app.use('api/v1/', routes);

app.get('/', (req, res) => {
  res.send({
    status: 200,
    message: 'Welcome to Author\'s Haven'
  });
});

const documentation = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

// setup swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(documentation));

app.use('/api/v1', routes);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res) => {
    log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  log(`Listening on port ${server.address().port}`);
});

export default app;
