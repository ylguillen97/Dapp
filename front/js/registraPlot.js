
const addressContract= '0x14FF7235c6c83Ec1d2F95e0F4085A23991b07411';
const abi = [
	'function registraDron (uint256 maxheight, uint256 minheight, uint256 cost) public returns (bool success)',
	'function registraPlot (uint256 maxheight, uint256 minheight, string memory _pesticide) public returns (bool success)',
	'function getDronesDisponibles() public view returns(uint256[] memory)',
	'function ContrataDron (uint256 iddron, uint256 idplot) public payable returns (bool success)',
	'function aceptaTrabajos (uint256 iddron, uint256 idplot) public ',
	'function getTrabajosDisponibles() public view returns(uint256[] memory)',
	'function buyTokens(uint256 _amount) public payable returns (bool success)',
	'function getBalanceOf (address dir) public view returns (uint)',
	'function get_idDron() public view returns(uint256)', 
	'function get_idPlot() public view returns(uint256)',
	'function getCost(uint256 iddron) public view returns (uint256)',
	'function getMaxHeight(uint256 iddron) public view returns (uint256)',
	'function getMinHeight(uint256 iddron) public view returns (uint256)',
	'function compareStrings(string memory a, string memory b) internal pure returns (bool)'
	];
	let web3; 
	let account ;
	let Dron_Company;
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();
//--------------------------------------------------------------------------//
	init ();
	
	function init ()
	{
		console.log("Hola");
		window.addEventListener('load', async () => {
			if (window.ethereum) {
				console.log("Metamask detected!");
				web3 = new Web3(window.ethereum);
				//window.ethereum.enable(); //deprecated
				//const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
				const accounts= await provider.send("eth_requestAccounts", []);
				account = accounts[0];
				//detectChangeAccount();
				 contract();
			}
			else {
				console.error("Metamask not detected");
			}
			});
		};
		//console.log(account);
	
	function contract ()  
	{
		Dron_Company = new ethers.Contract(addressContract, abi,  signer);	
		interact();
	}

	function interact ()
	{
		const btnRegistraPlot = document.getElementById('btnRegistraPlot');
		
		btnRegistraPlot.addEventListener('click', async () => {
			
			let getMaxHeightPlot = document.getElementById('maxheightPlot');
			let getMinHeightPlot = document.getElementById('minheightPlot');
			let getPesticide = document.getElementById('pesticida');
			
			let value1 = getMaxHeightPlot.value;
			let value2 = getMinHeightPlot.value;
			let value3 = getPesticide.value;
		
			console.log(account);

			await Dron_Company.registraPlot(value1, value2, value3);
			let id= await Dron_Company.get_idPlot();
			console.log(id.toNumber())
			document.getElementById("parcelasRegistradas").innerHTML = "PARCELA REGISTRADA => ID: "+id.toNumber()+ " ALTURA MÁXIMA: "+ value1+ " ALTURA MÍNIMA: "+value2+ " PESTICIDA: "+ value3+ "<br><hr>";


		});

		const btnGetDrones = document.getElementById('btnGetDrones');
		btnGetDrones.addEventListener('click', async () => {
			console.log(account);
			let drones = await Dron_Company.getDronesDisponibles();
			
			let str ="DRONES DISPONIBLES " ;
		
			console.log("DRONES DISPONIBLES");

			for (let i =0; i<drones.length; i++)
			{
				console.log(drones[i].toNumber());
				let id = drones[i].toNumber();
				if (id != 0) 
				{
					let max = await Dron_Company.getMaxHeight(drones[i].toNumber());
					let min = await Dron_Company.getMinHeight(drones[i].toNumber());
					let cost = await Dron_Company.getCost(drones[i].toNumber());
					str = str.concat("<hr>","ID: "+id+"\t ALTURA MÁXIMA: "+ max.toNumber()+"\t ALTURA MÍNIMA: "+ min.toNumber() + "\t COSTE: "+cost.toNumber() + " UNTKs \n", "<hr>");
				}
				
			}

			document.getElementById("getDrones").innerHTML = str;
		});

		const btnContrataDron = document.getElementById('btnContrataDron');
		
		btnContrataDron.addEventListener('click', async () => {
			
			let getIDDron = document.getElementById('iddron');
			let getIDPlot = document.getElementById('idplot');

			let val1 = getIDDron.value;
			let val2 = getIDPlot.value;


			await Dron_Company.ContrataDron(val1, val2);

			
			let maxDron = await Dron_Company.getMaxHeight(val1);
			let minDron = await Dron_Company.getMinHeight(val1);
			let coste = await Dron_Company.getCost(val1);

			let cadena = "<br> <hr>"+ "DRON CONTRATADO: 	ID: "+ val1 +" ALTURA MÁXIMA: " +maxDron+" ALTURA MÍNIMA: "+minDron+" COSTE: "+coste+"UNTKs"+"<br> <hr>";
			document.getElementById("dronContratado").innerHTML = cadena;
		});

	}
	
