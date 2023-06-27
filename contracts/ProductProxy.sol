//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// Contrato Proxy UUPS
contract ProductProxy is Initializable, OwnableUpgradeable, UUPSUpgradeable  {
    address private implementation;
    
    constructor(address _implementation) {
        _disableInitializers();
        implementation = _implementation;
    }
    
    
    fallback() external {
        address _impl = implementation;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), _impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
    
    function changeImplementation(address _implementation) external onlyOwner {
        implementation = _implementation;
    }
    
    // Função para chamar explicitamente a função registerProduct do contrato de implementação
    function registerProduct(uint256 id, string memory category, string memory name, string memory description, string memory manufacturer, string memory model) external {
        (bool success, ) = implementation.delegatecall(
            abi.encodeWithSignature(
                "registerProduct(uint256,string,string,string,string,string)",
                id, category, name, description, manufacturer, model
            )
        );
        require(success, "Failed to call registerProduct");
    }

}
