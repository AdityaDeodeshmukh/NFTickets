import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal, { setLocal } from 'web3modal'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { NavBar, Line } from '.'


import{
  ticketMarketAddress
} from '../config';

import TicketMarket from '../artifacts/contracts/TicketMarket.sol/Concert1.json';
import axios from 'axios'

export default function Home() {

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTickets()
  }, [])

  const router = useRouter()

  const {artcode} = router.query
  

  async function loadTickets(){
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, provider);

    const data = await contract.getAvailableTickets();
    const items = await Promise.all(data.map(async i => {
      const ticketURI = await contract.tokenURI(i.tokenID);
      const meta = await axios.get(ticketURI);

      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenID: i.tokenID.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        artcode: meta.data.artcode,
        description: meta.data.description
      }
      return item
    }))

    const filteredItems = items.filter((item) => item.artcode === artcode)

    setTickets(filteredItems);
    setIsLoading(false);
  }

  async function buyTicket(ticket){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, signer);

    const price = ethers.utils.parseUnits(ticket.price.toString(), 'ether');
    console.log(price);
    const buy_transact = await contract.makeSale(ticket.tokenID, {value: price});
    await buy_transact.wait();

    loadTickets();
  }

  // async function resell(){
  //   const web3Modal = new Web3Modal()
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const signer = provider.getSigner()

  //   const price = ethers.utils.parseUnits('20', 'ether')
  //   let contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, signer)

  //   let transaction = await contract.listTicketForSale(1, price)
  //   await transaction.wait()

  //   router.push('/')
  // }

  if (isLoading === false && !tickets.length) 
  return (
    <div className="card gradient-custom" style={{minHeight:'1080px'}}>
    <NavBar /> <Line></Line>
    <div className="card__circle card__circle1"></div>
    <div className="card__circle card__circle2"></div> <h1 style={{color: 'white', padding: '10px'}}>No Tickets to be sold. Check back later!</h1></div>
  )
  return (
    // <div className="gradient-custom" style={{minHeight: '1080px'}}>
    //   <NavBar /> <Line></Line>
    //   <div className="col-sm-4" style={{padding:'15px', display:'flex', padding:'10px'}}>
    //       {
    //         tickets.map((ticket, i) => (
    //           <div key={i} className='card' style={{maxWidth:'200px', minWidth:'200px', borderRadius: 20, color: '#fff',
    //           margin: '40px auto',
    //           backgroundColor: 'rgba(255,255,255,0.06)',
    //           border: '1px solid rgba(255,255,255,0.1)',
    //           width: '100%',
    //           borderRadius: '15px',
    //           padding: '15px',
    //           backdropFilter: 'blur(10px)',
    //           verticalAlign: 'bottom', alignItems:'center'}}>
    //             <img src={ticket.image}  style={{minWidth:'100%', minHeight:'60%', maxWidth:'100%', maxHeight:'600%', borderRadius: 20}}/>
    //             <div className="p-1">
    //               <p style={{ height: '20px' }} className="text-white text-center">{ticket.name}</p>
    //               <p className="text-white text-center">{ticket.description}</p>
                  
    //             </div>
    //             <div className="p-3" style={{borderRadius: 20, alignItems:'center', textAlign:'center'}}>
    //               <p className="text-white">{ticket.price} ETH</p>
    //               <button className="text-white" style={{borderRadius:7.5, backgroundColor: '#577CFF'}} onClick={() => buyTicket(ticket)}>Buy</button>
    //             </div>
    //           </div>
    //         ))
    //       }
    //     </div>
    // </div>
    
    <section className="card gradient-custom">
      <NavBar /> <Line></Line>
      <div className="card__circle card__circle1"></div>
      <div className="card__circle card__circle2"></div>
      <h1 style={{color: 'white', padding: '15px'}}>Buy Tickets Here!</h1>
      <div className="card__container bd-container">
        {
          tickets.map((ticket, i) => (
            <div key={i} className="card__glass">
          <img src={ticket.image} alt="" className="card__img" />

          <div className="card__data">
            <h5>Artist : {ticket.name}</h5>
            <span className="card__profession">{ticket.description}</span>
            <h5>Price: {ticket.price} ETH</h5>
          </div>

          
            <button className="card__button" onClick={() => {buyTicket(ticket)}}>Buy</button>

          <div className="card__social">
            <a href="#" className="card__link">
              <i className="bx bxs-map"></i>
            </a>
            <a href="#" className="card__link">
              <i className="bx bxs-info-circle"></i>
            </a>
          </div>
        </div>
          ))
        }
        </div>
        </section>
  )
}
