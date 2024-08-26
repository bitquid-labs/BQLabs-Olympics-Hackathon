/* eslint-disable no-console */
'use client';

// Particle imports
import {
  useAccount,
  useDisconnect,
  useModal,
  useParticleAuth,
  usePublicClient,
  useWallets,
} from '@particle-network/connectkit';
// Optional: Import ethers provider for EIP-1193 compatibility
import { type Eip1193Provider, ethers } from 'ethers';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
// Connectkit uses Viem, so Viem's features can be utilized
import { formatEther, parseEther } from 'viem';

import Button from '@/components/button/button';

export default function ConnectScreen() {
  // Initialize account-related states from Particle's useAccount hook
  const { address, isConnected, isConnecting, isDisconnected, chainId } =
    useAccount();
  const { setOpen } = useModal();
  const { disconnectAsync } = useDisconnect();
  const { getUserInfo } = useParticleAuth();

  // Optional: Initialize public client for RPC calls using Viem
  const publicClient = usePublicClient();

  // Retrieve the primary wallet from the Particle Wallets
  const [primaryWallet] = useWallets();

  // Define state variables
  const [account, setAccount] = useState(null); // Store account information
  const [balance, setBalance] = useState<string>(''); // Store user's balance
  const [userAddress, setUserAddress] = useState<string>(''); // Store user's address
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userInfo, setUserInfo] = useState<any>(null); // Store user's information
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(false); // Loading state for fetching user info
  const [userInfoError, setUserInfoError] = useState<string | null>(null); // Error state for fetching user info
  const [recipientAddress, setRecipientAddress] = useState<string>(''); // Store recipient's address for transactions
  const [transactionHash, setTransactionHash] = useState<string | null>(null); // Store transaction hash after sending
  const [isSending, setIsSending] = useState<boolean>(false); // State for showing sending status

  // Connection status message based on the account's connection state
  const connectionStatus = isConnecting
    ? 'Connecting...'
    : isConnected
    ? 'Connected'
    : isDisconnected
    ? 'Disconnected'
    : 'Unknown';

  // Fetch user's balance and format it for display
  const fetchBalance = useCallback(async () => {
    try {
      if (!address) return;
      const addr = address as `0x${string}`;
      const balanceResponse = await publicClient?.getBalance({ address: addr });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const balanceInEther = formatEther(balanceResponse!);
      // eslint-disable-next-line no-console
      console.log(balanceResponse);
      setBalance(parseFloat(balanceInEther).toFixed(4)); // Display balance with 4 decimal places
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching balance:', error);
    }
  }, [address, publicClient]);

  // Load account details and fetch balance when address or chainId changes
  useEffect(() => {
    async function loadAccount() {
      if (address) {
        setAccount(account);
        setUserAddress(address);
        await fetchBalance();
      }
    }
    loadAccount();
  }, [chainId, address, account, fetchBalance]);

  // Fetch and set user information when connected
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoadingUserInfo(true);
      setUserInfoError(null);

      try {
        const userInfo = await getUserInfo();
        console.log(userInfo);
        setUserInfo(userInfo);
      } catch (error) {
        setUserInfoError(
          'Error fetching user info: The current wallet is not a particle wallet.'
        );
        console.error('Error fetching user info:', error);
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    if (isConnected) {
      fetchUserInfo();
    }
  }, [isConnected, getUserInfo]);

  // Handle user disconnect action
  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  };

  // Option 1: Send transaction using ethers.js with a custom EIP-1193 provider
  const executeTxEthers = async () => {
    const tx = {
      to: recipientAddress,
      value: parseEther('0.01'), // Set value to 0.01 Ether
      data: '0x', // No data, as there is no contract interaction
    };

    setIsSending(true);

    try {
      const EOAprovider = await primaryWallet.connector.getProvider();
      const customProvider = new ethers.BrowserProvider(
        EOAprovider as Eip1193Provider,
        'any'
      );

      const signer = await customProvider.getSigner();
      const txResponse = await signer.sendTransaction(tx);
      const txReceipt = await txResponse.wait();

      if (txReceipt) {
        setTransactionHash(txReceipt.hash);
      } else {
        console.error('Transaction receipt is null');
      }
    } catch (error) {
      console.error('Error executing EVM transaction:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Option 2: Send transaction using the native Particle provider
  const executeTxNative = async () => {
    try {
      const tx = {
        to: recipientAddress,
        value: parseEther('0.01'), // Set value to 0.01 Ether
        data: '0x', // No data, as there is no contract interaction
        chainId: primaryWallet.chainId, // Current chainId
        account: primaryWallet.accounts[0], // Primary account
      };

      setIsSending(true);

      const walletClient = primaryWallet.getWalletClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transactionResponse = await walletClient.sendTransaction(tx as any);

      setTransactionHash(transactionResponse);
      console.log('Transaction sent:', transactionResponse);
    } catch (error) {
      console.error('Failed to send transaction:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Parameters for the on-ramp URL
  const fiatCoin = 'USD';
  const cryptoCoin = 'ETH';
  const network = 'Ethereum';
  const theme = 'dark';
  const language = 'en';

  // Function to handle the on-ramp button click
  const handleOnRamp = () => {
    const onRampUrl = `https://ramp.particle.network/?fiatCoin=${fiatCoin}&cryptoCoin=${cryptoCoin}&network=${network}&theme=${theme}&language=${language}`;
    window.open(onRampUrl, '_blank');
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  // Function to truncate Ethereum address
  const truncateAddress = (address: string) => {
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <div className='flex flex-1 flex-col items-center justify-between bg-black p-8 text-white'>
      <main className='mx-auto flex w-full max-w-6xl flex-grow flex-col items-center justify-center'>
        {isConnected ? (
          <>
            <div className='flex w-full justify-center'>
              <div className='grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2'>
                <div className='rounded-lg border border-purple-500 p-6'>
                  {isLoadingUserInfo ? (
                    <div>Loading user info...</div>
                  ) : userInfoError ? (
                    <div className='text-red-500'>{userInfoError}</div>
                  ) : (
                    userInfo && ( // Conditionally render user info
                      <div className='flex items-center'>
                        <h2 className='mr-2 text-lg font-semibold text-white'>
                          Name: {userInfo.name || 'N/A'}
                        </h2>
                        {userInfo.avatar && (
                          <Image
                            src={userInfo.avatar}
                            alt='User Avatar'
                            className='h-10 w-10 rounded-full'
                            width={40}
                            height={40}
                          />
                        )}
                      </div>
                    )
                  )}
                  <h2 className='mb-2 flex items-center text-lg font-semibold text-white'>
                    Address: <code>{truncateAddress(userAddress)}</code>
                    <button
                      className='ml-2 flex transform items-center rounded bg-purple-600 px-2 py-1 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-purple-700'
                      onClick={() => copyToClipboard(userAddress)}
                    >
                      📋
                    </button>
                  </h2>
                  <h2 className='mb-2 text-lg font-semibold text-white'>
                    Chain ID: <code>{chainId}</code>
                  </h2>
                  <h2 className='mb-2 flex items-center text-lg font-semibold text-white'>
                    Balance: {balance !== '' ? balance : 'Loading...'}
                    <button
                      className='ml-2 flex transform items-center rounded bg-purple-600 px-2 py-1 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-purple-700'
                      onClick={fetchBalance}
                    >
                      🔄
                    </button>
                  </h2>
                  <button
                    className='mt-4 transform rounded bg-purple-600 px-4 py-2 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-purple-700'
                    onClick={handleOnRamp}
                  >
                    Buy Crypto with Fiat
                  </button>
                  <div>
                    <button
                      className='mt-4 transform rounded bg-red-600 px-4 py-2 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-red-700'
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>

                <div className='rounded-lg border border-purple-500 p-6'>
                  <h2 className='mb-2 text-2xl font-bold text-white'>
                    Send a transaction
                  </h2>
                  <h2 className='text-lg'>Send 0.01</h2>
                  <input
                    type='text'
                    placeholder='Recipient Address'
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className='mt-4 w-full rounded border border-gray-700 bg-gray-900 p-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400'
                  />
                  <button
                    className='mt-4 transform rounded bg-purple-600 px-4 py-2 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-purple-700'
                    onClick={executeTxNative}
                    disabled={!recipientAddress || isSending}
                  >
                    {isSending ? 'Sending...' : `Send 0.01 Particle provider`}
                  </button>
                  <button
                    className='mt-4 transform rounded bg-purple-600 px-4 py-2 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:bg-purple-700'
                    onClick={executeTxEthers}
                    disabled={!recipientAddress || isSending}
                  >
                    {isSending ? 'Sending...' : `Send 0.01 with ethers`}
                  </button>
                  {/* Display transaction notification with the hash */}
                  {transactionHash && (
                    <div className='mt-4 rounded-lg bg-gray-800 p-2 text-white'>
                      Transaction Hash: {transactionHash}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          // <ConnectButton />
          <Button onClick={() => setOpen(true)}>
            Connect Particle Network
          </Button>
        )}
        <div>{connectionStatus}</div>
      </main>
    </div>
  );
}
