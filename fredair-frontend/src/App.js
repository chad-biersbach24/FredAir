import './App.css';
import MainTabs from './Tabs';

function App() {

	
  return (
	<div>
		<div className="flex justify-center bg-gradient-to-b from-black py-8">
			<div className="flex justify-left w-1/2 items-center text-white">
				<div className="font-semibold mr-3 text-left text-4xl tracking-tight">FREDAIR</div>
				<img className="PlaneLogo"/>
				<div className="flex justify-end w-full">
					<button class="bg-white/[0.12] hover:bg-white/[0.24] active:bg-white active:shadow active:text-blue-700 focus:ring-2 focus:text-blue-100 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 text-white font-bold px-8 py-2 rounded-full">
						Login
					</button>
				</div>
			</div>
		</div>
		<div className="flex justify-center">
			<div className="flex justify-left w-1/2 items-center">
				<MainTabs/>
			</div>
		</div>
	</div>
  );
}

export default App;
