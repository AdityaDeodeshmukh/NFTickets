import { Contract, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { NavBar, Line } from '.'

import {
    ticketMarketAddress
} from '../config'

import TicketMarket from '../artifacts/contracts/TicketMarket.sol/Concert1.json';

export default function DashBoard(){
    const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTickets()
  }, [])

  async function loadTickets(){
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)

      const signer = provider.getSigner()

      const contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, signer)
      
      const data = await contract.getListedTickets()

      const items = await Promise.all(data.map(async i => {
          const ticketURI = await contract.tokenURI(i.tokenID)
          const meta = await axios.get(ticketURI)

          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')

          let item = {
            price,
            tokenID: i.tokenID.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name
          }

          return item
      }))

      setTickets(items)
      setIsLoading(false)
  }

  async function Delist(ticket){
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, signer)

      const cancel_trasact = await contract.cancelListing(ticket.tokenID)
      await cancel_trasact.wait()

      loadTickets()
  }
  if (isLoading === false && !tickets.length) 
  return (
    <div className="card gradient-custom" style={{minHeight:'1080px'}}>
    <NavBar /> <Line></Line>
    <div className="card__circle card__circle1"></div>
    <div className="card__circle card__circle2"></div> <h1 style={{color: 'white', padding: '10px'}}>No Tickets Listed. List Some Tickets!</h1></div>
  )
  return (
    <section className="card gradient-custom">
  <NavBar /> <Line></Line>
  <div className="card__circle card__circle1"></div>
  <div className="card__circle card__circle2"></div>
  <h1 style={{color: 'white', padding: '15px'}}>DashBoard</h1>
  <div className="card__container bd-container">
    {
      tickets.map((ticket, i) => (
        <div key={i} className="card__glass">
      <img src={ticket.image} alt="" className="card__img" />

      <div className="card__data">
        <h5>Artist : {ticket.name}</h5>
        <span className="card__profession">{ticket.description}</span>
      </div>

      
        <button className="card__button" onClick={() => {Delist(ticket)}}>Delist</button>

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