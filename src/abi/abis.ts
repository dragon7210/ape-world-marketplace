/** @format */

export const approveABI = {
  constant: false,
  inputs: [
    { internalType: "address", name: "to", type: "address" },
    { internalType: "uint256", name: "tokenId", type: "uint256" },
  ],
  name: "approve",
  outputs: [],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
};
export const mvaApproveABI = {
  constant: false,
  inputs: [
    { name: "_spender", type: "address" },
    { name: "_value", type: "uint256" },
  ],
  name: "approve",
  outputs: [{ name: "", type: "bool" }],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
};
export const getAllItemsABI = {
  inputs: [],
  name: "getItemList",
  outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
  stateMutability: "view",
  type: "function",
};
export const getItemABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "getItem",
  outputs: [
    {
      components: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "tokenAddress", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint256", name: "loanValue", type: "uint256" },
        { internalType: "uint256", name: "loanFee", type: "uint256" },
        { internalType: "uint256", name: "duration", type: "uint256" },
        { internalType: "uint256", name: "startTime", type: "uint256" },
        { internalType: "uint256", name: "endTime", type: "uint256" },
        { internalType: "address", name: "messiah", type: "address" },
        { internalType: "enum PawnShop.TYPES", name: "status", type: "uint8" },
      ],
      internalType: "struct PawnShop._item",
      name: "",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
};
export const getServiceFeeABI = {
  inputs: [],
  name: "getServiceFee",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function",
};
export const createLoanABI = {
  inputs: [
    { internalType: "address", name: "_tokenAddress", type: "address" },
    { internalType: "uint256", name: "_tokenId", type: "uint256" },
    { internalType: "uint256", name: "_loanValue", type: "uint256" },
    { internalType: "uint256", name: "_loanFee", type: "uint256" },
    { internalType: "uint256", name: "_duration", type: "uint256" },
  ],
  name: "createItem",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const grantLoanABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "grantLoan",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const settleLoanABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "settleItem",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const claimLoanABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "claimItem",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const removeItemABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "removeItem",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const getAllOptionsABI = {
  inputs: [],
  name: "getAllOptions",
  outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
  stateMutability: "view",
  type: "function",
};

export const getOptionABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "getOption",
  outputs: [
    {
      components: [
        { internalType: "enum nftOptions.TYPE", name: "_type", type: "uint8" },
        {
          internalType: "enum nftOptions.STATUS",
          name: "_status",
          type: "uint8",
        },
        { internalType: "address", name: "tokenAddress", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint256", name: "strikePrice", type: "uint256" },
        { internalType: "uint256", name: "optionPrice", type: "uint256" },
        { internalType: "uint256", name: "expirationDate", type: "uint256" },
        { internalType: "uint256", name: "exerciseDate", type: "uint256" },
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "taker", type: "address" },
        { internalType: "bool", name: "takeable", type: "bool" },
      ],
      internalType: "struct nftOptions.option",
      name: "",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
};