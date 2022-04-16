// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract Concert1 is ERC721URIStorage
{
    address payable owner;
    //Calls ERC721 constructor
    constructor() ERC721("Metaverse Tokens", "METT") {
        
        owner = payable(msg.sender);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _ticketsAvailable;
    uint256 initialPrice=0.0085 ether;
    uint256 maxSupply=10000;
    mapping(uint256 => ticketData) private ticketArray;
    //Stores the data in a ticket
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

    //Used for division of uint
    function division(uint256 profit) private pure
    returns(uint256 cut) {
        if(profit < 0.25 ether){
            cut=0 ether;
        }
        else if(profit>=0.25 ether && profit<1 ether){
            cut=0.1 ether;
        }
        else if(profit>1 ether && profit < 5 ether){
            cut=0.5 ether;
        }
        else{
            cut=profit-(0.5 ether);
        }
        
    }

    //An event of a ticket being created
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

    //A function that creates the token inside the blockchain
    function createToken(string memory tokenURI,uint artist_cut,uint256 price) public returns (uint256){
        require(_tokenIds.current()<=maxSupply,"Tickets over");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createTicket(newTokenId,price,artist_cut);
        _ticketsAvailable.increment();
        return((newTokenId));
    }


    //A function that initializes the data for a token
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
        _transfer(msg.sender,address(this), tokenID);
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

    //function for listing the ticket for resale
    function listTicketForSale(uint256 tokenID,uint256 price) public{
        require(ticketArray[tokenID].owner == msg.sender,"Only owner can list his ticket for sale");
        ticketArray[tokenID].sold = false;
        ticketArray[tokenID].price= price;
        ticketArray[tokenID].owner = payable(address(this));
        ticketArray[tokenID].seller = payable(msg.sender);
        _ticketsAvailable.increment();
        _transfer(msg.sender,address(this),tokenID);
        
    }


    //function to purchase the sale of a ticket
    function makeSale(uint256 tokenID) public payable{
        uint256 price=ticketArray[tokenID].price;
        address seller = ticketArray[tokenID].seller;
        require(msg.value == price,"Pay the price that has been asked");
        ticketArray[tokenID].sold=true;
        ticketArray[tokenID].seller=payable(address(0));
        ticketArray[tokenID].owner = payable(msg.sender);
        _ticketsAvailable.decrement();
        _transfer(address(this),msg.sender,tokenID);
        uint256 profit = price-ticketArray[tokenID].prev_price;
        if(price > ticketArray[tokenID].prev_price){
            uint256 artist_cut=division(uint256(profit));
            uint256 seller_cut=price-artist_cut;
            payable(ticketArray[tokenID].original_owner).transfer(artist_cut);
            payable(seller).transfer(seller_cut);
            ticketArray[tokenID].prev_price=price;
        } 
        else{
            ticketArray[tokenID].prev_price=price;
            payable(seller).transfer(price);
        }
    }

    function cancelListing(uint256 tokenID) public{
        require(msg.sender== ticketArray[tokenID].seller,"Only the seller can de-list the image");
        ticketArray[tokenID].sold=true;
        ticketArray[tokenID].seller=payable(address(0));
        ticketArray[tokenID].owner = payable(msg.sender);
        _ticketsAvailable.decrement();
        _transfer(address(this),msg.sender,tokenID);
    }

    //function to get all the tickets on the market
    function getAvailableTickets() public view returns (ticketData[] memory){
        uint total= _tokenIds.current();
        uint available= _ticketsAvailable.current();
        ticketData[] memory items = new ticketData[](available);
        uint currentIdx=0;
        for(uint i=0;i<total;i++){
            if(ticketArray[i+1].owner==address(this)){
                ticketData storage tempItm=ticketArray[i+1];
                items[currentIdx]=tempItm;
                currentIdx+=1;
            }
        }
        return items;

    }

    //function to get all the tickets purchased by a user
    function getMyTickets() public view returns (ticketData[] memory){
        uint total= _tokenIds.current();
        uint count = 0;
        for (uint i = 0; i < total; i++) {
            if (ticketArray[i + 1].owner == msg.sender) {
                count += 1;
            }
        }
        ticketData[] memory items = new ticketData[](count);
        uint currentIdx=0;
        for(uint i=0;i<total;i++){
            if(ticketArray[i+1].owner==msg.sender){
                ticketData storage tempItm=ticketArray[i+1];
                items[currentIdx]=tempItm;
                currentIdx+=1;
            }
        }
        return items;
    }


    //function to get the tickets listed by a user
    function getListedTickets() public view returns (ticketData[] memory){
        uint total= _tokenIds.current();
        uint count = 0;
        for (uint i = 0; i < total; i++) {
            if (ticketArray[i + 1].seller == msg.sender) {
                count += 1;
            }
        }
        ticketData[] memory items = new ticketData[](count);
        uint currentIdx=0;
        for(uint i=0;i<total;i++){
            if(ticketArray[i+1].seller==msg.sender){
                ticketData storage tempItm=ticketArray[i+1];
                items[currentIdx]=tempItm;
                currentIdx+=1;
            }
        }
        return items;
    }
}