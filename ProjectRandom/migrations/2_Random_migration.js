const Random = artifacts.require("Random");
const BigNumber = require('bignumber.js');
var randomValue = 0;
var totalGain;

module.exports = function(deployer, networks, accounts) {
  deployer.deploy(Random).then(async function(instance){
    await instance.initialDeposit({from: accounts[0], value: web3.utils.toWei("0.1", "ether")});
  });
}
