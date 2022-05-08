import { useState, useEffect } from "react";
import "./App.css";
import MainTabs from "./Tabs";
import DialogBox from "./Dialog";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";

function App() {
	const [loginInfo, setLoginInfo] = useState({
		active: false,
		name: "",
		email: "",
		password: "",
		token: "",
	});

	const [loginDebounce, setLoginDebounce] = useState(false);
	const [loginDialogState, setloginDialogState] = useState(false);
	const [logoutDialogState, setLogoutDialog] = useState(false);
	const [registerDialogState, setRegisterDialogState] = useState(false);
	const [registerDebounce, setRegisterDebounce] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const sendLoginRequest = async () => {
		if (!loginDebounce) {
			setLoginDebounce(true);
			const postData = {
				email: loginInfo.email,
				password: loginInfo.password,
			};
			try {
				const resp = await axios.post(
					"http://localhost:5000/api/users/login",
					postData
				);
				if (resp.data && resp.data.token) {
					setErrorMessage("");
					setLoginInfo({
						...loginInfo,
						active: true,
						name: resp.data.name,
						token: resp.data.token,
					});
					setloginDialogState(false);
				} else {
					setErrorMessage("An unknown error occurred.");
				}
				setLoginDebounce(false);
			} catch (err) {
				console.error(err);
				setErrorMessage("Error: " + err);
				setLoginDebounce(false);
			}
		}
	};

	const sendRegisterRequest = async () => {
		if (!registerDebounce) {
			setRegisterDebounce(true);
			const postData = {
				name: loginInfo.name,
				email: loginInfo.email,
				password: loginInfo.password,
			};
			try {
				const resp = await axios.post(
					"http://localhost:5000/api/users",
					postData
				);
				if (resp.data && resp.data.token) {
					setErrorMessage("");
					setLoginInfo({
						...loginInfo,
						active: true,
						token: resp.data.token,
					});
					setRegisterDialogState(false);
				} else {
					setErrorMessage("An unknown error occurred.");
				}
				setRegisterDebounce(false);
			} catch (err) {
				console.error(err);
				setErrorMessage("Error: " + err);
				setRegisterDebounce(false);
			}
		}
	};

	const handleLoginInfo = (event) => {
		event.preventDefault();
		const { id, value } = event.target;
		switch (id) {
			case "name":
				setLoginInfo({ ...loginInfo, name: value });
				break;
			case "email":
				setLoginInfo({ ...loginInfo, email: value });
				break;
			case "password":
				setLoginInfo({ ...loginInfo, password: value });
				break;
			default:
				break;
		}
	};

	return (
		<>
			<div className="flex justify-center bg-gradient-to-b from-black py-8">
				<div className="flex justify-left w-1/2 items-center text-white min-w-[500px]">
					<div className="font-semibold mr-3 text-left text-4xl tracking-tight">
						FREDAIR
					</div>
					<img className="PlaneLogo" />
					<div className="flex justify-end w-full">
						{loginInfo.active == false ? (
							<div className="space-x-2">
								<button
									onClick={() => setloginDialogState(true)}
									class="bg-white/[0.12] hover:bg-white/[0.24] active:bg-white active:text-blue-700 focus:ring-2 focus:text-blue-100 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 text-white font-bold px-8 py-2 rounded-full">
									Login
								</button>
								<button
									onClick={() => setRegisterDialogState(true)}
									class="bg-white/[0.12] hover:bg-white/[0.24] active:bg-white active:text-blue-700 focus:ring-2 focus:text-blue-100 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 text-white font-bold px-8 py-2 rounded-full">
									Register
								</button>
							</div>
						) : (
							<div className="flex justify-left space-x-4 items-center">
								<p>Hi, {loginInfo.name}.</p>
								<button
									onClick={() => setLogoutDialog(true)}
									class="bg-white/[0.12] hover:bg-white/[0.24] active:bg-white active:text-blue-700 focus:ring-2 focus:text-blue-100 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 text-white font-bold px-8 py-2 rounded-full">
									Log out
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="flex justify-center">
				<div className="flex justify-left w-1/2 items-center min-w-[500px]">
					<MainTabs
						loggedIn={loginInfo.active}
						loginInfo={loginInfo}
						setLoggedIn={setLoginInfo}
						setloginDialogState={setloginDialogState}
					/>
				</div>
			</div>
			<DialogBox
				closeDialog={() => {
					setLoginInfo({
						active: false,
						name: "",
						email: "",
						password: "",
						token: "",
					});
					setloginDialogState(false);
					setLoginDebounce(false);
					setErrorMessage("");
				}}
				dialogState={loginDialogState}>
				<Dialog.Title
					as="h3"
					className="text-lg font-medium leading-6 text-gray-900">
					FREDAIR Login
				</Dialog.Title>
				<form onSubmit={handleLoginInfo}>
					<div className="mt-4">
						<div class="mb-2">
							<label
								class="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="email">
								Email
							</label>
							<input
								class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
								id="email"
								type="email"
								placeholder="Email"
								value={loginInfo.email}
								onChange={handleLoginInfo}
							/>
						</div>
						<div class="mb-4">
							<label
								class="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="password">
								Password
							</label>
							<input
								class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
								id="password"
								type="password"
								placeholder="Password"
								value={loginInfo.password}
								onChange={handleLoginInfo}
								onSubmit={handleLoginInfo}
							/>
						</div>
						{errorMessage && (
							<p className="text-red-500"> {errorMessage} </p>
						)}
					</div>
					<div className="mt-4 space-x-2">
						<button
							disabled={loginDebounce}
							type="submit"
							className={`${
								loginDebounce ? "cursor-wait" : "cursor-pointer"
							} justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
							onClick={() => sendLoginRequest()}>
							{loginDebounce ? (
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
							Login
						</button>
						<button
							type="button"
							className="justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
							onClick={() => {
								setLoginInfo({
									active: false,
									name: "",
									email: "",
									password: "",
									token: "",
								});
								setloginDialogState(false);
								setLoginDebounce(false);
								setErrorMessage("");
							}}>
							Cancel
						</button>
					</div>
				</form>
			</DialogBox>
			<DialogBox
				closeDialog={() => {
					setLogoutDialog(false);
				}}
				dialogState={logoutDialogState}>
				<Dialog.Title
					as="h3"
					className="text-lg font-medium leading-6 text-gray-900">
					FREDAIR Log out
				</Dialog.Title>
				<div className="mt-2">
					<p className="text-sm text-gray-500 max-h-[100px] overflow-y-scroll">
						Are you sure you want to log out?
					</p>
				</div>
				<div className="mt-4 space-x-2">
					<button
						type="button"
						className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
						onClick={() => {
							setLoginInfo({
								active: false,
								name: "",
								email: "",
								password: "",
								token: "",
							});
							setLogoutDialog(false);
						}}>
						Log out
					</button>
					<button
						type="button"
						className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
						onClick={() => setLogoutDialog(false)}>
						Cancel
					</button>
				</div>
			</DialogBox>
			<DialogBox
				closeDialog={() => {
					setLoginInfo({
						active: false,
						name: "",
						email: "",
						password: "",
						token: "",
					});
					setRegisterDialogState(false);
					setRegisterDebounce(false);
					setErrorMessage("");
				}}
				dialogState={registerDialogState}>
				<Dialog.Title
					as="h3"
					className="text-lg font-medium leading-6 text-gray-900">
					FREDAIR Register
				</Dialog.Title>
				<form onSubmit={handleLoginInfo}>
					<div className="mt-4">
						<div class="mb-2">
							<label
								class="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="name">
								Name
							</label>
							<input
								class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
								id="name"
								type="text"
								placeholder="John Doe"
								value={loginInfo.name}
								onChange={handleLoginInfo}
							/>
						</div>
						<div class="mb-2">
							<label
								class="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="email">
								Email
							</label>
							<input
								class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
								id="email"
								type="email"
								placeholder="Email"
								value={loginInfo.email}
								onChange={handleLoginInfo}
							/>
						</div>
						<div class="mb-4">
							<label
								class="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="password">
								Password
							</label>
							<input
								class="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight"
								id="password"
								type="password"
								placeholder="Password"
								value={loginInfo.password}
								onChange={handleLoginInfo}
								onSubmit={handleLoginInfo}
							/>
						</div>
						{errorMessage && (
							<p className="text-red-500"> {errorMessage} </p>
						)}
					</div>
					<div className="mt-4 space-x-2">
						<button
							disabled={registerDebounce}
							type="submit"
							className={`${
								registerDebounce
									? "cursor-wait"
									: "cursor-pointer"
							} justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
							onClick={() => sendRegisterRequest()}>
							{registerDebounce && (
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
							Register
						</button>
						<button
							type="button"
							className="justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
							onClick={() => {
								setLoginInfo({
									active: false,
									name: "",
									email: "",
									password: "",
									token: "",
								});
								setRegisterDialogState(false);
								setRegisterDebounce(false);
								setErrorMessage("");
							}}>
							Cancel
						</button>
					</div>
				</form>
			</DialogBox>
		</>
	);
}

export default App;
