import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

import{
  ticketMarketAddress
} from '../config';

import TicketMarket from '../artifacts/contracts/TicketMarket.sol/Concert1.json';

export default function Home() {

  const [fileurl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({price: '', name: ''})
  const router = useRouter()

  let transaction;

  async function listTicketForSale(){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const price = ethers.utils.parseUnits('10', 'ether')
    let contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, signer)
    transaction = await contract.createToken("Sample_ticket", 20, price);
    await transaction.wait()
    console.log(transaction);

    router.push('/')
  }

  async function buy(){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, signer);

    const price = ethers.utils.parseUnits('10', 'ether');
    console.log(price);
    const buy_transact = await contract.makeSale(1, {value: price});
    await buy_transact.wait();

  }

  async function resell(){

  }

  return (
    <div className={styles.container}>
      <button onClick={listTicketForSale}>Create Ticket</button>
      <button onClick={buy}>Buy</button>
      <button ></button>
    </div>
  )
}
