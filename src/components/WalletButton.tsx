/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { lighten } from 'polished';
import { ConnectedWallet } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';
import { breakpoints } from '../App';

type Props = {
  wallet: ConnectedWallet | null,
}

/**
 * Added functionality and styles for the @gokiprotocol/walletkit "ConnectWalletButton".
 */
export const WalletButton = ({ wallet }: Props) => {
  const { connect } = useWalletKit();
  return (
    <>
    { wallet ? (
      <button css={[button, connected]}>
        <span>
          Connected
        </span>
      </button>
    ) : (
      <button
        css={css`
          ${button}
        `} 
        onClick={connect}
      >
        <span>Connect Wallet</span>
      </button>
    )}
    </>
  )
}

const button = css`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  outline: none;
  border-style: solid;
  border-color: #1d257a;
  @media (max-width: 576px) {
    margin: 0 20px 0 0;
    width: 140px;
    height: 60px;
  }
  box-shadow: none;
  border-radius: 0px;
  width: 200px;
  height: 40px;
  background: inherit;
  font-size: 18px;
  color: #1d257a;
  &:hover {
    background: ${lighten(0.1, "#1d257a")};
  }
  & > span {
    font-size: 20px;
    font-family: 'DotGothic16', sans-serif;
    font-weight: inherit;
  }
`;

const connected = css`
  background: inherit;
  &:hover {
    background: ${lighten(0.1, "#1d257a")};
  }
  & > span {
    font-weight: inherit;
    font-size: 20px;
  }
`

