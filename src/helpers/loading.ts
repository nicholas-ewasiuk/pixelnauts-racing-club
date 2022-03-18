import events from 'events';

export enum LoadStatus {
  Idle,
  Loading,
  Error,
  Success,
}

export interface IUpdateLoadingParams {
  newStatus: LoadStatus;
  newProgress: number;
  maxProgress: number;
  newText: string;
}

export const EE = new events.EventEmitter.EventEmitter();
export const ERR_NO_NFTS = new Error('No NFTs Found:( Are you on the right network?');

export function estimateNFTLoadTime(count: number) {
  // first 100 NFTs = <1min, then 1min extra for each 2500 extra 1min
  return 1 + Math.floor(count / 2000);
}

/*
MIT License

Copyright (c) 2021 ilmoi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/