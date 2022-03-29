module.exports = function () {
    task("balance", "Get the balance at the specified address")
        .addParam("address", "Any address")
        .setAction(async (taskArgs) => {
            Votings = await ethers.getContractFactory("VotingContract");
            votings = await Votings.attach('0x519f18A62F32EcCb3F375C0EDe7B14274E3Fe3Fe');
            provider = waffle.provider;

            console.log(`Баланс: ${Number(await provider.getBalance(taskArgs.address))}`);
        });
};