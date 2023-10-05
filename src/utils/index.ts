import { months } from "constant";

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
export const timeConverter = (UNIX_timestamp: number) => {
  let a = new Date(UNIX_timestamp * 1000);
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours();
  let min = a.getMinutes();
  let sec = a.getSeconds();
  let time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
};

export const getEndTime = (end_block: string, connex: any) => {
  if (connex) {
    var block_info = connex.thor.status["head"];
    const current_block = block_info["number"];
    const current_unix = block_info["timestamp"];
    const delta_block = parseInt(end_block) - current_block;
    const delta_seconds = delta_block * 10;
    const end_unixtimestamp = current_unix + delta_seconds;
    return timeConverter(end_unixtimestamp);
  }
};