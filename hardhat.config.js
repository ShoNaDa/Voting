const Balance = require("./tasks/balance");
const CreateVoting = require("./tasks/create-voting");
const Vote = require("./tasks/vote");
const CloseVote = require("./tasks/close-vote");
const WithdrawCommission = require("./tasks/withdraw-commission");
const GetVoting = require("./tasks/get-voting");

require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('solidity-coverage');

const ALCHEMY_API_KEY = process.env.API_KEY;
const RINKEBY_PRIVATE_KEY = process.env.PRIVATE_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

//Таски из других файлов
Balance();
CreateVoting();
Vote();
CloseVote();
WithdrawCommission();
GetVoting();

module.exports = {
  solidity: "0.7.3",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${RINKEBY_PRIVATE_KEY}`]
    }
  }
};