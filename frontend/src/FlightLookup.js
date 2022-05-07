import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import DialogBox from "./Dialog";
import axios from "axios";

export default function FlightLookup(props) {
	const test = () => {};
	const {
		loggedIn,
		loginInfo,
		setLoggedIn,
		setloginDialogState,
		selectedFlight,
		setSelectedFlight,
		departingAirport,
		setDepartingAirport,
		arrivingAirport,
		setArrivingAirport,
		bookDialogState,
		setBookDialogState,
	} = props;

	const [flightLookupDialogState, setFlightLookupDialogState] =
		useState(false);
	const [flightLookupDebounce, setFlightLookupDebounce] = useState(false);
	const [flightLookupError, setFlightLookupError] = useState("");
	const [flightConfirmCode, setFlightConfirmCode] = useState("");
	const [flightLookupResults, setFlightLookupResults] = useState([{}]);
	const [cancelFlightError, setCancelFlightError] = useState("");
	const [cancelFlightDebounce, setCancelFlightDebounce] = useState(false);

	const cancelFlight = async () => {
		if (!cancelFlightDebounce) {
			setCancelFlightDebounce(true);
			try {
				console.log(flightLookupResults[0]._id);
				const resp = await axios.delete(
					`http://localhost:5000/api/flights/${flightLookupResults[0]._id}`,
					{
						headers: {
							authorization: `Bearer ${loginInfo.token}`,
						},
					}
				);
				console.log(resp.data);
				setCancelFlightError("");
				setCancelFlightDebounce(false);
			} catch (err) {
				console.error(err);
				setCancelFlightError(
					"Could not cancel flight, error: " + err.message
				);
				setCancelFlightDebounce(false);
			}
		}
	};

	const flightLookup = async () => {
		if (!flightLookupDebounce) {
			setFlightLookupDebounce(true);
			console.log(flightConfirmCode);
			try {
				const resp = await axios.get(
					`http://localhost:5000/api/reservations?confirmation_num=${flightConfirmCode}`,
					{
						headers: {
							authorization: `Bearer ${loginInfo.token}`,
						},
					}
				);
				setFlightLookupError("");
				setFlightLookupResults(resp.data);
				setFlightLookupDialogState(true);
				setFlightLookupDebounce(false);
			} catch (err) {
				console.error(err);
				setFlightLookupError("Error: " + err.message);
				setFlightLookupDebounce(false);
			}
		}
	};
	return (
		<>
			<div className="text-white space-y-2">
				<p>Search for your flight reservation</p>
				<input
					className="py-2 pl-3 pr-3 text-sm text-gray-900 focus:ring-0 w-full rounded-md"
					placeholder="Confirmation number*"
					type="text"
					name="confirmnnum"
					value={flightConfirmCode}
					onChange={() => {
						setFlightConfirmCode();
					}}
				/>
				<button
					className={`${
						flightLookupDebounce ? "cursor-wait" : "cursor-pointer"
					} bg-white/[0.25] hover:bg-white/[0.5] text-white font-bold py-2 w-1/3 rounded-md`}
					onClick={() => {
						setCancelFlightError("");
						setFlightLookupResults([{}]);
						flightLookup();
					}}>
					{flightLookupDebounce ? (
						<svg
							role="status"
							class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
					) : (
						""
					)}
					Search
				</button>
				{flightLookupError && (
					<p className="text-red-500"> {flightLookupError} </p>
				)}
			</div>

			<DialogBox
				closeDialog={() => {
					setFlightLookupDialogState(false);
					setFlightLookupDebounce(false);
				}}
				dialogState={flightLookupDialogState}>
				{loggedIn ? (
					<>
						<Dialog.Title
							as="h3"
							className="text-lg font-medium leading-6 text-gray-900">
							Flight lookup
						</Dialog.Title>
						<div className="mt-2 mb-2">
							<p className="text-sm text-gray-500">
								Below is your reservation information.
							</p>
						</div>
						<div className="flex space-x-1">
							<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
								Traveler name:
							</p>
							<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
								{flightLookupResults[0].name}
							</p>
						</div>
						<div className="flex space-x-1">
							<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
								Confirmation number:
							</p>
							<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
								{flightLookupResults[0].confirmation_num}
							</p>
						</div>
						<div className="flex space-x-1">
							<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
								Departing airport:
							</p>
							<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
								{flightLookupResults[0].from}
							</p>
						</div>
						<div className="flex space-x-1">
							<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
								Arriving airport:
							</p>
							<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
								{flightLookupResults[0].to}
							</p>
						</div>
						<div className="flex space-x-1">
							<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
								Departure date:
							</p>
							<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
								{`${new Date(
									flightLookupResults[0].departure_date
								).getMonth()}/${new Date(
									flightLookupResults[0].departure_date
								).getDate()}/${new Date(
									flightLookupResults[0].departure_date
								).getFullYear()}`}
							</p>
						</div>
						<div className="flex space-x-1">
							<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
								Arrival date:
							</p>
							<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
								{`${new Date(
									flightLookupResults[0].arrival_date
								).getMonth()}/${new Date(
									flightLookupResults[0].arrival_date
								).getDate()}/${new Date(
									flightLookupResults[0].arrival_date
								).getFullYear()}`}
							</p>
						</div>
						<div className="max-h-[30vh] overflow-y-scroll mt-2">
							<div className="table w-full">
								<div class="table-header-group">
									<div class="table-row">
										<div class="table-cell text-left pb-2 border-b border-gray-200">
											Departure Time
										</div>
										<div class="table-cell text-left pb-2 border-b border-gray-200">
											Arrival Time
										</div>
										<div class="table-cell text-left pb-2 border-b border-gray-200">
											Seats Left
										</div>
										<div class="table-cell text-left pb-2 border-b border-gray-200">
											Amt. Paid
										</div>
									</div>
								</div>
								<div class="table-row-group text-gray-500">
									{flightLookupResults.length > 0 ? (
										flightLookupResults.map((obj) => {
											return (
												<div
													className="table-row hover:bg-gray-100"
													key={obj._id}>
													<div class="table-cell pt-2 pb-2 border-b border-gray-200">
														{obj["departure time"]
															? obj[
																	"departure time"
															  ]
															: obj.departure_time}
													</div>
													<div class="table-cell pt-2 pb-2 border-b border-gray-200">
														{obj.arrival_time}
													</div>
													<div class="table-cell pt-2 pb-2 border-b border-gray-200">
														{obj.seats_avail}
													</div>
													<div class="table-cell pt-2 pb-2 border-b border-gray-200">
														{obj.cost
															? obj.cost
															: "$100"}
													</div>
												</div>
											);
										})
									) : (
										<></>
									)}
								</div>
							</div>
						</div>
						<div className="mt-2">
							<p className="text-sm text-gray-500 w-full">
								You might be eligible for a full refund on your
								flight if it is canceled.
							</p>
						</div>
						<div className="flow-root mt-2 space-y-2 space-x-4">
							<p className="float-left text-sm text-gray-500 w-2/3">
								Flights canceled in 7 days receive a full
								refund, 5 days receive 50%, and less than 3
								days, there is no refund.
							</p>
							<button
								type="button"
								className={`${
									cancelFlightDebounce
										? "cursor-wait"
										: "cursor-pointer"
								} float-right h-fit inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
								onClick={() => cancelFlight()}>
								{cancelFlightDebounce ? (
									<svg
										role="status"
										class="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
											fill="currentColor"
										/>
										<path
											d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
											fill="currentFill"
										/>
									</svg>
								) : (
									""
								)}
								Cancel
							</button>
						</div>
						<div className="mt-2">
							{cancelFlightError && (
								<p className="text-red-500">
									{" "}
									{cancelFlightError}{" "}
								</p>
							)}
						</div>

						<div className="mt-4 space-x-2">
							<button
								type="button"
								className="h-fit inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
								onClick={() => {
									setFlightLookupDialogState(false);
									setFlightLookupDebounce(false);
								}}>
								Close
							</button>
						</div>
					</>
				) : (
					<>
						<Dialog.Title
							as="h3"
							className="text-lg font-medium leading-6 text-gray-900">
							Error
						</Dialog.Title>
						<div className="mt-2">
							<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
								You need to be logged in to look up flight
								information. Please log in and try again.
							</p>
						</div>
						<div className="mt-4 space-x-2">
							<button
								type="button"
								className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
								onClick={() => {
									setFlightLookupDialogState(false);
									setloginDialogState(true);
								}}>
								Login
							</button>
							<button
								type="button"
								className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
								onClick={() =>
									setFlightLookupDialogState(false)
								}>
								Close
							</button>
						</div>
					</>
				)}
			</DialogBox>
		</>
	);
}
