import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { NavBar, Line } from '.'

import {
    ticketMarketAddress
} from '../config'

import TicketMarket from '../artifacts/contracts/TicketMarket.sol/Concert1.json';

export default function ResellTicket(){
    const [formInput, updateFormInput] = useState({ price: '', image: '' })
  const router = useRouter()
  const { id, ticketURI } = router.query
  const { image, price } = formInput

  useEffect(() => {
      fetchTicket()
  }, [id])

  async function fetchTicket(){
      if(!ticketURI) return
      const meta = await axios.get(ticketURI)
      updateFormInput(state => ({...state, image: meta.data.image}))

  }

  async function resell(){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const priceNew = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, signer)

    let transaction = await contract.listTicketForSale(id, priceNew)
    await transaction.wait()
    console.log(priceNew)
    router.push('/my-tickets')
  }

  return(
    <div className="card gradient-custom" style={{minHeight: '1080px'}}>
        <NavBar></NavBar> <Line></Line>
      <div>
      <form className='form-container' style={{top:'40%'}}>
        <input
          placeholder="Asset Price in Eth"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        {
          image && (
            <img className="rounded mt-4" width="100" src={image} />
          )
        } <br/>
        <button onClick={resell}>
          List Ticket
        </button>
        </form>
      </div>
  </div>
  )
}

