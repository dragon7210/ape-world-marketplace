export const shortenAddress = (address: string | undefined) => {
  return address
    ? address.slice(0, 4) + "..." + address.slice(-4)
    : "Invalid Address";
};
export const getCollectionName = (collectionOptions: any, tokenAddress: string) => {
  let temp = collectionOptions?.filter(
    (item: any) =>
      item.smartContractAddress?.toLowerCase() === tokenAddress?.toLowerCase()
  );
  if (temp?.length !== 0) {
    return temp[0]?.name;
  }
};