import "./Ownable.sol";

pragma solidity 0.5.12;

contract Random is Ownable{

  uint public netContractBalance = 0;
  uint public actualContractBalance = 0;
  uint public transferAmount = 0;

  string private encoding = "random_strig";

  struct balance {
    uint totalGain;
    uint betNumber;
    uint lastRandomValue;
  }

  mapping (address => balance) public customer;

  function verifyOwner() public view returns(bool){
    bool ownerTest = false;
    if(msg.sender == owner){
      ownerTest = true;
    }
    return ownerTest;
  }

  function getRandomValue() public view returns(uint){
    return customer[msg.sender].lastRandomValue;
  }

  function initialDeposit()public payable{
    netContractBalance += msg.value;
    actualContractBalance += msg.value;
  }

  function receiveBet(bool moreOnZero) public payable{
    customer[msg.sender].betNumber++;
    netContractBalance += msg.value;
    actualContractBalance += msg.value;
    customer[msg.sender].lastRandomValue = uint256(sha256(abi.encodePacked(now, customer[msg.sender].betNumber, encoding))) % 10;
    if((customer[msg.sender].lastRandomValue % 2 == 0 && moreOnZero)||(customer[msg.sender].lastRandomValue % 2 == 1 && !moreOnZero)){
      customer[msg.sender].totalGain += 2*msg.value;
      netContractBalance -= 2*msg.value;
    }
  }

  function withdrawAll() public onlyOwner{
      transferAmount = netContractBalance;
      actualContractBalance -= netContractBalance;
      netContractBalance = 0;
      msg.sender.transfer(transferAmount);
  }

  function payCustomer() public{
      transferAmount = customer[msg.sender].totalGain;
      customer[msg.sender].totalGain = 0;
      actualContractBalance -= transferAmount;
      msg.sender.transfer(transferAmount);
  }

  function getNetContractBalance() public view returns(uint){
    return netContractBalance;
  }

  function getActualContractBalance() public view returns(uint){
    return actualContractBalance;
  }

  function getTotalGain() public view returns(uint){
    return(customer[msg.sender].totalGain);
  }
}
