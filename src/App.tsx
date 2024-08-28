import React, { useState, useEffect } from 'react';
import { ConnectButton, getContract } from 'thirdweb/react';
import { defineChain } from "thirdweb/chains";
import thirdwebIcon from './thirdweb.svg';
import { client } from './client';

// Replace with your contract address and ABI
export const contract = getContract({
	client,
	chain: defineChain(656476),
	cfx: "0xcc9Ecf631E0c83142dbcc8891837E10AEf08e2Cc"
});

export function App() {
	const [newProposal, setNewProposal] = useState<string>('');
	const [proposals, setProposals] = useState<string[]>([]);
	const [voteCounts, setVoteCounts] = useState<{ [key: string]: number }>({});
	const [setSelectedProposal] = useState<string>('');


	const fetchProposals = async () => {
		const data = await contract.call("getProposals");
		setProposals(data);
	};

	const fetchVoteCount = async (proposal: string) => {
		const voteCount = await contract.call("getVoteCount", proposal);
		setVoteCounts((prev) => ({
			...prev,
			[proposal]: voteCount.toNumber(),
		}));
	};

	const handleCreateProposal = async () => {
		if (newProposal) {
			await contract.call("createProposal", newProposal);
			setNewProposal('');
			fetchProposals();
		}
	};

	const handleVote = async (proposal: string) => {
		await contract.call("vote", proposal);
		setSelectedProposal(proposal);
		fetchVoteCount(proposal);
	};

	useEffect(() => {
		fetchProposals();
	}, []);

	return (
		<main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
			<div className="py-20">
				<header className="flex justify-center mb-10">
					<img src={thirdwebIcon} alt="Thirdweb Icon" className="h-10 w-10" />
					<h1 className="text-4xl font-bold ml-2">FlipDAO</h1>
				</header>

				<div className="flex justify-center mb-10">
					<ConnectButton
						client={client}
					/>
				</div>

				<section className="p-10 bg-gray-100 rounded-lg shadow-lg">
					<h2 className="text-2xl font-bold mb-4">Create Proposal</h2>
					<div className="flex justify-center mb-4">
						<input
							type="text"
							value={newProposal}
							onChange={(e) => setNewProposal(e.target.value)}
							className="border p-2 rounded-lg mr-2"
							placeholder="Enter proposal description"
						/>
						<button
							contractAddress={contractAddress}
							action={handleCreateProposal}
							className="bg-green-500 text-white font-bold py-2 px-4 rounded"
						>
							Submit Proposal
						</button>
					</div>

					<h2 className="text-2xl font-bold mt-10 mb-4">Vote on Proposals</h2>
					{proposals.length === 0 ? (
						<p>Loading proposals...</p>
					) : (
						proposals.map((proposal, index) => (
							<div key={index} className="text-center mb-6">
								<button
									contractAddress={contractAddress}
									action={() => handleVote(proposal)}
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								>
									Vote for {proposal}
								</button>
								<p className="mt-2 text-xl font-semibold">
									{voteCounts[proposal] || 0} votes
								</p>
							</div>
						))
					)}
				</section>
			</div>
		</main>
	);
}

export default App;
