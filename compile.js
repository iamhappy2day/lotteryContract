const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
console.log(contractPath)
const source = fs.readFileSync(contractPath, 'utf8');
console.log(solc.compile(source, 1).contracts[':Lottery'])

module.exports = solc.compile(source, 1).contracts[':Lottery']

