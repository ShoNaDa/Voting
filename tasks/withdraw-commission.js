module.exports = function () {
    task("withdraw-commission", "Withdraw commission")
        .addParam("amount", "Withdrawal amount")
        .setAction(async (taskArgs) => {
            Votings = await ethers.getContractFactory("VotingContract");
            votings = await Votings.attach('0x519f18A62F32EcCb3F375C0EDe7B14274E3Fe3Fe');
            provider = waffle.provider;

            await votings.WithdrawCommission(taskArgs.amount);
            console.log(`Комиссия в размере ${taskArgs.amount} успешно списана`);
        });
};