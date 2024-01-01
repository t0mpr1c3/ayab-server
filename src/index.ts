import 'reflect-metadata';
import * as express from 'express';
import * as cors from 'cors';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { json } from 'body-parser';

import routes from './routes/';
import { dataSource } from './data-source';

dataSource.initialize()
  .then(() => {
    const app = express();

    // Set up middleware
    app.use(cors());
    app.use(helmet());
    app.use(json());
  
    // Set all routes from routes folder
    app.use("/", routes);
  
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });

    console.log('Data source has been initialized')
  })
  .catch(error => console.log(error));