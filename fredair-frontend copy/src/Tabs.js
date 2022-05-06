import { Tab } from "@headlessui/react";
import Book from "./Book";
import FlightLookup from "./FlightLookup";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function MainTabs(props) {
	const { loggedIn, loginInfo, setLoggedIn, setloginDialogState } = props;

	return (
		<div className="w-full max-w-sm px-2 sm:px-0">
			<Tab.Group>
				<Tab.List className="flex p-1 space-x-2 rounded-full">
					<Tab
						className={({ selected }) =>
							classNames(
								"px-8 py-2.5 text-md leading-5 font-medium text-blue-700",
								"focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 rounded-full",
								selected
									? "bg-white shadow"
									: "bg-white/[0.12] text-blue-100 hover:bg-white/[0.24] hover:text-white"
							)
						}>
						Book
					</Tab>
					<Tab
						className={({ selected }) =>
							classNames(
								"px-8 py-2.5 text-md leading-5 font-medium text-blue-700",
								"focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 rounded-full",
								selected
									? "bg-white shadow"
									: "bg-white/[0.12] text-blue-100 hover:bg-white/[0.24] hover:text-white"
							)
						}>
						Flight lookup
					</Tab>
				</Tab.List>
				<Tab.Panels className="mt-2">
					<Tab.Panel
						className={classNames(
							"bg-white/[0.12] rounded-xl p-3",
							"focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
						)}>
						<ul>
							<Book
								loggedIn={loggedIn}
								loginInfo={loginInfo}
								setLoggedIn={setLoggedIn}
								setloginDialogState={setloginDialogState}
							/>
						</ul>
					</Tab.Panel>
					<Tab.Panel
						className={classNames(
							"bg-white/[0.12] rounded-xl p-3",
							"focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60"
						)}>
						<ul>
							<FlightLookup />
						</ul>
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
}
