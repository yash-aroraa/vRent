// specific version of solidity
pragma solidity ^0.4.17;

// this contract used to deploy and manage other contracts
//this contract deployed only once by website host
contract FactoryRent{
  // records of Rent Contract deployed
  address[] public RentDeployed;
  // Records of managers who deployed Rent Contract
  mapping(address => address[]) managerContractList;
  // true if manager exists
  mapping(address => bool) managerList;
  // no managers which are lessor
  uint public managerCount;
 // constructor
  function FactoryRent() public {
    managerCount = 0;// initial value
  }

  // function for creating Rent Contract by manager
  function createRent(uint sec,string desc,uint rnt,string nme) public returns(address){
    address newRent = new Rent(sec,desc,rnt,nme,msg.sender);
    RentDeployed.push(newRent);
    managerContractList[msg.sender].push(newRent);
    if(!managerList[msg.sender]){
      managerCount++;
    }
    managerList[msg.sender] = true;
    return newRent;
  }

  // only manager can delete this contract
  // its updates managerContractList after deleting Rent Contract
  function deleteRent(address toDelete) public {
    require(managerList[msg.sender]);
    bool flag = false;
    for(uint i = 0;i<managerContractList[msg.sender].length;i++){
        if(managerContractList[msg.sender][i]==toDelete){
          flag = true;
          if(managerContractList[msg.sender].length == 1){
            managerCount--;
            managerContractList[msg.sender].length--;
          }
          else{
            managerContractList[msg.sender][i] = managerContractList[msg.sender][managerContractList[msg.sender].length - 1];
            managerContractList[msg.sender].length--;
          }
          break;
        }
    }
    require(flag);
    uint index;
    // now delete from list of deployed rent contracts
    for(uint j = 0;j<RentDeployed.length;j++){
      if(RentDeployed[j]==toDelete){
        index = j;
      }
    }
    if(RentDeployed.length>1){
      RentDeployed[index] = RentDeployed[RentDeployed.length-1];
    }
    RentDeployed.length--;
  }

  // get all deployed Rent Contract
  function returnDeployedList() public view returns (address[]){
    return RentDeployed;
  }
  // check manager exists or not
  function searchManager(address mngr) public view returns(bool){
    return managerList[mngr];
  }
  // list of all contracts deployed by manager
  function getManagerContracts(address mngr) public view returns(address[]){
    return managerContractList[mngr];
  }

}

// main contract which handles all information about renting vehicle
//this contract distribute money to managers and renters
contract Rent{
  address public manager;// who deployed this contract
  string name;// short name of Vehicle
  uint public security;// security money
  int public availability;//-1:maintenance 0:rented 1:available
  string public description; // full description about vehicle
  address[] public pastRents;// list of people who rented this vehicle
  uint public popularity;// how many times vehicle rented
  uint public rentPerDay;
  string public rentingTime;//time at which he take vehicle at rent
  uint public timeOfRent;// amount of time for rent

  // restrict permissions only manager can access
  modifier restricted() {
      require(msg.sender == manager);
      _;
  }

  // constructor to set initial properties
  function Rent(uint sec,string desc,uint rnt,string nme,address creator) public{
    security = sec;
    name = nme;
    manager = creator;
    description = desc;
    availability = 1;
    popularity = 0;
    rentPerDay = rnt;
    rentingTime = "";
    timeOfRent = 0;
  }

  // take vehicle on rent
  // this method send money to contract
  function takeRent(uint dys,string currentTime) public payable{
    uint total = dys*rentPerDay+security;
    require(msg.value>=total);
    require(availability == 1);
    timeOfRent = dys;
    rentingTime = currentTime;
    availability = 0;
    popularity++;
    pastRents.push(msg.sender);
  }

  // manager can edit details about vehicle
  function editDetails(string newname,uint newsecurity,string newDescription,uint newrentPerDay) public restricted{
    name = newname;
    security = newsecurity;
    description = newDescription;
    rentPerDay = newrentPerDay;
  }

// return security amount to tenant
// rentpay send to manager of contract
  function returnSecurity() public {
    uint len = pastRents.length;
    require(msg.sender == pastRents[len-1]);
    msg.sender.transfer(security);
    manager.transfer(address(this).balance);
    availability = 1;
    rentingTime = "";
    timeOfRent = 0;
  }
  
// get short name of the vehicle
  function getName() public  view returns(string){
    return name;
  }

  //get the person currently leasing the vehicle
  function getCurrentLessor() public view returns(address){
    uint len = pastRents.length;
    if(len == 0){
      return 0;
    }
    else{
      return pastRents[len-1];  
    }
  }

  function takeOnMaintenance() public restricted{
    availability = -1;
  }
  
  function returnFromMaintenance() public restricted{
    availability = 1;
  }

  // to deduct certain amount of money from security
  function cutSecurity(uint amountTobeDeduct) public{
    uint len = pastRents.length;
    require(msg.sender == pastRents[len-1]);
    if(amountTobeDeduct<security){
      msg.sender.transfer(security - amountTobeDeduct);
    }
    manager.transfer(address(this).balance);
    availability = 1;
    rentingTime = "";
    timeOfRent = 0;
  }

// to get all details about contract
  function getSummary() public view returns (
    address, uint, int, string, uint, uint,string
    ) {
      return (
        manager,
        security,
        availability,
        description,
        popularity,
        rentPerDay,
        name
        );
    }

}
