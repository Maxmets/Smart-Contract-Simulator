let firstClick = true;
let absoluteV = false;
let actionsArray = []; 
let prevResult = 0;
let numberString = ""; 
let number = 0;
let result = 0; 
let resultFromBlockChain = "";

//Initializes the main component of the blockchain application 
//Here we are using Truffle and their local blockchain application (Ganache)
//Majority of the blockchain code was references from the Truffle Suite Tutorial 
//That can be found at : https://trufflesuite.com/tutorial/index.html
//Here we are using the tutorial to get the truffle smart contract code and then
//connect our own application to the smart contract (truffle + ganache) environment


//Creates the blockchain smart contract application 
App = {
    web3Provider: null,
    contracts: {},

    //Initializes the web3 client on the web browser
    initial: async function() {
        

        return await App.initWeb3();
    },

    //Checks if web3 is present on the user's web browser 
    //For our demo we are using MetaMask to accomplish 
    //transactions between our user and the blockchain client
    initWeb3: async function() {
        // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("in the try method");
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
  
        web3 = new Web3(App.web3Provider);
        return App.initContract();
      },

      //Here we are initializing the contract that will be paid for by the user 
      //We are generating the details of the contract from the Calculations.json 
      //Which gathered the details from Calculations.Sol 
      initContract: function() {
        $.getJSON('Calculations.json', function(data) {
          // Get the necessary contract artifact file and instantiate it with @truffle/contract
          var calculationsArtifact = data;
          App.contracts.Calculations = TruffleContract(calculationsArtifact);
          // Set the provider for our contract
          App.contracts.Calculations.setProvider(App.web3Provider);
        });

      },

      //Here we are making the transaction occur 
      //Our contract has been made and is now connecting to 
      //the ganache blockchain and grabbing the payment for the 
      //transaction from there. Then we are using MetaMask as the 
      //middle man for the transaction to occur. 
      addContractToBlockChain: function(resultNumber) {
       // event.preventDefault();
    
       var resultNum = resultNumber;
       resultFromBlockChain = resultNum;
        var calculationInstance;
    
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Calculations.deployed().then(function(instance) {
        
        calculationInstance = instance;
        console.log(calculationInstance.abi[2].outputs[0].name);

        return calculationInstance.resultCalc(resultNum, {value: web3.utils.toWei("1.1", "ether"),from: account});
      }).then(function(result) {
        return true;
      }).catch(function(err) {
        console.log(err.message);
      });
    });
      },
}

//Below are all the functions for the working calculator. 



//Code to control the logic of a button that is being pressed on the calculator
function buttonPress(value)
{ 
    if(firstClick)
    {
    document.getElementById("display").innerHTML = null;
    firstClick = false; 
    }

    if(value === "÷") {
        value = "/";
    }
    
    if(value === "0" || value ==="." || Number(value)){
        numberString += value;
        updateDisplay(value);
    }
    else if (value === "abs")
    {
        absoluteV = !absoluteV;
        if (absoluteV) {
            document.getElementById("absoV").style.backgroundColor = "lightgreen";
        } else {
            document.getElementById("absoV").style.backgroundColor = "";
        }
    }
    else if(value === "x" || value === "+" || value === "-" || value === "/" ){
        if(prevResult == 0)
            {
            number = +numberString;
            actionsArray.push(number);  
            }
        // else {
            
        // }
        actionsArray.push(value);
        number = 0;
        console.log("Number after: " + number);
        numberString = "";
        console.log(actionsArray);
        updateDisplay(value);
    }
    else if (value === "%")
        {
            percentage(); 
            //reset(); 
        }
    else if(value === "C")
        {
            reset();
            prevResult = 0;
        }
    else if(value === "=")
        {
            number = +numberString;
            console.log("Number equals: " + number);
            actionsArray.push(number);
            number = result;
            console.log("Number if: " + number);
            numberString = "";
            console.log(actionsArray);
            equalSign();
            resetVals();
        }
}


//Resets the calculator to the default state 
function reset(){
    document.getElementById("display").innerHTML = 0;
    document.getElementById("prevCalcs").textContent = null;
        resetVals();
        actionsArray = []; 
        prevResult = 0;
        console.log(result);
        console.log(prevResult); 
        console.log(actionsArray); 
    }

//Used to perform the percentage button functionality
function percentage() {
    number = +numberString;
    result = number / 100;
    console.log(result);
    resetDisplay();
    updateDisplay(result);
}

//Resets the values after the equals (=) button is pressed
function resetVals(){
    firstClick = true;
    absoluteV = false;
    document.getElementById("absoV").style.backgroundColor = "";
    number = 0;
    numberString = "";
    if(prevResult != 0)
        {
        actionsArray = [prevResult];
      
        }
    else {
    actionsArray = [];  
    }
  
    result = 0; 
}


//Functionality that is used to calculate the result of the inputted values 
function equalSign() { 
    result = actionsArray[0]; 
        console.log(actionsArray);
        
        for(let i = 1; i < actionsArray.length; i+=2)
            {
                if(actionsArray[i] == "+")
                    {
                        result += actionsArray[i+1];
                    }
                if(actionsArray[i] == "-")
                    {
                        result -= actionsArray[i+1];
                    }
                if(actionsArray[i] == "x")
                    {
                        result *= actionsArray[i+1];
                    }
                if(actionsArray[i] == "/")
                    {
                        result /= actionsArray[i+1];
                    }
                
                
            }
        
            
                //result += prevResult;
                if (absoluteV && result < 0) {
                    result *= -1;
                }
                prevResult = result; 
                actionsArray = []; 
                actionsArray.push(prevResult);
                console.log(typeof (result));
                addPrevCalcs(result);
                resetDisplay();
                //should add the contract here 
                App.addContractToBlockChain(result.toString());
                console.log("Blockchain Result is: " + resultFromBlockChain);
                updateDisplay(resultFromBlockChain);
                console.log(actionsArray);
    }


//Code used to update the display after each click and the result is found 
function updateDisplay(value){ 
    console.log(typeof(+value));
    numValue = +value;
if(typeof(numValue) === "number")
    {
        //console.log(document.getElementById("display").value);
        document.getElementById("display").innerHTML = document.getElementById("display").value.concat(value);
    }

}

//Resets the display 
function resetDisplay(){
    document.getElementById("display").innerHTML = null;
}

//Functionality to remember the user's previous questions and results
function addPrevCalcs(result) {
    let displayContents = document.getElementById("display").innerHTML;
    if (absoluteV) {
        displayContents = "| " + displayContents + " |";
    }
    console.log("I arrived: " + displayContents);
    document.getElementById("prevCalcs").setAttribute("style", "white-space: pre;");
    if (document.getElementById("prevCalcs").textContent !== undefined) {
        document.getElementById("prevCalcs").textContent += "\r\n" + displayContents + " = " + result;
        console.log("I have arrived");
    } else {
        let value = (document.getElementById("prevCalcs").textContent = "" + displayContents + " = " + result);
        document.getElementById("prevCalcs").textContent = value;
        console.log("I not have arrived: " + document.getElementById("prevCalcs").textContent);
    }
}


//Immediately invoked funtion that runs when the program is started 
//Runs the initialization of the app in order to allow us to use 
//Metamask connection with the our calculator app. 
(function() {
    (function() {
      App.initial();
    })();
  })();