import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

export default function Combo(props) {
	const { data, value } = props;
	const [query, setQuery] = useState("");

	const filteredSelection =
		query === ""
			? data
			: data.filter((selection) =>
					selection.name
						.toLowerCase()
						.replace(/\s+/g, "")
						.includes(query.toLowerCase().replace(/\s+/g, ""))
			  ) || [];

	return (
		<div className="w-1/2">
			<Combobox value={value} onChange={props.onChange}>
				<div className="relative mt-1">
					<div className="relative w-full text-left bg-white rounded-md cursor-default overflow-hidden">
						<Combobox.Input
							className="w-full py-2 pl-3 pr-10 rounded-md text-sm leading-5 text-gray-900"
							displayValue={(selection) => selection.name}
							onChange={(event) => setQuery(event.target.value)}
						/>
						<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
							<SelectorIcon
								className="w-5 h-5 text-gray-400"
								aria-hidden="true"
							/>
						</Combobox.Button>
					</div>
					<Transition
						as={Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
						afterLeave={() => setQuery("")}>
						<Combobox.Options className="z-[2] absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md max-h-60 ring-1 ring-black ring-opacity-5 sm:text-sm">
							{filteredSelection.length === 0 && query !== "" ? (
								<div className="relative cursor-default select-none py-2 px-4 text-gray-700">
									Nothing found.
								</div>
							) : (
								filteredSelection.map((selection) => (
									<Combobox.Option
										key={selection.id}
										className={({ active }) =>
											`relative cursor-default select-none py-2 pl-10 pr-4 ${
												active
													? "bg-teal-600 text-white"
													: "text-gray-900"
											}`
										}
										value={selection}>
										{({ selected, active }) => (
											<>
												<span
													className={`block truncate ${
														selected
															? "font-medium"
															: "font-normal"
													}`}>
													{selection.name}
												</span>
												{selected ? (
													<span
														className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
															active
																? "text-white"
																: "text-teal-600"
														}`}>
														<CheckIcon
															className="h-5 w-5"
															aria-hidden="true"
														/>
													</span>
												) : null}
											</>
										)}
									</Combobox.Option>
								))
							)}
						</Combobox.Options>
					</Transition>
				</div>
			</Combobox>
		</div>
	);
}
