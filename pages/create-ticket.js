import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { NavBar, Line } from '.'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
    ticketMarketAddress
} from '../config';

import TicketMarket from '../artifacts/contracts/TicketMarket.sol/Concert1.json';

export default function CreateTicket() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({ price: '', name: '', artcode: '', description: '' })
    const router = useRouter()

    async function onChange(e) {
        const file = e.target.files[0]
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }
    async function uploadToIPFS() {
        const { name, description, artcode, price } = formInput
        if (!name || !description || !price || !artcode || !fileUrl) return
        /* first, upload to IPFS */
        const data = JSON.stringify({
            name, description, artcode, image: fileUrl
        })
        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            /* after file is uploaded to IPFS, return the URL to use it in the transaction */
            return url
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function listNewTicketForSale() {
        const url = await uploadToIPFS()
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        let contract = new ethers.Contract(ticketMarketAddress, TicketMarket.abi, signer)
        let transaction = await contract.createToken(url, 50, price);
        await transaction.wait()
        // console.log(transaction);

        router.push('/')
    }

    return (

        <div className="card gradient-custom" style={{minHeight: '1080px'}}>
            <NavBar /> <Line></Line>
            <div className="form-container">
                <form className=''>
                <input
                    placeholder="Artist Name" 
                    onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                /><br/>
                <textarea
                    placeholder="Concert Description"
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                /><br/><br/>
                <input 
                    placeholder='Artist Code'
                    onChange={e => updateFormInput({ ...formInput, artcode: e.target.value })}
                />
                <input
                    placeholder="Ticket Price in Eth"
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                /><br/>
                <input
                    type="file"
                    name="Asset"
                    onChange={onChange}
                /><br/>
                {
                    fileUrl && (
                        <img className="rounded mt-4" width="100" src={fileUrl} />
                    )
                }
                <br/>
                <br />
                <br />
                </form>
            <button className='form-container' style={{position: 'relative',bottom:'60px', maxHeight:'50px'}} onClick={listNewTicketForSale} >
                    Create Ticket
            </button>
            </div>
        </div>
    )
}