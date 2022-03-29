module.exports = function () {
    task("vote", "Vote for a candidate")
        .addParam("votingIndex", "Voting index")
        .addParam("candidateIndex", "Candidate index")
        .setAction(async (taskArgs) => {
            Votings = await ethers.getContractFactory("VotingContract");
            votings = await Votings.attach('0x519f18A62F32EcCb3F375C0EDe7B14274E3Fe3Fe');
            provider = waffle.provider;

            await votings.Vote(taskArgs.votingIndex, taskArgs.candidateIndex,
                { value: ethers.utils.parseEther("0.01") });
            console.log(`Спасибо за голосование`);
        });
};