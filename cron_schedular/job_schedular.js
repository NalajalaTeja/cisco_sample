const { Storage } = require('@google-cloud/storage');
const path = require('path'); 
const keyFilename = path.join(__dirname, '../config/gcpservice-account-key.json');
const storage = new Storage({ keyFilename });
const bucketName = storage.bucket('configuration_json');
const schedule = require('node-schedule');
const fileName = 'gcp.json';
const config = require('../config/config')
const fs = require('fs');
const uploadJSON = require('../demo.json');

// Schedule a periodic task to check for updates (e.g., every min).
schedule.scheduleJob('* * * * *', async () => {
    try {
        console.log("Before job schedular configiration we have=====>",global.gConfig);
         await uploadJSONToBucket( uploadJSON);// preodic changes
         await config.gcp_Read_Configuration() // read / check new update JSON on bucket
    } catch (error) {
      console.error('Error reading or parsing the config file:', error);
    }
  
  });

/**
   * @desc Function to read the config file's contents from GCS.
   * @param nothing
   * @return bool - success or failure
   */
async function uploadJSONToBucket(jsonObject) {
  // console.log("jsonObjectjsonObject,",jsonObject, bucketName,fileName)
  const bucket = bucketName;
  const file = bucket.file(fileName); // Use the desired file name

  // Convert the JSON object to a string
  const jsonString = JSON.stringify(jsonObject);

  // Create a write stream to the file and set the option to overwrite
  const stream = file.createWriteStream({
    metadata: {
      contentType: 'application/json', // Set the content type to JSON
    },
    resumable: true, // Disable resumable uploads to ensure overwriting
    predefinedAcl: 'publicRead', // Set ACL if needed
  });

  stream.on('error', (error) => {
    console.error('Error uploading JSON:', error);
    throw error;
  });

  // Write the JSON data to the file
  stream.end(jsonString);
  
  // Return a promise to indicate when the upload is complete
  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log(`JSON uploaded successfully and overwritten: ${fileName}`);
      resolve();
    });
  });
}






// Initial read of the config file.

// readConfigFile().then((configData) => {

//      config = JSON.parse(configData);

//     // console.log('Initial config:', config);

//   })

//   .catch((error) => {

//     console.error('Error reading or parsing the initial config file:', error);

//   });

 