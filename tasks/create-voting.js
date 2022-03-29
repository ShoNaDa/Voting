module.exports = function () {
    task("create-voting", "Create a new vote")
        .addParam("addresses", "Addresses of candidates")
        .setAction(async (taskArgs) => {
            Votings = await ethers.getContractFactory("VotingContract");
            votings = await Votings.attach('0x519f18A62F32EcCb3F375C0EDe7B14274E3Fe3Fe');
            provider = waffle.provider;
            
            let addresses = taskArgs.addresses.split(" ");

            await votings.CreateVoting(addresses);
            console.log(`Голосование успешно создано`);
        });
};