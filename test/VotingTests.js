const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Votings contract", function () {
    //деплой контракта 
    let Votings, votings, provider, owner, adr1, adr2;
    before(async function () {
        Votings = await ethers.getContractFactory("VotingContract");
        votings = await Votings.deploy();

        provider = waffle.provider;
        [owner, adr1, adr2] = await ethers.getSigners();
    });

    describe("CreateVoting()", function () {
        it("Checking for the creation of a new vote",
            async function () {
                //функция создания голосования
                await votings.CreateVoting([adr1.address, adr2.address]);

                //это нужно, чтоб разбить массив структур на части
                let parts = [];
                parts = String(await votings.GetVoting(0)).split(',');

                //проверяем заполнился ли массив нужными данными 
                //(добавились ли адреса кандедатов, которых мы добавили выше)
                expect(adr1.address).to.equal(parts[0]);
                expect(adr2.address).to.equal(parts[2]);
            });

        it("Checking owner",
            async function () {
                //вызывать функцию должен owner
                await expect(votings.connect(adr2).CreateVoting([adr1.address, adr2.address]))
                    .to.be.revertedWith("You not owner");
            });
    });

    describe("Vote()", function () {
        it("Checking whether the candidate's vote has been added",
            async function () {
                let parts = [];
                parts = String(await votings.GetVoting(0)).split(',');

                //функция голоса за кандидата
                await votings.Vote(0, 1, { value: ethers.utils.parseEther("0.01") });

                let newParts = [];
                newParts = String(await votings.GetVoting(0)).split(',');

                //проверяем прибавился ли голос
                expect(Number(parts[3]) + 1).to.equal(Number(newParts[3]));
                //проверяем добавился ли адрес проголосовавшего
                expect(owner.address).to.equal(newParts[newParts.length - 3]);
                //проверяем прибавился ли призовой фонд этого голосования
                expect(Number(parts[parts.length - 1]) + 10000000000000000)
                    .to.equal(Number(newParts[newParts.length - 1]));
            });

        it("Is there such a vote",
            async function () {
                //проверяем существует ли указанное голосование
                await expect(votings.Vote(1, 1, { value: ethers.utils.parseEther("0.01") }))
                    .to.be.revertedWith("There is no voting with such an index");
            });

        it("Is there such a candidate",
            async function () {
                //проверяем существует ли указанный кандидат в указанном голосовании
                await expect(votings.Vote(0, 5, { value: ethers.utils.parseEther("0.01") }))
                    .to.be.revertedWith("A candidate with such an index was not found");
            });

        it("Did this candidate vote",
            async function () {
                //проверяем, что пользователь еще не голосовал
                await expect(votings.Vote(0, 1, { value: ethers.utils.parseEther("0.01") }))
                    .to.be.revertedWith("You voted");
            });

        it("Cheking that the user has sent the required amount",
            async function () {
                //проверяем что пользователь отправил 0.1 ETH
                await expect(votings.connect(adr2).Vote(0, 1, { value: ethers.utils.parseEther("0.02") }))
                    .to.be.revertedWith("You haven't deposited 0.01 ETH");
            });

        it("Checking that voting is active",
            async function () {
                //получаем наше голосование
                var obj = await votings.votings(0);

                //проверяем активно ли голосование
                expect(true).to.equal(obj["isActive"]);
            });
    });

    describe("EndTheVote()", function () {
        it("Is there such a vote",
            async function () {
                //проверяем существует ли указанное голосование
                await expect(votings.EndTheVote(2))
                    .to.be.revertedWith("There is no voting with such an index");
            });

        it("Checking that 3 days have not passed",
            async function () {
                //проверяем, что 3 дня еще не прошло
                await expect(votings.EndTheVote(0))
                    .to.be.revertedWith("3 days haven't passed yet");
            });

        it("Checking whether it is possible to determine the winner",
            async function () {
                //отдаем голос за второго кандидата
                await votings.connect(adr1).Vote(0, 0, { value: ethers.utils.parseEther("0.01") });

                //проверяем, можно ли определить победителя
                await expect(votings.EndTheVote(0))
                    .to.be.revertedWith("It's impossible to determine the winner, the voting must continue");
            });
    });

    describe("WithdrawCommission()", function () {
        it("Checking owner",
            async function () {
                //вызывать функцию должен owner
                await expect(votings.connect(adr2).WithdrawCommission(0))
                    .to.be.revertedWith("You not owner");
            });

        it("Checking commission",
            async function () {
                //указаная сумма для вывода должна присутствовать
                await expect(votings.WithdrawCommission(1000))
                    .to.be.revertedWith("The commission is less");
            });

        it("Has the commission been transferred",
            async function () {
                //можем отправить только 0 :(
                await votings.WithdrawCommission(0)

                //проверяем был ли совершен перевод комиссии
                expect(0).to.equal(Number(await votings.commission()));
            });
    });

    describe("GetVoting()", function () {
        it("Is there such a vote",
            async function () {
                //проверяем существует ли указанное голосование
                await expect(votings.GetVoting(2))
                    .to.be.revertedWith("There is no voting with such an index");
            });
    });
});