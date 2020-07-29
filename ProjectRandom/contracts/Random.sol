import "./Ownable.sol";
import "./provableAPI.sol";

pragma solidity 0.5.12;

contract Random is Ownable, usingProvable{

  uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
  uint256 public latestNumber;

  event LogNewProvableQuery(string description);
  event generateRandomNumber(uint256 randomNumber, bytes32 callbackQueryId);

  uint public netContractBalance = 0;
  uint public actualContractBalance = 0;
  uint public transferAmount = 0;

  string private encoding = "random_strig_1wdsfgbj";

  struct customerInfo {
    uint totalGain;
    uint betNumber;
    bytes32 lastQueryId;
    bool lastMoreOnZero;
    uint lastValueSent;
  }

  mapping (address => customerInfo) public customer;
  mapping (bytes32 => address) public addressOfQueryId;

  function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public{
      uint lastValue;
      bool moreOnZero;
      require(msg.sender == provable_cbAddress());
      uint256 randomNumber = uint256(sha256(abi.encodePacked(_result, customer[addressOfQueryId[_queryId]].betNumber, encoding))) % 10;
      lastValue = customer[addressOfQueryId[_queryId]].lastValueSent;
      moreOnZero = customer[addressOfQueryId[_queryId]].lastMoreOnZero;
      if((randomNumber % 2 == 0 && moreOnZero)||(randomNumber % 2 == 1 && !moreOnZero)){
        customer[addressOfQueryId[_queryId]].totalGain += 2*lastValue;
        netContractBalance -= 2*lastValue;
      }
      emit generateRandomNumber(randomNumber, _queryId);
  }

  function receiveBet(bool moreOnZero) payable public{
    uint256 QUERY_EXECUTION_DELAY = 0;
    uint256 GAS_FOR_CALLBACK = 200000;
    customer[msg.sender].lastMoreOnZero = moreOnZero;
    customer[msg.sender].betNumber++;
    netContractBalance += msg.value;
    actualContractBalance += msg.value;
    bytes32 queryId = provable_newRandomDSQuery(QUERY_EXECUTION_DELAY, NUM_RANDOM_BYTES_REQUESTED, GAS_FOR_CALLBACK);
    //bytes32 queryId = bytes32(sha256(abi.encodePacked(customer[msg.sender].betNumber, msg.sender)));
    addressOfQueryId[queryId] = msg.sender;
    customer[msg.sender].lastQueryId = queryId;
    customer[msg.sender].lastValueSent = msg.value;
    emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
    //__callback(queryId, "1", bytes("test"));
  }

  function verifyOwner() public view returns(bool){
    bool ownerTest = false;
    if(msg.sender == owner){
      ownerTest = true;
    }
    return ownerTest;
  }

  function getQueryId() public view returns(bytes32){
    return(customer[msg.sender].lastQueryId);
  }

  function initialDeposit()public payable{
    netContractBalance += msg.value;
    actualContractBalance += msg.value;
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
