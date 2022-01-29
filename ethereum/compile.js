const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const CONTRACT_FILE_NAME = 'Campaign.sol'

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
const campaignPath = path.resolve(__dirname, 'contracts', CONTRACT_FILE_NAME);
const source = fs.readFileSync(campaignPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];
fs.ensureDirSync(buildPath); // check if build exists, if not create one.\

for(let contract in output) {
  fs.outputJSONSync( 
    path.resolve(buildPath, contract + '.json'), 
    output[contract]
  );
}