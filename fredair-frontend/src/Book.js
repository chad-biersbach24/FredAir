import { Fragment, useState } from "react";
import Combobox from "./Combobox";
import DialogBox from "./Dialog";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

function Book(props) {
	const airports = [
		{ id: 1, name: "Select Airport" },
		{ id: 2, name: "BUF (Buffalo Niagara International Airport)" },
		{ id: 3, name: "CLT (Charlotte Douglas International Airport)" },
		{
			id: 4,
			name: "ATL (Hartsfield-Jackson Atlanta International Airport)",
		},
		{ id: 5, name: "DFW (Dallas/Fort Worth International Airport)" },
		{ id: 6, name: "MSN (Dane County Regional Airport)" },
	];

	const tripTypes = ["Round-trip", "One-way"];
	const { authenticated, setAuthenticated } = props;
	const today = new Date().toISOString().split("T")[0];
	const [departingAirport, setDepartingAirport] = useState(airports[0]);
	const [arrivingAirport, setArrivingAirport] = useState(airports[0]);
	const [departDate, setDepartDate] = useState(today);
	const [arriveDate, setArriveDate] = useState(today);
	const [tripType, setTripType] = useState(tripTypes[0]);
	const [dialogState, setDialogState] = useState(false);

	const authUser = () => {
		const tempValue = !authenticated;
		setAuthenticated(tempValue);
	};

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

	const closeModal = () => {
		setDialogState(false);
	};

	const openModal = () => {
		setDialogState(true);
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

	return (
		<div className="text-white text-center space-y-1">
			<p>Select airports</p>
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
					className="py-2 pl-3 pr-3 text-sm text-gray-900 focus:ring-0 w-full rounded-lg shadow-md"
					type="date"
					id="depart-date"
					name="depart-date"
					value={departDate}
					min="2022-05-01"
					max="2022-08-31"
					onChange={handleDateSelection}
				/>
				<input
					className="py-2 pl-3 pr-3 text-sm text-gray-900 focus:ring-0 w-full rounded-lg shadow-md"
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
				className="bg-white/[0.25] hover:bg-white/[0.5] text-white font-bold py-2 w-full rounded-xl"
				onClick={openModal}>
				Search flights
			</button>
			<DialogBox closeDialog={closeModal} dialogState={dialogState}>
				{authenticated ? (
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
										onClick={closeModal}>
										Close
									</button>
								</div>
							</>
						) : (
							<>
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-gray-900">
									Flights between{" "}
									{departingAirport.name.slice(0, 3)} and{" "}
									{arrivingAirport.name.slice(0, 3)}
								</Dialog.Title>

								<div className="mt-2">
									<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
										asdf
									</p>
								</div>

								<div className="mt-4 space-x-2">
									<button
										type="button"
										className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
										onClick={closeModal}>
										Close
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
								onClick={authUser}>
								Log in
							</button>
							<button
								type="button"
								className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
								onClick={closeModal}>
								Close
							</button>
						</div>
					</>
				)}
			</DialogBox>
		</div>
	);
}

export default Book;
