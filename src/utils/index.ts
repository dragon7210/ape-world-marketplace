export const shortenAddress = (address: string | undefined) => {
  return address
    ? address.slice(0, 4) + "..." + address.slice(-4)
    : "Invalid Address";
};
