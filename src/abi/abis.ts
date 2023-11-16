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
export const deleteOptionABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "deleteOption",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const editOptionPriceABI = {
  inputs: [
    { internalType: "bytes32", name: "_hash", type: "bytes32" },
    { internalType: "uint256", name: "_price", type: "uint256" },
  ],
  name: "editOptionPrice",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const sellOptionABI = {
  inputs: [
    { internalType: "bytes32", name: "_hash", type: "bytes32" },
    { internalType: "uint256", name: "_price", type: "uint256" },
  ],
  name: "sellOption",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const getMarketFeeABI = {
  inputs: [],
  name: "getMarketFee",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function",
};
export const buyOptionABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "buyOption",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const exerciseCallABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "exerciseCall",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const exercisePutABI = {
  inputs: [
    { internalType: "bytes32", name: "_hash", type: "bytes32" },
    { internalType: "address", name: "_tokenAddress", type: "address" },
    { internalType: "uint256", name: "_tokenId", type: "uint256" },
  ],
  name: "exercisePut",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const createCallABI = {
  inputs: [
    { internalType: "address", name: "_tokenAddress", type: "address" },
    { internalType: "uint256", name: "_tokenId", type: "uint256" },
    { internalType: "uint256", name: "_strike", type: "uint256" },
    { internalType: "uint256", name: "_price", type: "uint256" },
    { internalType: "uint256", name: "_duration", type: "uint256" },
  ],
  name: "createCall",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const createPutABI = {
  inputs: [
    { internalType: "address", name: "_tokenAddress", type: "address" },
    { internalType: "uint256", name: "_strike", type: "uint256" },
    { internalType: "uint256", name: "_price", type: "uint256" },
    { internalType: "uint256", name: "_duration", type: "uint256" },
  ],
  name: "createPut",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const createRaffleABI = {
  inputs: [
    { internalType: "address", name: "_tokenAddress", type: "address" },
    { internalType: "uint256", name: "_tokenId", type: "uint256" },
    { internalType: "uint256", name: "_ticketValue", type: "uint256" },
    { internalType: "uint256", name: "_ticketNumber", type: "uint256" },
    { internalType: "uint256", name: "_duration", type: "uint256" },
    { internalType: "bool", name: "_mva", type: "bool" },
  ],
  name: "createItem",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const getFeeABI = {
  inputs: [],
  name: "getServiceFee",
  outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  stateMutability: "view",
  type: "function",
};
export const getAllRaffleABI = {
  inputs: [],
  name: "all",
  outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
  stateMutability: "view",
  type: "function",
};
export const getRaffleABI = {
  inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
  name: "get",
  outputs: [
    {
      components: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "tokenAddress", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint256", name: "ticketValue", type: "uint256" },
        { internalType: "uint256", name: "ticketNumber", type: "uint256" },
        { internalType: "uint256", name: "duration", type: "uint256" },
        { internalType: "uint256", name: "startTime", type: "uint256" },
        { internalType: "uint256", name: "endTime", type: "uint256" },
        { internalType: "address[]", name: "tickets", type: "address[]" },
        { internalType: "uint256", name: "winner", type: "uint256" },
        { internalType: "address", name: "paymentToken", type: "address" },
        { internalType: "enum IITEM.TYPES", name: "status", type: "uint8" },
      ],
      internalType: "struct IITEM.ItemObj",
      name: "",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
};
export const getOldRaffleABI = {
  inputs: [],
  name: "settled",
  outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
  stateMutability: "view",
  type: "function",
};
export const removeRaffleABI = {
  inputs: [{ internalType: "bytes32", name: "_hash", type: "bytes32" }],
  name: "removeItem",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const settlRaffleABI = {
  inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
  name: "settleRaffle",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const buyTicketsABI = {
  inputs: [
    { internalType: "bytes32", name: "_id", type: "bytes32" },
    { internalType: "uint256", name: "_tickets", type: "uint256" },
  ],
  name: "buyTickets",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const getApeABI = {
  inputs: [
    { internalType: "address", name: "_collection", type: "address" },
    { internalType: "uint256", name: "_id", type: "uint256" },
  ],
  name: "getApe",
  outputs: [
    {
      components: [
        { internalType: "address", name: "currentRegistry", type: "address" },
        { internalType: "string", name: "location", type: "string" },
        { internalType: "uint256", name: "lastMoveOn", type: "uint256" },
        { internalType: "uint256", name: "freeMoves", type: "uint256" },
        { internalType: "uint256", name: "paidMoves", type: "uint256" },
        { internalType: "uint256", name: "lastReset", type: "uint256" },
        { internalType: "bool", name: "registered", type: "bool" },
      ],
      internalType: "struct Mobility._ape",
      name: "",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
};
export const getUserApesABI = {
  inputs: [{ internalType: "address", name: "_userAddress", type: "address" }],
  name: "getUserApes",
  outputs: [
    {
      components: [
        { internalType: "address", name: "tokenAddress", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      internalType: "struct Locations.hash[]",
      name: "",
      type: "tuple[]",
    },
  ],
  stateMutability: "view",
  type: "function",
};
export const moveToABI = {
  inputs: [
    { internalType: "address", name: "_collection", type: "address" },
    { internalType: "uint256", name: "_id", type: "uint256" },
    { internalType: "string", name: "_location", type: "string" },
  ],
  name: "moveTo",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const worldRegisterABI = {
  inputs: [
    { internalType: "address", name: "_collection", type: "address" },
    { internalType: "uint256", name: "_id", type: "uint256" },
  ],
  name: "registerApe",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const getApesFromLocationABI = {
  inputs: [{ internalType: "string", name: "_location", type: "string" }],
  name: "getApesFromLocation",
  outputs: [
    {
      components: [
        { internalType: "address", name: "tokenAddress", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      internalType: "struct Locations.hash[]",
      name: "",
      type: "tuple[]",
    },
  ],
  stateMutability: "view",
  type: "function",
};
export const getWorldInfoABI = {
  inputs: [],
  name: "getMobilityConf",
  outputs: [
    {
      components: [
        { internalType: "uint256", name: "movePrice", type: "uint256" },
        { internalType: "uint256", name: "freeMoves", type: "uint256" },
        { internalType: "uint256", name: "paidMoves", type: "uint256" },
        { internalType: "uint256", name: "resetBlocks", type: "uint256" },
        { internalType: "address", name: "casinoAddress", type: "address" },
      ],
      internalType: "struct Mobility._mob",
      name: "",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
};
export const getAllTradingABI = {
  inputs: [],
  name: "getAllItems",
  outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
  stateMutability: "view",
  type: "function",
};
export const getTradingABI = {
  inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
  name: "getItem",
  outputs: [
    {
      components: [
        { internalType: "address", name: "owner", type: "address" },
        {
          internalType: "enum TradeMarket.types",
          name: "itemType",
          type: "uint8",
        },
        { internalType: "uint256", name: "num", type: "uint256" },
        {
          components: [
            { internalType: "address", name: "tokenAddress", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
          ],
          internalType: "struct TradeMarket.nft[]",
          name: "nfts",
          type: "tuple[]",
        },
        { internalType: "bytes32[]", name: "linkedItem", type: "bytes32[]" },
      ],
      internalType: "struct TradeMarket.item",
      name: "",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
};
export const getItemOffersABI = {
  inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
  name: "getItemOffers",
  outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
  stateMutability: "view",
  type: "function",
};
export const createTradingABI = {
  inputs: [
    {
      components: [
        { internalType: "address", name: "tokenAddress", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      internalType: "struct TradeMarket.nft[]",
      name: "_nfts",
      type: "tuple[]",
    },
  ],
  name: "createListing",
  outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  stateMutability: "payable",
  type: "function",
};
export const createTradingOfferABI = {
  inputs: [
    { internalType: "bytes32", name: "_targetId", type: "bytes32" },
    {
      components: [
        { internalType: "address", name: "tokenAddress", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
      ],
      internalType: "struct TradeMarket.nft[]",
      name: "_nfts",
      type: "tuple[]",
    },
  ],
  name: "createOffer",
  outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
  stateMutability: "payable",
  type: "function",
};
export const acceptOfferABI = {
  inputs: [
    { internalType: "bytes32", name: "_id", type: "bytes32" },
    { internalType: "bytes32", name: "_offerID", type: "bytes32" },
  ],
  name: "acceptOffer",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const removeTradingABI = {
  inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
  name: "removeItem",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const getTradingFeeABI = {
  inputs: [],
  name: "getFees",
  outputs: [
    { internalType: "uint256", name: "", type: "uint256" },
    { internalType: "uint256", name: "", type: "uint256" },
  ],
  stateMutability: "view",
  type: "function",
};
export const tournamentInfoABI = {
  inputs: [],
  name: "getTournamentInfo",
  outputs: [
    {
      components: [
        { internalType: "uint256", name: "fee", type: "uint256" },
        { internalType: "uint256", name: "nPlayers", type: "uint256" },
        { internalType: "bool", name: "official", type: "bool" },
        { internalType: "bool", name: "running", type: "bool" },
        { internalType: "uint256", name: "prizePool", type: "uint256" },
        { internalType: "bool", name: "timeToPay", type: "bool" },
      ],
      internalType: "struct Tournament._info",
      name: "",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
};
export const playersABI = {
  inputs: [],
  name: "getRegistered",
  outputs: [
    {
      components: [
        { internalType: "address payable", name: "owner", type: "address" },
        { internalType: "address", name: "tokenAddress", type: "address" },
        { internalType: "uint256", name: "tokenId", type: "uint256" },
        { internalType: "uint256", name: "place", type: "uint256" },
      ],
      internalType: "struct Tournament.player[]",
      name: "",
      type: "tuple[]",
    },
  ],
  stateMutability: "view",
  type: "function",
};
export const fightRegisterABI = {
  inputs: [
    { internalType: "address", name: "_tokenAddress", type: "address" },
    { internalType: "uint256", name: "_tokenId", type: "uint256" },
  ],
  name: "Register",
  outputs: [],
  stateMutability: "payable",
  type: "function",
};
export const fightUnregisterABI = {
  inputs: [],
  name: "Unregister",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};
export const getRecordABI = {
  inputs: [
    { internalType: "address", name: "_collection", type: "address" },
    { internalType: "uint256", name: "_id", type: "uint256" },
  ],
  name: "getRecord",
  outputs: [
    {
      components: [
        { internalType: "bool", name: "valid", type: "bool" },
        { internalType: "uint256", name: "win", type: "uint256" },
        { internalType: "uint256", name: "loss", type: "uint256" },
        { internalType: "uint256", name: "tournamentWins", type: "uint256" },
        { internalType: "uint256", name: "trainingDays", type: "uint256" },
        { internalType: "uint256", name: "lastFightOn", type: "uint256" },
        { internalType: "uint256", name: "score", type: "uint256" },
        { internalType: "uint256", name: "level", type: "uint256" },
      ],
      internalType: "struct vnftFightScores.record",
      name: "",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
};