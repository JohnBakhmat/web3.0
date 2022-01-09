import React, {
  HtmlHTMLAttributes,
  ReactEventHandler,
  useEffect,
  useState,
} from 'react'
import { ethers } from 'ethers'
import { contractAddress, contractABI } from '../utils/constants'

export const TransactionContext = React.createContext(null)

const { ethereum }: any = window

const getEtheriumContract = (): ethers.Contract => {
  const provider = new ethers.providers.Web3Provider(ethereum)
  const signer = provider.getSigner()
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  )

  return transactionContract
}

export const TransactionProvider = ({ children }: any) => {
  const [connectedAccount, setConnectedAccount] = useState('')
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
    keyword: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem('transactionCount')
  )
  const handleFormChange = (event: any, name: string) => {
    setFormData((prevState) => ({ ...prevState, [name]: event.target.value }))
  }
  const hasMetamask = () =>
    !ethereum ? alert('Please install MetaMask!') : null

  const walletIsConnected = async () => {
    try {
      hasMetamask()

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length) {
        setConnectedAccount(accounts[0])

        //getAllTransactions();
      } else {
        console.log('No accounts found')
      }
      console.log(accounts)
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  const connectWallet = async () => {
    try {
      hasMetamask()
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      setConnectedAccount(accounts[0])
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  const sendTransaction = async () => {
    try {
      hasMetamask()

      const { addressTo, amount, keyword, message } = formData
      const transactionContract = getEtheriumContract()
      const parsedAmount = ethers.utils.parseEther(amount)
      await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: `0x5208`, //21000 gwei
            value: parsedAmount._hex, // 0.00001
          },
        ],
      })

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      )

      setIsLoading(true)
      console.log(`Loading - ${transactionHash.hash}`)
      await transactionHash.wait()

      setIsLoading(false)
      console.log(`SUCCESS - ${transactionHash.hash}`)

      const transactionCount = await transactionContract.getTransactionCount()
      setTransactionCount(transactionCount.toNumber())
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  useEffect(() => {
    walletIsConnected()
  }, [])

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        connectedAccount,
        formData,
        handleFormChange,
        sendTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
