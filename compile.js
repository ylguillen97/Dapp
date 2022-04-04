// imports & defines
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Functions

/**
 * Makes sure that the build folder is deleted, before every compilation
 * @returns {*} - Path where the compiled sources should be saved.
 */
function compilingPreperations() {
    const buildPath = path.resolve(__dirname, 'build');
    fs.removeSync(buildPath);
    return buildPath;

}

/**
 * Returns and Object describing what to compile and what need to be returned.
 */
function createConfiguration() {
    console.log("configuracion");
    return {
        language: 'Solidity',
        sources: {
            'Dron_Company.sol': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts','Dron_Company.sol'), 'utf8')
                
            } 
        },
        settings: {
            outputSelection: { // return everything
                '*': {
                    '*': ['*']
                }
            }
        }
    };
}

/**
 * Compiles the sources, defined in the config object with solc-js.
 * @param config - Configuration object.
 * @returns {any} - Object with compiled sources and errors object.
 */
function compileSources(config) {
    try {
        return JSON.parse(solc.compile(JSON.stringify(config), { import: getImports }));

    } catch (e) {
        console.log(e);
    }
}

/**
 * Searches for dependencies in the Solidity files (import statements). All import Solidity files
 * need to be declared here.
 * @param dependency
 * @returns {*}
 */
function getImports(dependency) {
    console.log('Searching for dependency: ', dependency);
    switch (dependency) {
        case 'ERC20.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname,'contracts', 'ERC20.sol'), 'utf8')};
		case 'ERC721.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname, 'contracts', 'ERC721.sol'), 'utf8')};
		case 'Dron.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname, 'contracts', 'Dron.sol'), 'utf8')};
		case 'Plot.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname,'contracts', 'Plot.sol'), 'utf8')};
		case 'SafeMath.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname,'contracts', 'SafeMath.sol'), 'utf8')};
		case 'IERC721.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname,'contracts', 'IERC721.sol'), 'utf8')};
		case 'IERC20.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname,'contracts', 'IERC20.sol'), 'utf8')};
        case 'IERC721Receiver.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname,'contracts', 'IERC721Receiver.sol'), 'utf8')};
		case 'IERC165.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname,'contracts', 'IERC165.sol'), 'utf8')};
		case 'ERC165.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname,'contracts', 'ERC165.sol'), 'utf8')};
		
		default:
            return {error: 'File not found'}
    }

}

/**
 * Shows when there were errors during compilation.
 * @param compiledSources
 */
function errorHandling(compiledSources) {
    if (!compiledSources) {
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n', 'NO OUTPUT');
    } else if (compiledSources.errors) { // something went wrong.
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n');
        compiledSources.errors.map(error => console.log(error.formattedMessage));
    }
}

/**
 * Writes the contracts from the compiled sources into JSON files, which you will later be able to
 * use in combination with web3.
 * @param compiled - Object containing the compiled contracts.
 * @param buildPath - Path of the build folder.
 */
function writeOutput(compiled, buildPath) {
    fs.ensureDirSync(buildPath);

    for (let contractFileName in compiled.contracts) {
        const contractName = contractFileName.replace('.sol', '');
        console.log('Writing: ', contractName + '.json');
        fs.outputJsonSync(
            path.resolve(buildPath, contractName + '.json'),
            compiled.contracts[contractFileName][contractName]
        );
    }
}

// Workflow


const buildPath = compilingPreperations();
const config = createConfiguration();
const compiled = compileSources(config);


module.exports =
{
	abi: compiled.contracts['Dron_Company.sol'].Dron_Company.abi,
	bytecode: compiled.contracts['Dron_Company.sol'].Dron_Company.evm.bytecode.object
}


errorHandling(compiled);
writeOutput(compiled, buildPath);