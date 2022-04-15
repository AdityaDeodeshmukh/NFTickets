// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract Concert1 is ERC721URIStorage
{
    address payable owner;
    
    constructor() ERC721("Metaverse Tokens", "METT") {
        
        owner = payable(msg.sender);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _ticketsAvailable;
    uint256 initialPrice=0.0085 ether;
    uint256 maxSupply=4;
    mapping(uint256 => ticketData) private ticketArray;
    struct ticketData{
        uint256 tokenID;
        address payable original_owner;
        uint perc_cut;
        address payable seller;
        address payable owner;
        uint256 prev_price;
        uint256 price;
        bool sold;
    }
    function division(uint numerator, uint denominator) private
    returns(uint quotient) {
        uint precision =5;
        uint _numerator  = numerator * 10 ** (precision+1);
        // with rounding of last digit
        uint _quotient =  ((_numerator / denominator) + 5) / 10;
        return ( _quotient);
    }

    event ticketCreated (
      uint256 indexed tokenId,
      address original_owner,
      uint perc_cut,
      address seller,
      address owner,
      uint256 prev_price,
      uint256 price,
      bool sold
    );


    function createToken(string memory tokenURI,uint artist_cut,uint256 price) public returns (int){
        require(_tokenIds.current()<=maxSupply,"Tickets over");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createTicket(newTokenId,price,artist_cut);
        _ticketsAvailable.increment();
        return(int(newTokenId));
    }



    function createTicket(uint256 tokenID,uint256 price,uint artist_cut) private{
        require(price>0,"Price must be atleast 1 wei");
        ticketArray[tokenID]= ticketData(
            tokenID,
            payable(msg.sender),
            artist_cut,
            payable(msg.sender),
            payable(address(this)),
            price,
            price,
            false
        );
        emit ticketCreated(
            tokenID,
            msg.sender,
            artist_cut,
            msg.sender,
            address(msg.sender),
            price,
            price,
            false
        );   
    }
    function listTicketForSale(uint256 tokenID,uint256 price) public payable{
        require(ticketArray[tokenID].owner == msg.sender,"Only owner can list his ticket for sale");
        ticketArray[tokenID].sold = false;
        ticketArray[tokenID].price= price;
        ticketArray[tokenID].owner = payable(address(this));
        ticketArray[tokenID].seller = payable(msg.sender);
        _ticketsAvailable.increment();
        _transfer(msg.sender,address(this),tokenID);
        
    }

    function makeSale(uint256 tokenID) public payable{
        uint price=ticketArray[tokenID].price;
        address seller = ticketArray[tokenID].seller;
        require(msg.value == price,"Pay the price that has been asked");
        ticketArray[tokenID].sold=true;
        ticketArray[tokenID].seller=payable(address(0));
        ticketArray[tokenID].owner = payable(msg.sender);
        _ticketsAvailable.decrement();
        _transfer(address(this),msg.sender,tokenID);
        int profit = int(price)-int(ticketArray[tokenID].prev_price);
        if(profit > 0){
            uint256 artist_cut=division(uint(profit)*uint(ticketArray[tokenID].perc_cut), 100);
            uint256 seller_cut=price-artist_cut;
            payable(ticketArray[tokenID].original_owner).transfer(artist_cut);
            payable(seller).transfer(seller_cut);
        } 
        else{
            payable(seller).transfer(price);
        }
    }
}