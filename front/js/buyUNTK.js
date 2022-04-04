
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
		const btnBuyToken = document.getElementById('btnBuyToken');
		btnBuyToken.addEventListener('click', async () => {
			

			let amount = document.getElementById('amount');
			let amount1 = amount.value;
			await Dron_Company.buyTokens(amount1, {value: 25000});

		});
		const btnGetBalance = document.getElementById('btnGetBalance');
		btnGetBalance.addEventListener('click', async () => {

			console.log(account);
			let balance= await Dron_Company.getBalanceOf(account);
			let str = balance.toString();
			console.log(balance.toString());

			document.getElementById("printBalance").innerHTML= "<hr> BALANCE DE SU CUENTA: "+ str.slice(0,-18)+ " UNTKs"+"<br><hr>";

		});
	}
	
