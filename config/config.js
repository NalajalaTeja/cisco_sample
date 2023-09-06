const { Storage } = require('@google-cloud/storage');
const path = require('path');
const keyFilename = path.join(__dirname, './gcpservice-account-key.json');
const storage = new Storage({ keyFilename });
const bucket = storage.bucket('configuration_json');
const _=require('lodash');
/**
   * @desc Function to read the config file's contents from GCS.
   * @param nothing
   * @return bool - success or failure
   */

async function gcp_Read_Configuration() {
    try { 
      const currentConfig = global?.gConfig || { old: {}, new: {} };
      var stream = await bucket.file('gcp.json').createReadStream();
      var configFileData = '';
      stream.on('data', function (chunk) {
        configFileData += chunk;
      })
      return new Promise((resolve, reject) => {
        stream.on('end', () => {
          // console.log("End Gcp config File read ==========>", configFileData);
          const parsedConfig = JSON.parse(configFileData); // Parse the JSON data

          // const parsedConfig = JSON.parse(Buffer.concat(configFileData).toString()); // Parse the JSON data
          // if (!global?.gConfig || (JSON.stringify(parsedConfig) !== JSON.stringify(global.gConfig)))

          if (JSON.stringify(currentConfig.new) !== JSON.stringify(parsedConfig))
           {
            console.log('Config file updated.');
            currentConfig.old = currentConfig.new; 
            currentConfig.new = parsedConfig; 
            global.gConfig = currentConfig;
            console.log("After Updated config=====>", global.gConfig);
          } else {
            console.log("No updation required for configuration");
          }
          return resolve(global.gConfig);
        });
        
        stream.on('error', (error) => {
          return reject(error);
        });
      });
    } catch (error) {
      return reject(error);
    }
  
}

module.exports = {
  gcp_Read_Configuration,
};
