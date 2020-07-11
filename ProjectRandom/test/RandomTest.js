const Random = artifacts.require("Random");
const truffleAssert=require("truffle-assertions");
const BigNumber = require('bignumber.js');

contract("Random", async function(accounts){
    let instance;
    beforeEach(async function(){
      instance = await Random.deployed()
    });
  });
