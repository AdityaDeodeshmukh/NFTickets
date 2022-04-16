import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { NavBar, Line } from '.'

import {
    ticketMarketAddress
} from '../config';

import TicketMarket from '../artifacts/contracts/TicketMarket.sol/Concert1.json';

export default function MyTickets() {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()

    useEffect(() => {
        loadTickets()
    }, [])

    async function loadTickets() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)

        const signer = provider.getSigner()

        const contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, signer)
        const data = await contract.getMyTickets()

        const items = await Promise.all(data.map(async i => {
            const ticketURI = await contract.tokenURI(i.tokenID)
            const meta = await axios.get(ticketURI);

            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenID: i.tokenID.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                ticketURI
            }
            return item
        }))

        setTickets(items);
        setIsLoading(false);
    }

    function resellTicket(ticket){
        console.log('ticket: ', ticket)
        router.push(`/resell-ticket?id=${ticket.tokenID}&ticketURI=${ticket.ticketURI}`)
    }

    if (isLoading === false && !tickets.length) 
    return (
      <div className="card gradient-custom" style={{minHeight:'1080px'}}>
      <NavBar /> <Line></Line>
      <div className="card__circle card__circle1"></div>
      <div className="card__circle card__circle2"></div> <h1 style={{color: 'white', padding: '10px'}}>No Tickets Bought. Buy Some Tickets!</h1></div>
    )

  return(
  //   <div className={styles.container}>
  //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
  //       {
  //         tickets.map((ticket, i) => (
  //           <div key={i} className="border shadow rounded-xl overflow-hidden">
  //             <img src={ticket.image} />
  //             <div className="p-4">
  //               <p style={{ height: '64px' }} className="text-2xl font-semibold">{ticket.name}</p>
  //               <div style={{ height: '70px', overflow: 'hidden' }}>
  //                 <p className="text-gray-400">{ticket.description}</p>
  //               </div>
  //             </div>
  //             <div className="p-4 bg-black">
  //               <p className="text-2xl font-bold text-white">{ticket.price} ETH</p>
  //               <button onClick={() => resellTicket(ticket)}>Resell</button>
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
  <h1 style={{color: 'white', padding: '15px'}}>My Tickets</h1>
  <div className="card__container bd-container">
    {
      tickets.map((ticket, i) => (
        <div key={i} className="card__glass">
      <img src={ticket.image} alt="" className="card__img" />

      <div className="card__data">
        <h5>Artist : {ticket.name}</h5>
        <span className="card__profession">{ticket.description}</span>
      </div>

      
        <button className="card__button" onClick={() => {resellTicket(ticket)}}>Resell</button>

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