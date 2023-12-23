import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
   ThirdwebProvider,
   ConnectWallet,
   metamaskWallet,
   coinbaseWallet,
   walletConnect,
   embeddedWallet,
   smartWallet,
   paperWallet
 } from "@thirdweb-dev/react";
 import { ScrollSepoliaTestnet,PolygonZkevmTestnet,MantleTestnet } from "@thirdweb-dev/chains";
import App from './App';
import { Analytics } from '@vercel/analytics/react';


const smartWalletOptions = {
   factoryAddress: "0xd4ff4462A6B3875F4FCaa19023Ada8152Bca3F3d",
   gasless: true,
 };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
   <ThirdwebProvider 
      clientId="b3941fee4a204bc9393eb658a8c8fb7b"
      activeChain="mumbai"
      supportedWallets={[
         smartWallet(
           metamaskWallet(),
           smartWalletOptions,
         ),
         smartWallet(
           coinbaseWallet(),
           smartWalletOptions,
         ),
         smartWallet(
           walletConnect(),
           smartWalletOptions,
         ),
         smartWallet(
           embeddedWallet(),
           smartWalletOptions,
         ),
       ]}
   >
      <BrowserRouter>
         <App />
         <Analytics />
      </BrowserRouter>
   </ThirdwebProvider>
    
 </React.StrictMode>
);