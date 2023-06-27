//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Strings.sol";

// Contrato de implementação do Produto
contract ProductImplementation {
    struct Product {
        uint256 id;
        string category;
        string name;
        string description;
        string manufacturer;
        string model;
    }
    
    mapping(uint256 => Product) private products;
    
    function registerProduct(uint256 id, string memory category, string memory name, string memory description, string memory manufacturer, string memory model) external {
        products[id] = Product(id, category, name, description, manufacturer, model);
    }
    
    function updateProduct(uint256 id, string memory category, string memory name, string memory description, string memory manufacturer, string memory model) external {
        //require(products[id].exist, "Product does not exist");
        products[id] = Product(id, category, name, description, manufacturer, model);
    }
    
    function getProduct(uint256 id) external view returns (string memory) {
        //require(products[id].exists, "Product does not exist");
        return convertProductToJson(products[id]);
    }
    
    // Função auxiliar para converter uma estrutura Product em formato JSON
    function convertProductToJson(Product memory product) private pure returns (string memory) {
        // string memory json = Strings.JSONEncode({
        //     "id": product.id,
        //     "category": product.category,
        //     "name": product.name,
        //     "description": product.description,
        //     "manufacturer": product.manufacturer,
        //     "model": product.model
        // });
    }
}