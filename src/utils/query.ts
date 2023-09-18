/** @format */

import { gql } from "@apollo/client";

export const searchNFTs = gql`
  fragment MarketplaceCollection on MarketplaceCollection {
    collectionId
    smartContractAddress
    creatorAddress
    name
    customUrl
    thumbnailImageUrl
  }

  fragment Asset on AssetDTO {
    size
    url
  }

  fragment MarketplaceToken on MarketplaceToken {
    tokenId
    smartContractAddress
    name
    collectionId
    collection {
      ...MarketplaceCollection
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

export const getToken = ({ tokenId, smartContractAddress }: { tokenId: String, smartContractAddress: String }) => gql`
query { getToken( tokenId: "${tokenId}" smartContractAddress: "${smartContractAddress}") { assets {url} rank}}
`;
