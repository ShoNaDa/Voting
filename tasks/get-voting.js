module.exports = function () {
    task("get-voting", "Get information about voting")
        .addParam("index", "Voting index")
        .setAction(async (taskArgs) => {
            Votings = await ethers.getContractFactory("VotingContract");
            votings = await Votings.attach('0x519f18A62F32EcCb3F375C0EDe7B14274E3Fe3Fe');
            provider = waffle.provider;

            console.log(`Информация о голосовании:\n 
            ${await votings.GetVoting(taskArgs.index)}`);
        });
};