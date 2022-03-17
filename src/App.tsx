import React from 'react';
import { WalletKitProvider } from '@gokiprotocol/walletkit';

import { Body } from './Body';

const App: React.FC = () => {
  return (
    <WalletKitProvider
      defaultNetwork='mainnet-beta'
      app={{
        name: 'Pixelnauts Racing Club',
      }}
    >
      <Body />
    </WalletKitProvider>
  );
};

export default App;