// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


//Contract that will be used in the application 
//This is the contract that will be stored in the
//Ganache blockchain
contract Calculations { 

    string[] allResults; 
    uint resultNumInt;
    string resultNum = "";
    address owner;


    constructor(uint resultFromCalc) {
    resultNumInt = resultFromCalc;
    owner = msg.sender; 
    // resultCalc(resultNumInt, {value: web3.utils.toWei("1.1","ether"), from: owner});
    }

    function resultCalc(string memory result) public payable { 
        require(msg.value > 1 ether && owner == msg.sender); //ins.resultCalc(5, {value: web3.utils.toWei("1.1","ether"), from: accounts[1]})
        //resultNum = uintToString(memory); 
        allResults.push(result);
        //return result;
    // return resultNum; 
    }

    function getResult() public view returns (string memory) {
        return resultNum;
    }
}