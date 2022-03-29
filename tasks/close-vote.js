module.exports = function () {
    task("close-vote", "End the vote")
        .addParam("index", "Voting index")
        .setAction(async (taskArgs) => {
            Votings = await ethers.getContractFactory("VotingContract");
            votings = await Votings.attach('0x519f18A62F32EcCb3F375C0EDe7B14274E3Fe3Fe');
            provider = waffle.provider;

            await votings.EndTheVote(taskArgs.index);
            console.log(`Голосование успешно завершено`);
        });
};