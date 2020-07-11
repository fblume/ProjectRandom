import "./Ownable.sol";

pragma solidity 0.5.12;

contract Random is Ownable{

  uint public balance = 0;

  function random(bytes memory n) public view onlyOwner returns(uint){
    return uint256(keccak256(n)) % 10;
  }

  function receiveMoney() public payable{
    balance += msg.value;
  }

  function sendMoney(uint transferAmount) public{
      balance -= transferAmount;
      msg.sender.transfer(transferAmount);
  }

  function getBalance() public view returns(uint){
    return balance;
  }

}
