/** @format */

import { item_address } from "config/contractAddress";
import { useWallet } from "./useWallet";
import { useEffect, useState } from "react";
import { getAllRaffleABI, getOldRaffleABI, getRaffleABI } from "abi/abis";

export const useGetRaffle = () => {
	const [loading, setLoading] = useState(true);
	const [raffles, setRaffles] = useState<any[]>([]);
	const [myRaffles, setMyRaffles] = useState<any[]>([]);
	const [oldRaffles, setOldRaffles] = useState<any[]>([]);

	const { connex, isConnected, address } = useWallet();
	useEffect(() => {
		setLoading(true)
		if (connex && isConnected && address) {
			(async () => {
				const raffleAddressMethod = connex.thor
					.account(item_address)
					.method(getAllRaffleABI);
				const oldRaffleAddressMethod = connex.thor
					.account(item_address)
					.method(getOldRaffleABI);
				const raffleMethod = connex.thor
					.account(item_address)
					.method(getRaffleABI);

				const raffleAddress = await raffleAddressMethod.call();
				const oldRaffleAddress = await oldRaffleAddressMethod.call()
				const tempRaffle: any = [];
				const tempOldRaffle: any = []

				for (let i of raffleAddress.decoded[0]) {
					const raffleData = await raffleMethod.call(i);
					const item = {
						owner: raffleData["decoded"]["0"][0],
						tokenAddress: raffleData["decoded"]["0"][1],
						tokenId: raffleData["decoded"]["0"][2],
						ticketValue: raffleData["decoded"]["0"][3],
						ticketNumber: raffleData["decoded"]["0"][4],
						duration: raffleData["decoded"]["0"][5],
						startTime: raffleData["decoded"]["0"][6],
						endTime: raffleData["decoded"]["0"][7],
						nTickets: raffleData["decoded"]["0"][8].length,
						winner: raffleData["decoded"]["0"][9],
						paymentToken: raffleData["decoded"]["0"][10],
						status: raffleData["decoded"]["0"][11],
						itemId: i,
					};
					tempRaffle.push(item)
				}
				const tempMyRaffle = tempRaffle.filter(
					(item: any) => item.owner?.toLowerCase() === address?.toLowerCase()
				);
				for (let i of oldRaffleAddress.decoded[0]) {
					const oldraffleData = await raffleMethod.call(i);
					const item = {
						owner: oldraffleData["decoded"]["0"][0],
						tokenAddress: oldraffleData["decoded"]["0"][1],
						tokenId: oldraffleData["decoded"]["0"][2],
						ticketValue: oldraffleData["decoded"]["0"][3],
						ticketNumber: oldraffleData["decoded"]["0"][4],
						duration: oldraffleData["decoded"]["0"][5],
						startTime: oldraffleData["decoded"]["0"][6],
						endTime: oldraffleData["decoded"]["0"][7],
						nTickets: oldraffleData["decoded"]["0"][8].length,
						winner: oldraffleData["decoded"]["0"][9],
						paymentToken: oldraffleData["decoded"]["0"][10],
						status: oldraffleData["decoded"]["0"][11],
						itemId: i,
					};
					tempOldRaffle.push(item)
				}

				setRaffles(tempRaffle);
				setMyRaffles(tempMyRaffle);
				setOldRaffles(tempOldRaffle)
				setLoading(false);
			})();
		} else {
			setLoading(false);
			setRaffles([]);
		}
	}, [connex, isConnected, address]);

	return { raffles, loading, myRaffles, oldRaffles };
};
