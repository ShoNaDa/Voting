pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract VotingContract {
    address owner;
    uint256 public commission;

    struct Candidate {
        address addressCandidate;
        uint256 voices;
    }

    struct Voting {
        Candidate[] candidates;
        uint256 dateOfCreateVoting;
        address[] voters;
        bool isActive;
        uint256 fund;
    }
    Voting[] public votings;

    constructor() {
        owner = msg.sender;
    }

    function CreateVoting(address[] memory _candidates) public {
        require(msg.sender == owner, "You not owner");

        address[] memory _voters;

        //добавление нового голосования
        votings.push();
        for (uint256 i = 0; i < _candidates.length; i++) {
            votings[votings.length - 1].candidates.push(
                Candidate(_candidates[i], 0)
            );
        }
        votings[votings.length - 1].dateOfCreateVoting = block.timestamp;
        votings[votings.length - 1].voters = _voters;
        votings[votings.length - 1].isActive = true;
        votings[votings.length - 1].fund = 0;
    }

    function Vote(uint256 _indexVoting, uint256 _indexCandidate)
        public
        payable
    {
        require(
            _indexVoting < votings.length,
            "There is no voting with such an index"
        );
        require(
            _indexCandidate < votings[_indexVoting].candidates.length,
            "A candidate with such an index was not found"
        );

        bool isVoted = false;
        for (uint256 i = 0; i < votings[_indexVoting].voters.length; i++) {
            if (votings[_indexVoting].voters[i] == msg.sender) {
                isVoted = true;
            }
        }

        require(!isVoted, "You voted");
        require(
            msg.value == 10000000000000000,
            "You haven't deposited 0.01 ETH"
        );
        require(votings[_indexVoting].isActive == true, "Voting is not active");

        //добавил голос кандидату и указал, что данный адрес проголосовал
        votings[_indexVoting].candidates[_indexCandidate].voices++;
        votings[_indexVoting].voters.push(msg.sender);
        votings[_indexVoting].fund += msg.value;
    }

    function EndTheVote(uint256 _indexVoting) public payable {
        require(
            _indexVoting < votings.length,
            "There is no voting with such an index"
        );
        require(votings[_indexVoting].isActive == true, "Voting is not active");

        //проверяем кто набрал больше голосов
        address winer;
        uint256 maxVoice = 0;
        uint256 indexWiner;

        for (uint256 i = 0; i < votings[_indexVoting].candidates.length; i++) {
            if (votings[_indexVoting].candidates[i].voices > maxVoice) {
                maxVoice = votings[_indexVoting].candidates[i].voices;
                winer = votings[_indexVoting].candidates[i].addressCandidate;
                indexWiner = i;
            }
        }

        bool winnerIsOne = true;

        //проверяем - нет ли еще одного человека с таким количеством голосов
        for (
            uint256 i = indexWiner;
            i < votings[_indexVoting].candidates.length;
            i++
        ) {
            if (
                votings[_indexVoting].candidates[i].voices == maxVoice &&
                i > indexWiner
            ) {
                winnerIsOne = false;
                break;
            }
        }

        require(
            winnerIsOne,
            "It's impossible to determine the winner, the voting must continue"
        );

        //завершили голосование
        votings[_indexVoting].isActive = false;

        //отправляем деньги победителю
        payable(winer).transfer((votings[_indexVoting].fund * 90) / 100);
        commission += (votings[_indexVoting].fund * 10) / 100;

        require(
            (block.timestamp - votings[_indexVoting].dateOfCreateVoting) >
                259200,
            "3 days haven't passed yet"
        );
    }

    function WithdrawCommission(uint256 _sum) public payable {
        require(msg.sender == owner, "You not owner");
        require(commission >= _sum, "The commission is less");

        payable(owner).transfer(_sum);
        commission -= _sum;
    }

    function GetVoting(uint256 _indexVoting)
        public
        view
        returns (
            Candidate[] memory,
            uint256,
            address[] memory,
            bool,
            uint256
        )
    {
        require(
            _indexVoting < votings.length,
            "There is no voting with such an index"
        );

        return (
            votings[_indexVoting].candidates,
            votings[_indexVoting].dateOfCreateVoting,
            votings[_indexVoting].voters,
            votings[_indexVoting].isActive,
            votings[_indexVoting].fund
        );
    }
}
