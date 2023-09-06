const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const nocache = require('nocache');
require('dotenv').config();
// const configFile = require("./config");

//* **************cache handelling**************8 */

app.use(nocache());
app.disable('view cache');
app.set('etag', false);

//* **************cache handelling**************8 */

app.use(cors());
app.use(morgan('dev', {}));
app.use(express.json({ limit: '10mb' }));
require("./cron_schedular/job_schedular");

// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError) {
      return res.status(400).send({ status: 400, success: false, message: 'Bad request.' });
    }
    next();
  });

  process
  .on('unhandledRejection', (reason, p) => {
   console.error(`Unhandled Rejection at: Promise', ${p}, reason: ${reason}`);
    process.exit(1);
    // application specific logging, throwing an error, or other logic here
  })
  .on('uncaughtException', (err) => {
   console.error(`${new Date().toUTCString()} uncaughtException:${err.message}`);
   console.error(`${err.stack}`);
    process.exit(1);
  });

      try {
        app.listen(7000, async () => {
          try {            
            let output = await require('./config/config').gcp_Read_Configuration();
            app.get('/config',(req,res)=>{
             try {
               return res.status(200).send(global.gConfig)
             } catch (error) {
               return res.status(500).send({
                 status:false,
                 message:"Internal server error"
               })
             }
            })
            console.log(`Server is running on port: 7000`);
          } catch (error) {
            console.log('Could not connect to the config server: ', error);
          }
        });
      } catch (e) {
        console.error(`Server is not responding.${e}`);
      }
   
  