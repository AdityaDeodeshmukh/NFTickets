# NFTickets
An online ticket booking platform that uses NFTs to buy/sell/authenticate tickets

## Features
- Some of the features implemented include:
* Creating NFTs for ticket purposes (admin power)
* Buying tickets from the market
* Reselling tickets on the market (Part of the profit goes to artist)
* Viewing the tickets you have purchased
* Cancelling the resale in case ticket has not been bought

##instructions to run
Step 1:
Install Metamask web3 extension in your browser

Step 2:
Open a Terminal and type the following commands:
```
$ git clone https://github.com/AdityaDeodeshmukh/NFTickets
$ cd NFTickets
$ npm install
$ npx hardhat node
```
Step 3:
Open another terminal in the same directory and type the following commands
```
$npx hardhat run scripts/sample-script.js --network localhost
$npm run dev
```
Step 4:
Open Metamask and connect it to your localhost.
<br>
Next import one of the accounts that appear in the first terminal ( Use the private key)

Step 5:
For uploading creating an NFT append the URL with /create-ticket

## Creating NFT

In the form enter the one of the following details: <br>
* Artist name: {Taylor Swift,Ed Sheeran,Weeknd,Panic At the Disco} <br> 
* Description: {Anything you like} <br>
* Artist code: {TLSW , EDSH, WKND, PATD} <br>
* Picture: {Anything you like} <br>
* After all this click create NFT <br>
* Next Go to the home page and click on the artist you made the NFT of. <br>
* You should find the NFT that you made there. <br>
