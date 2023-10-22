
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './leaderBoard.css';
import { Link } from 'react-router-dom';
import trophyImage from './Assests/winner.png';


import {NFT_CONTRACT_ADDRESS,TOKEN_CONTRACT_ADDRESS} from './constants/addresses'

import { ConnectWallet, ThirdwebNftMedia,  Web3Button,  useAddress, useContract, useNFT, useOwnedNFTs, useTokenBalance, walletConnect } from '@thirdweb-dev/react';



function getLeaderboardData() {
  return JSON.parse(localStorage.getItem('leaderboard')) || [];
}

const LeaderBoard = () => {
  const location = useLocation();
  const { state } = location;
  const [isDataAdded, setDataAdded] = useState(false); // Track if data has been added
  const [userAddress, setUserAddress] = useState(null); // Store the user's address
  const [winnerClaimed, setWinnerClaimed] = useState(true); 
  const address = useAddress()
  console.log(address)
  const [continueClicked, setContinueClicked] = useState(false); // Track if the "Continue" button has been clicked
  


     // Retrieve winnerClaimed from local storage on component mount
  useEffect(() => {
    const storedWinnerClaimed = localStorage.getItem('winnerClaimed');
    if (storedWinnerClaimed !== null) {
      setWinnerClaimed(storedWinnerClaimed === 'true');
    }
  }, []);

  // Function to set winnerClaimed and store it in local storage
  const setAndStoreWinnerClaimed = (value) => {
    setWinnerClaimed(value);
    localStorage.setItem('winnerClaimed', value.toString());
  };


  // ThirdWeb

  const [tokenBalanceDisplay, setTokenBalanceDisplay] = useState("0")
  const [isProfileOpen, setProfileOpen] = useState(false);
  
  

  const {contract: nftContract} = useContract(NFT_CONTRACT_ADDRESS)
  const {contract: tokenContract} = useContract(TOKEN_CONTRACT_ADDRESS)
  

  const {
    data: ownedNFTs,
    isLoading: isLoadingOwnedNFTs,
  } = useOwnedNFTs(nftContract, address)
  

  const {
    data: tokenBalance,
    isLoading: isLoadingTokenBalance
  } = useTokenBalance(tokenContract, address)

  const {
    data: nft,
    isLoading: isLoadingNFT
  } = useNFT(nftContract, 0)

  useEffect(() => {
    if(!address) return
    if(!tokenContract) return

    const interval = setInterval(async() => {
      const tokenBalance = await tokenContract.erc20.balanceOf(address)
      setTokenBalanceDisplay(tokenBalance.displayValue)
    }, 5000)

   


  },[address, nft])

  const truncateAddress = (address) => {
    return `${address.slice(0,6)}..${address.slice(-4)}`
  }

  useEffect(() => {
    if (address && !userAddress) {
      setUserAddress(address);
    }
  }, [address, userAddress]);


  useEffect(() => {
    if(!userAddress) return
    if (isDataAdded) {
      return; // Data has already been added, do not proceed
    }

    if (state && state.points && state.finishLineFrame) {
      const { points, finishLineFrame } = state;
      const seconds = (finishLineFrame + 259) / 30;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      

      const newEntry = {
        walletAddress: userAddress, // Set the wallet address if available
        points: points,
        time: `${minutes > 0 ? `${minutes} min ` : ''}${remainingSeconds.toFixed(2)} sec`,
        finishLineFrame: finishLineFrame,
        
      };
      

      const leaderboardData = getLeaderboardData();

      // Check for duplicates based on a unique identifier
      const isDuplicate = leaderboardData.some((entry) => {
        return (
          entry.points === newEntry.points &&
          entry.finishLineFrame === newEntry.finishLineFrame
        );
      });

      if (!isDuplicate) {
        leaderboardData.push(newEntry);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
        setDataAdded(true); // Mark data as added
      }
    }
  }, [isDataAdded, state, userAddress]);

 

  const storedLeaderboardData = getLeaderboardData().sort(
    (a, b) => a.finishLineFrame - b.finishLineFrame
  );

  storedLeaderboardData.forEach((entry, index) => {
    entry.rank = index + 1;
  });


  // Function to handle "Continue" button click
  const handleContinueClick = () => {
    setContinueClicked(true);
    
  };
  

  

  return (
    <div className='leaderBoard-container' >
        {!continueClicked ? (
        <div className="splash-screen">
          <h1 onClick={handleContinueClick} >Welcome to the LeaderBoard!</h1>
          <Web3Button 
                contractAddress={TOKEN_CONTRACT_ADDRESS}
                action={async (contract) => {
                  // You can use state.points here to specify the number of tokens to claim
                  // You may need to format it according to your contract's requirements
                  setContinueClicked(true);
                  const pointsToClaim = state.points;
                  
                  // Example: Convert points to a string if needed
                  const pointsToClaimString = pointsToClaim.toString();
                  
                  await contract.erc20.claim(pointsToClaimString);

                  
              
              
                }}                
               >Continue</Web3Button>
        </div>
      ) : (
        <>
      <div className='Profile' >
       <div className='profile-header'>
          <Link to="/" style={{ textDecoration: 'none', marginRight: '10px' }} ><h2>Your Profile</h2></Link>
          
          <button onClick={() => setProfileOpen(!isProfileOpen)}>
            {isProfileOpen ? 'Close' : 'Open'}
          </button>
        </div>
        { isProfileOpen && (
          <>
            {address && (
            <>
            <h3 className='me'>Welcome Back :<span> { truncateAddress(address)}</span></h3>
              {!isLoadingTokenBalance && (
                <h1>APE Coins: {tokenBalanceDisplay}</h1>
              )}
              
              
             
              {!isLoadingOwnedNFTs ? (
                ownedNFTs && ownedNFTs.length > 0 ? (
                  <ThirdwebNftMedia metadata={nft.metadata} />
                ): (
                  <p> You don't own any NFTs </p>
                )
   
              ): (
                <p>Loading...</p>
              ) }
             
            </>
          )}
          </>
        )}
      
      </div>

      <div className='leaderboard-section' >
      <h1>Leaderboard</h1>
      { winnerClaimed ? (
        <>
          <div>
          {!isLoadingTokenBalance && (<ThirdwebNftMedia metadata={nft.metadata} />)}
        </div>
        <p>Winner Can Claim</p>
        {address &&  (
          <>
            {storedLeaderboardData.length > 0 && storedLeaderboardData[0].walletAddress === userAddress && (
            <Web3Button
              contractAddress={NFT_CONTRACT_ADDRESS}
              action={(contract) => contract.erc721.claim(1)}
              onSuccess={() => {
                alert("NFT claimed")
                setAndStoreWinnerClaimed(false);
              }}
              
            >
              Claim NFT
            </Web3Button>
          )}
        </>
        
      )}
        </>
        
      ) : (
        <h1 style={{ textAlign: 'center', width: '100%', margin: '0 auto !important' }}> Winner Claimed the NFT</h1>
      )

      }
      
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Wallet Address</th>
            <th>Coins</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {storedLeaderboardData.map((entry, index) => (
            <tr key={index} > 
              <td>{entry.rank}</td>
              <td>{entry.walletAddress}</td>
              <td>{entry.points}</td>
              <td>{entry.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </>
    )}
    </div>
  );
};

export default LeaderBoard;


