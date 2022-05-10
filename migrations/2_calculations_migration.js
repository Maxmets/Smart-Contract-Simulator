const Calculations = artifacts.require("Calculations");

module.exports = function (deployer) {
  deployer.deploy(Calculations, 0);
  // .then( async () => {
    // let ins = await Calculations.deployed();
    // console.log("Printing result initially: " + ins.getResult());
  
    // // ins.resultCalc(5, {value: web3.utils.toWei("1.1","ether"), from: accounts[1]})
    // console.log("Printing result after calculation: " + ins.getResult());
  // };
  
};
