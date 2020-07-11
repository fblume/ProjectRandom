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

  function sendMoney(address payable customerAddress, uint transferAmount) public onlyOwner returns(uint){
      transferAmount = transferAmount*1000000000000;
      balance -= transferAmount;
      customerAddress.transfer(transferAmount);
      return(transferAmount);
  }

  function getBalance() public view returns(uint){
    return balance;
  }

}
