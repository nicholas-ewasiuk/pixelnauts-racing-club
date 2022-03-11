/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useState } from "react";
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ModdedWalletButton } from "./components/ModdedWalletButton";
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";

export const Body: React.FC = () => {
  const [ balance, setBalance ] = useState<number | null>(null);

  const { providerMut, connection } = useSolana();
  const wallet = useConnectedWallet();

  const refetchSOL = useCallback(async () => {
    if (wallet && providerMut) {
      setBalance(await providerMut.connection.getBalance(wallet.publicKey));
    }
  }, [providerMut, wallet]);

  useEffect(() => {
    void refetchSOL();
  }, [refetchSOL]);

  return (
    <AppWrapper>
      <h1>Hello World</h1>
      <ModdedWalletButton 
        wallet={wallet}
        balance={balance}
      />
    </AppWrapper>
  );
};

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;