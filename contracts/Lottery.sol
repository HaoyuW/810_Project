pragma solidity ^0.5.6;

contract Lottery {
    address public manager;
    address payable []  public  players;
    address payable public winner; 
    
    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);        
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        winner = players[index];
        winner.transfer(address(this).balance);
        players.length =0;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayerCnt() public view returns (uint) {
        return players.length;
    }
}
