/** @format */

import { gql } from "@apollo/client";

export const searchNFTs = gql`
  fragment MarketplaceCollection on MarketplaceCollection {
    collectionId
    blockchainId
    smartContractAddress
    stakingContractAddresses
    creatorAddress
    name
    customUrl
    thumbnailImageUrl
    isVerified
    isVisible
    type
    importedAt
  }

  fragment Asset on AssetDTO {
    size
    url
    mimeType
  }

  fragment MarketplaceUser on MarketplaceUser {
    address
    name
    customUrl
    blacklisted
    verified
    verifiedLevel

    assets {
      ...Asset
    }
  }

  fragment MarketplaceEdition on MarketplaceEdition {
    editionId
    ownerAddress
    saleId
    salePrice
    saleAddressVIP180
    stakingContractAddress
    cooldownEnd
  }

  fragment MarketplaceToken on MarketplaceToken {
    tokenId
    smartContractAddress
    name
    creatorAddress
    editionsCount
    editionsOnSale
    categories
    attributes
    score
    rank
    collectionId
    mintedAt
    minimumSaleId
    minimumSalePrice
    minimumSaleAddressVIP180
    highestOfferId
    highestOfferPrice
    highestOfferAddressVIP180
    highestOfferEndTime
    minimumAuctionId
    minimumAuctionReservePrice
    minimumAuctionHighestBid
    minimumAuctionAddressVIP180
    minimumAuctionEndTime
    stakingEarnings
    creator {
      ...MarketplaceUser
    }
    collection {
      ...MarketplaceCollection
    }
    editions {
      ...MarketplaceEdition
    }
    assets {
      ...Asset
    }
  }

  query GetTokens(
    $pagination: PaginationArgs
    $filters: GetTokensFilterArgs
    $sortBy: SortTokensByEnum
  ) {
    tokens(pagination: $pagination, filters: $filters, sortBy: $sortBy) {
      items {
        ...MarketplaceToken
      }
      meta {
        total
        hasMore
      }
    }
  }
`;

export const getCollections = gql`
  query GetOwnedWoVCollections($ownerAddress: String) {
    collections: getWoVCollections(ownerAddress: $ownerAddress) {
      collectionId
      name
      stakingContractAddresses
      customUrl
      thumbnailImageUrl
      isVerified
      smartContractAddress
    }
  }
`;
