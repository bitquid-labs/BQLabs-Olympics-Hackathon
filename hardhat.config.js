require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
  },
  networks: {
    hardhat: {},
    goerli: {
      url: "https://sepolia.infura.io/v3/",
      accounts: [
        "06ca4b83f3a7f67bd98e4f7bf71d5d8c930218f04eebc9920b5d6bf17a721539",
      ],
    },
  },
};
