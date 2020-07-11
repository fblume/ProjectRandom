const Random = artifacts.require("Random");
const BigNumber = require('bignumber.js');

module.exports = function(deployer, networks, accounts) {
  deployer.deploy(Random).then(async function(instance){
    await instance.receiveMoney({from: accounts[1], value: web3.utils.toWei("4", "ether")});
    await instance.sendMoney(accounts[3], 1000000, {from: accounts[0]});
  });
}
