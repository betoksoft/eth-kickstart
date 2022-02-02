const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');


const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(contractPath, 'utf8');


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

fs.ensureDirSync(buildPath);

const compileOutput = JSON.parse(solc.compile(JSON.stringify(input))).contracts['Campaign.sol'];

const contractKeysInCompileOutput = Object.keys(compileOutput);

for(const contract in contractKeysInCompileOutput) {
  fs.outputJsonSync(
        path.resolve(buildPath, contractKeysInCompileOutput[contract] + '.json'),
        compileOutput[contractKeysInCompileOutput[contract]]
    );
  
}

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  'Campaign.sol'
].Campaign;
