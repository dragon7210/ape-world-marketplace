import { months } from "constant";

export const shortenAddress = (address: string | null | undefined) => {
  return address
    ? address.slice(0, 4) + "..." + address.slice(-4)
    : "Invalid Address";
};
export const getCollectionName = (
  collectionOptions: any,
  tokenAddress: string
) => {
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

export const getEndTime = (end_block: string, thor: Connex.Thor) => {
  if (thor) {
    var block_info = thor.status["head"];
    const current_block = block_info["number"];
    const current_unix = block_info["timestamp"];
    const delta_block = parseInt(end_block) - current_block;
    const delta_seconds = delta_block * 10;
    const end_unixtimestamp = current_unix + delta_seconds;
    return timeConverter(end_unixtimestamp);
  }
};

export const differentTime = (time: string, thor: Connex.Thor) => {
  let endTime = getEndTime(time, thor);
  let returnTime;
  if (endTime) {
    let temp = (new Date(endTime).getTime() - new Date().getTime()) / 1000 / 60;
    returnTime =
      temp > 0
        ? Math.floor(temp / 60) + "h " + Math.floor(temp % 60) + "min"
        : "-" +
          Math.abs(Math.floor(temp / 60 + 1)) +
          "h " +
          Math.abs(Math.floor(temp % 60)) +
          "min";
  }
  return returnTime;
};

export const get_image = async (_collection: string, _tokenId: string) => {
  if (_collection && _tokenId) {
    const payload = `query { getToken( tokenId: "${_tokenId}" smartContractAddress: "${_collection}") { assets {url} name rank }}`;
    let data;
    try {
      const response = await fetch(
        "https://mainnet.api.worldofv.art/graphql/",
        {
          method: "POST",
          body: JSON.stringify({ query: payload }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const temp = await response.json();
      data = {
        img: temp.data.getToken.assets[1].url,
        name: temp.data.getToken.name,
        rank: temp.data.getToken.rank,
      };
    } catch (error) {
      console.error("Error:", error);
    }
    return data;
  }
};
