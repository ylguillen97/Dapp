
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
		const btnRegistraDron = document.getElementById('btnRegistraDron');
		
		btnRegistraDron.addEventListener('click', async () => {
			
			let getMaxHeight = document.getElementById('maxheight');
			let getMinHeight = document.getElementById('minheight');
			let getCost = document.getElementById('cost');
			
			let value1 = getMaxHeight.value;
			let value2 = getMinHeight.value;
			let value3 = getCost.value;

			await Dron_Company.registraDron(value1, value2, value3);
			let id= await Dron_Company.get_idDron();
			console.log(id.toNumber());
			document.getElementById("dronesRegistrados").innerHTML = "<br> <hr> DRON REGISTRADO => ID: "+id.toNumber()+ " ALTURA MÁXIMA: "+ value1+ " ALTURA MÍNIMA: "+value2+ " COSTE: "+ value3+" UNTKs "+ "<br><hr>";
		
		});
		
		const btnGetTrabajos = document.getElementById('btnGetTrabajos');
		btnGetTrabajos.addEventListener('click', async () => {
			console.log(account);
			let trabajos = await Dron_Company.getTrabajosDisponibles();
			let str = "TRABAJOS PENDIENTES" ;
			for (let i =0; i<trabajos.length; i++)
			{
				let ident = trabajos[i].toNumber();
				str = str.concat("<br>","<hr>","ID DE LA PARCELA: "+ident,"<br>","<hr>");
			}
			document.getElementById("getTrabajos").innerHTML = str;
		});

		const btnAceptaTrabajo = document.getElementById('btnAceptaTrabajo');

		btnAceptaTrabajo.addEventListener('click', async () => {
			let id_dron = document.getElementById('id_dron');
			let id_plot = document.getElementById('id_plot');

			let val1 = id_dron.value;
			let val2 = id_plot.value;

			await Dron_Company.aceptaTrabajos(val1, val2);

			document.getElementById("trabajoAceptado").innerHTML = "TRABAJO ACEPTADO. FUMIGACIÓN COMPLETADA.";


		});


			


			


	}
	
