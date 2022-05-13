import { Fragment, useState } from "react";
import Combobox from "./Combobox";
import DialogBox from "./Dialog";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

function Book(props) {
	const tripTypes = ["Round-trip", "One-way"];
	const {
		loggedIn,
		loginInfo,
		setLoggedIn,
		setloginDialogState,
		selectedFlight,
		setSelectedFlight,
		setFlightLookupError,
		departingAirport,
		setDepartingAirport,
		arrivingAirport,
		setArrivingAirport,
		bookDialogState,
		setBookDialogState,
		airports,
		confirmNum,
		setConfirmNum,
	} = props;
	const today = new Date().toISOString().split("T")[0];
	const [departDate, setDepartDate] = useState(today);
	const [arriveDate, setArriveDate] = useState(today);
	const [tripType, setTripType] = useState(tripTypes[0]);
	const [flightDialogState, setFlightDialogState] = useState(false);
	const [flightResults, setFlightResults] = useState([{}]);
	const [bookDebounce, setBookDebounce] = useState(false);
	const [searchFlightsError, setSearchFlightsError] = useState("");
	const [bookFlightError, setBookFlightError] = useState("");
	const [bookingSuccess, setBookingSuccess] = useState(false);

	//function handleDepartingAirportChange(value){
	const handleDepartingAirportChange = (value) => {
		setDepartingAirport(value);
	};

	//function handleArrivingAirportChange(value){
	const handleArrivingAirportChange = (value) => {
		setArrivingAirport(value);
	};

	const submitFlightInformation = (event) => {
		const { name: departName } = departingAirport;
		const { name: arriveName } = arrivingAirport;
		console.log(departName);
		console.log(arriveName);
	};

	const handleDateSelection = (event) => {
		const { name, value } = event.target;
		switch (name) {
			case "depart-date":
				setDepartDate(value);
			case "arrive-date":
				setArriveDate(value);
			default:
				break;
		}
	};

	const handleTripTypeChange = (event) => {
		const { name, value } = event.target;
		setTripType(value);
	};

	const [getFlightsDebounce, setGetFlightsDebounce] = useState(false);
	const getFlights = async () => {
		if (!getFlightsDebounce) {
			setGetFlightsDebounce(true);
			const departDateObj = new Date(departDate);
			const departDay = departDateObj.getDate() + 1;
			const departMonth = departDateObj.getMonth() + 1;
			const formattedDepartDate = `${
				departMonth < 9 ? "0" + departMonth : departMonth
			}/${
				departDay < 9 ? "0" + departDay : departDay
			}/${departDateObj.getFullYear()}`;

			const arriveDateObj = new Date(arriveDate);
			const arriveDay = arriveDateObj.getDate() + 1;
			const arriveMonth = arriveDateObj.getMonth() + 1;
			const formattedArriveDate = `${
				arriveMonth < 9 ? "0" + arriveMonth : arriveMonth
			}/${
				arriveDay < 9 ? "0" + arriveDay : arriveDay
			}/${arriveDateObj.getFullYear()}`;

			const url = `http://localhost:5000/api/flights?from=${departingAirport.name}&to=${arrivingAirport.name}&departure_date=${formattedDepartDate}&arrival_date=${formattedArriveDate}`;
			try {
				const resp = await axios.get(url, {
					headers: {
						authorization: `Bearer ${loginInfo.token}`,
					},
				});
				if (resp.data.length > 0) {
					setFlightResults(resp.data);
				} else {
					setFlightResults([
						{
							departure_time: `No results found.`,
							cost: " ",
						},
					]);
				}
				setFlightDialogState(true);
				setGetFlightsDebounce(false);
			} catch (err) {
				console.error(err);
				if (loggedIn) {
					setSearchFlightsError("Error: " + err.message);
				} else {
					setFlightDialogState(true);
				}
				setGetFlightsDebounce(false);
			}
		}
	};

	const genRanCode = (length) => {
		var result = "";
		var characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	};

	const bookFlight = async () => {
		// post request not get
		if (!bookDebounce) {
			setBookDebounce(true);
			const departDateObj = new Date(departDate);
			const departDay = departDateObj.getDate() + 1;
			const departMonth = departDateObj.getMonth() + 1;
			const formattedDepartDate = `${
				departMonth < 9 ? "0" + departMonth : departMonth
			}/${
				departDay < 9 ? "0" + departDay : departDay
			}/${departDateObj.getFullYear()}`;

			const arriveDateObj = new Date(arriveDate);
			const arriveDay = arriveDateObj.getDate() + 1;
			const arriveMonth = arriveDateObj.getMonth() + 1;
			const formattedArriveDate = `${
				arriveMonth < 9 ? "0" + arriveMonth : arriveMonth
			}/${
				arriveDay < 9 ? "0" + arriveDay : arriveDay
			}/${arriveDateObj.getFullYear()}`;

			const confirmationNum = genRanCode(4);
			setConfirmNum(confirmationNum);

			const postData = {
				confirmation_num: confirmationNum,
				arrival_time: selectedFlight.arrival_time,
				departure_time: selectedFlight.departure_time,
				departure_date: selectedFlight.departure_date,
				arrival_date: selectedFlight.arrival_date,
				flight_id: selectedFlight.flight_id,
				from: selectedFlight.from,
				to: selectedFlight.to,
				name: loginInfo.name,
				email: loginInfo.email,
				amount_paid: selectedFlight.cost ? selectedFlight.cost : "$100",
				roundtrip: tripType == tripTypes[0] ? true : false,
			};

			try {
				const resp = await axios.post(
					"http://localhost:5000/api/reservations",
					postData,
					{
						headers: {
							authorization: `Bearer ${loginInfo.token}`,
						},
					}
				);
				console.log(resp.data);
				if (resp.data && resp.data._id) {
					setBookingSuccess(true);
				}
				setBookDialogState(true);
				setBookDebounce(false);
				setBookFlightError("");
			} catch (err) {
				console.error(err);
				setBookFlightError("Error: " + err.message);
				setBookDebounce(false);
			}
		}
	};

	const handleBookSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<div className="text-white text-center space-y-1">
			<p>Select depature and arrival airports</p>
			<div className="flex space-x-2">
				<Combobox
					value={departingAirport}
					onChange={handleDepartingAirportChange}
					data={airports}
				/>
				<Combobox
					value={arrivingAirport}
					onChange={handleArrivingAirportChange}
					data={airports}
				/>
			</div>
			<p>Select departure and arrival dates</p>
			<div className="flex space-x-2">
				<input
					className="py-2 pl-3 pr-3 text-sm text-gray-900 w-full rounded-md"
					type="date"
					id="depart-date"
					name="depart-date"
					value={departDate}
					min="2022-05-01"
					max="2022-08-31"
					onChange={handleDateSelection}
				/>
				<input
					className="py-2 pl-3 pr-3 text-sm text-gray-900 w-full rounded-md"
					type="date"
					id="arrive-date"
					name="arrive-date"
					value={arriveDate}
					min="2022-05-01"
					max="2022-08-31"
					onChange={handleDateSelection}
				/>
			</div>
			<div className="flex justify-left space-x-2 p-2">
				{tripTypes.map((type) => (
					<div key={type} className="form-check form-check-inline">
						<input
							className="form-check-input form-check-input rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
							type="radio"
							name="trip-type"
							id={type}
							value={type}
							onChange={handleTripTypeChange}
							checked={tripType === type}
						/>
						<label
							className="form-check-label inline-block text-white"
							htmlFor={type}>
							{type}
						</label>
					</div>
				))}
			</div>
			<button
				className="bg-white/[0.25] hover:bg-white/[0.5] text-white font-bold py-2 w-full rounded-md"
				onClick={() => {
					getFlights();
				}}>
				Search flights
			</button>
			{searchFlightsError && (
				<p className="text-red-500"> {searchFlightsError} </p>
			)}
			<DialogBox
				closeDialog={() => setFlightDialogState(false)}
				dialogState={flightDialogState}>
				{loggedIn ? (
					<>
						{departingAirport.name == airports[0].name ||
						arrivingAirport.name == airports[0].name ||
						departingAirport.name == arrivingAirport.name ? (
							<>
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900">
									Error
								</Dialog.Title>
								<div className="mt-2">
									<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
										You have missing departure and arrival
										information. Please fill out the missing
										information and search again.
									</p>
								</div>
								<div className="mt-4 space-x-2">
									<button
										type="button"
										className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
										onClick={() =>
											setFlightDialogState(false)
										}>
										Close
									</button>
								</div>
							</>
						) : (
							<>
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900">
									Flights between {departingAirport.name} and{" "}
									{arrivingAirport.name}
								</Dialog.Title>
								<div className="mt-2">
									<p className="text-sm text-gray-500">
										Select one of the flights below to book.
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
													Cost
												</div>
											</div>
										</div>
										<div class="table-row-group text-gray-500">
											{flightResults.map((obj) => {
												return (
													<div
														className="table-row hover:bg-gray-100"
														key={obj.id}
														onClick={() => {
															setFlightDialogState(
																false
															);
															setBookDialogState(
																true
															);
															setSelectedFlight(
																obj
															);
														}}>
														<div class="table-cell pt-2 pb-2 border-b border-gray-200">
															{obj[
																"departure time"
															]
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
											})}
										</div>
									</div>
								</div>

								<div className="mt-4 space-x-2">
									<button
										type="button"
										className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
										onClick={() =>
											setFlightDialogState(false)
										}>
										Cancel
									</button>
								</div>
							</>
						)}
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
								You need to be logged in to search for flights.
								Please log in and try again.
							</p>
						</div>
						<div className="mt-4 space-x-2">
							<button
								type="button"
								className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
								onClick={() => {
									setFlightDialogState(false);
									setloginDialogState(true);
								}}>
								Login
							</button>
							<button
								type="button"
								className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
								onClick={() => setFlightDialogState(false)}>
								Close
							</button>
						</div>
					</>
				)}
			</DialogBox>

			<DialogBox
				closeDialog={() => {
					setBookingSuccess(false);
					setBookDialogState(false);
					setBookDebounce(false);
					setBookFlightError("");
				}}
				dialogState={bookDialogState}>
				<Dialog.Title
					as="h3"
					className="text-lg font-medium leading-6 text-gray-900">
					Flight Booking
				</Dialog.Title>
				<div className="mt-2">
					<div className="flex space-x-1">
						<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
							Departing airport:
						</p>
						<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
							{departingAirport.name}
						</p>
					</div>
					<div className="flex space-x-1">
						<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
							Arriving airport:
						</p>
						<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
							{arrivingAirport.name}
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
										Cost
									</div>
								</div>
							</div>
							<div class="table-row-group text-gray-500">
								<div className="table-row hover:bg-gray-100">
									<div class="table-cell pt-2 pb-2 border-b border-gray-200">
										{selectedFlight.departure_time}
									</div>
									<div class="table-cell pt-2 pb-2 border-b border-gray-200">
										{selectedFlight.arrival_time}
									</div>
									<div class="table-cell pt-2 pb-2 border-b border-gray-200">
										{selectedFlight.seats_avail}
									</div>
									<div class="table-cell pt-2 pb-2 border-b border-gray-200">
										{selectedFlight.cost
											? selectedFlight.cost
											: "$100"}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{!bookingSuccess ? (
					<form onSubmit={handleBookSubmit}>
						<div className="mt-4">
							<div class="mb-2">
								<label
									class="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="street">
									Billing Address
								</label>
								<div className="space-y-2">
									<input
										class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
										id="street"
										type="text"
										placeholder="Street"
									/>
									<input
										class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
										id="city"
										type="text"
										placeholder="City"
									/>
									<input
										class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
										id="state"
										type="text"
										placeholder="State"
									/>
									<input
										class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
										id="zipcode"
										type="text"
										placeholder="ZIP Code"
									/>
								</div>
							</div>
							<div class="mb-2">
								<label
									class="block text-gray-700 text-sm font-bold mb-2"
									htmlFor="nameoncard">
									Payment information
								</label>
								<div className="space-y-2">
									<input
										class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
										id="nameoncard"
										type="text"
										placeholder="Name on card"
									/>
									<input
										class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
										id="cardnumber"
										type="text"
										placeholder="Card number"
									/>
									<div className="flex space-x-2">
										<input
											class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
											id="expirationdate"
											type="text"
											placeholder="Expiration (mm/yy)"
										/>
										<input
											class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
											id="securitycode"
											type="text"
											placeholder="Security code"
										/>
									</div>
								</div>
							</div>
							{bookFlightError && (
								<p className="text-red-500">
									{" "}
									{bookFlightError}{" "}
								</p>
							)}
						</div>
						<div className="mt-4 space-x-2">
							<button
								disabled={bookDebounce}
								type="submit"
								onClick={() => bookFlight()}
								className={`${
									bookDebounce
										? "cursor-wait"
										: "cursor-pointer"
								} justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}>
								{bookDebounce && (
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
								)}
								Book flight
							</button>
							<button
								type="button"
								className="justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
								onClick={() => {
									setBookDialogState(false);
									setBookDebounce(false);
									setBookFlightError("");
								}}>
								Cancel
							</button>
						</div>
					</form>
				) : (
					<div className="mt-4">
						<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
							Success! Flight booked.
						</p>
						<div className="flex space-x-1">
							<p className="text-sm font-bold text-gray-500 max-h-[100px] overflow-y-scroll">
								Confirmation number:
							</p>
							<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
								{confirmNum}
							</p>
						</div>
						<div className="mt-4 space-x-2">
							<button
								type="button"
								className="justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
								onClick={() => {
									setBookingSuccess(false);
									setBookDialogState(false);
									setBookDebounce(false);
									setBookFlightError("");
								}}>
								Close
							</button>
						</div>
					</div>
				)}
			</DialogBox>
		</div>
	);
}

export default Book;
