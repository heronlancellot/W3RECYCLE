//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import {ECDSA} from  "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

struct Product {   
    uint256 productId;
    string deviceType; 
    string model;
    string image; // HASH  IPFS da imagem 
    string fabricant;
    uint256 price; // Preco da taxa do Produto ( Valor líquido de quanto o Ponto de Coleta paga)
}

contract W3Recicle is ERC721, ERC721URIStorage, AccessControl, IERC721Receiver {

    // 3 ACESS ROLES -> Consumidor | Ponto de Coleta | Administrador     // ADMIN criado ao deployar contrato
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");  // LEADER_ROLE no contrato original
    bytes32 public constant COLLECTPOINT_ROLE = keccak256("COLLECTPOINT_ROLE");  // MEMBER_ROLE no contrato original

    struct CollectPoint { 

        string name; 
        string street; 
        string neighborhood;
        string city; 
        string country;

    }

    // Produtos --> CONSUMER
    // Registro de Produto
    struct Device {
        
        uint256 productId;  
        string emei; // MEI = IMEI         
        address owner;  

    }

    // Realiza um mapping que vincula ID ao Produto
    mapping(uint256 => Product) public _products;
    Counters.Counter public productIdCounter;    

    // 1 - Cadastro do produto - administrador

    function registerProduct(string memory deviceType, string memory model, string memory fabricant, string memory image, uint256 price) public onlyRole(DEFAULT_ADMIN_ROLE) returns (uint256){
        uint256 productId = productIdCounter.current(); // Pega o ID atual do produto
        Product memory product = Product(productId, deviceType, model, image, fabricant, price);        
        _products[productId] = product; // Atribui o ID ao Produto
        productIdCounter.increment(); // Incrementa ID        
        return productId;
    }

    function getProducts() public view returns(string memory) {
        string memory output="[";
        for (uint i = 0; i < productIdCounter.current()-1; i++) {
            output = Base64.encode(
            bytes(
                string.concat(output,
                    string(
                        abi.encodePacked(
                            "{'deviceType': '", _products[i].deviceType, "',",
                            "'model': '", _products[i].model, "',",
                            "'image': '", _products[i].image, "',",
                            "'fabricant': '", _products[i].fabricant, "',",
                            "'price': '", _products[i].price, "',",
                            "},"                        
                        )
                    )
                )
            )
        );
        }
        return string.concat(output, "]");
    }

    // Realiza um mapping que vincula o ID do dispositivo - temos o ID do dispositivo que está vinculado ao Device que tem o Owner
    mapping(uint256  => Device ) public _devices;
    Counters.Counter public deviceIdCounter;    

    // 2 - Registro o Dispositivo - Consumidor
    function registerDevice( uint256 productId, string memory emei ) public onlyRole(CONSUMER_ROLE){
        Device memory device = Device(productId, emei, owner);
        uint256 deviceId = deviceIdCounter.current(); //  Pega o ID atual do dispositivo
        _devices[deviceId] = device; // Atribui o ID ao Device
        deviceIdCounter.increment();
    }



    struct Activity {
        uint256 tokenId;
        string status;
        string tokenUri;
        uint256 reward;
    }

    string constant private MSG_PREFIX = "\x19Ethereum Signed Message:\n32";

    uint256 public nonce;
    mapping(address => bool) private _isValidSigner;
    uint private _threshold;

    bool private _lock;
    modifier nonReentrant() {
        require(!_lock);
        _lock = true;
        _;
        _lock = false;
    }
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter public tokenIdCounter;    

    event NftMinted(bool isMinted);
    event NftTransferred(bool isMinted);

    address public owner;
    
    // bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE"); // consumer role
    // bytes32 public constant COLLECTPOINT_ROLE = keccak256("COLLECTPOINT_ROLE"); 

    mapping(uint256 => Activity) private _activities;
    mapping(uint256 => bool) private _availableActivities;
    mapping(uint256 => address) private _activityOwners;


    constructor(string memory _collectionName, string memory _token) ERC721(_collectionName, _token) payable {
        _threshold = 2;
        owner = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, owner);
    }

    receive() external payable {}

    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(DEFAULT_ADMIN_ROLE)) {
        if (role == CONSUMER_ROLE)
            _isValidSigner[account] = true;
        _grantRole(role, account);
    }

    /**
     * @dev Member get the rights to work on in the NFT Activity Bounty
     *
     * Requirements:
     *
     * - Should be a Member
     * - Activity Should be avaiable
     *
     * Emits a {nftStatus} event.
     */
    function setActivityOwner(uint256 tokenId, address to) public {
        // Requer que NFT mintado esteja disponível
        require(_availableActivities[tokenId], "Activity not available!");
        // TODO: Requer q a data atual não tenha ultrapassado a data de expiração da atividade
        
        //atualiza status da atividade
        _activities[tokenId].status = "In Progress";

        //remove da lista de disponíveis 
        delete _availableActivities[tokenId]; 

        //atribui o membro como dono da atividade       
        _activityOwners[tokenId] = to;
    }

    /**
     * @dev Returns the activity owner of the `tokenId`. Does NOT revert if token doesn't exist
     */
    function activityOwnerOf(uint256 tokenId) public view virtual returns (address) {    
        address addr = _activityOwners[tokenId];
        return addr;
    }

    /**
     * @dev Return true if the activity is avilable
     */
    function isAvailableActivity(uint256 tokenId) public view virtual returns (bool) {    
        return _availableActivities[tokenId];
    }

    /**
     * @dev Return true if the activity is avilable
     */
    function getActivity(uint256 tokenId) public view virtual returns (Activity memory) {    
        return _activities[tokenId];
    }
    
    
    /**
     * @dev See {ipfsUri}
     * 
     * Requirements:
     *
     * - Should be a `LEADER_ROLE`
     *
     * Emits a {NftMinted} event.
     */
    function safeMint(address to, string memory ipfsUri) public payable virtual onlyRole(CONSUMER_ROLE) {
        require(msg.value >= 1, "Not enough ETH sent; check price!");
        uint256 tokenId = productIdCounter.current();
        productIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, ipfsUri);

        //create activity
        Activity memory activity;
        activity.tokenId = tokenId;
        activity.tokenUri = ipfsUri;
        activity.status = "Available";
        activity.reward = msg.value;

        _availableActivities[tokenId] = true;
        _activities[tokenId] = activity;
        
        // EVENT
        emit NftMinted(true);
    }

    function transferNFTWithETH(address from, address _to, uint256 _tokenId) public payable {
        require(ownerOf(_tokenId) == from, "Are you really owner of this NFT?");
        require(msg.value > 0, "ETH amount must be greater than 0");

        transferFrom(msg.sender, _to, _tokenId);
        
        (bool sent, ) = payable(ownerOf(_tokenId)).call{value: msg.value}("");
        require(sent, "Failed to send ETH");
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, IERC721) onlyRole(DEFAULT_ADMIN_ROLE) {
        setApprovalForAll(to, true);
        _transfer(from, to, tokenId);

        // EVENT
        emit NftTransferred(true);
    }
    
    function checkAddressMember(address account) public view returns(bool) {
        return hasRole(COLLECTPOINT_ROLE, account);
    }

    function checkAddressLeader(address account) public view returns(bool) {
        return hasRole(CONSUMER_ROLE, account);
    }

    function BurnNft(uint256 tokenId) public onlyRole(CONSUMER_ROLE){
        return _burn(tokenId);
    }

    // The following functions is an override required by Solidity.
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    // The following functions is an override required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function lastMinted() public view returns (string memory) {
        uint256 tokenId = productIdCounter.current();
        if (tokenId == 0)
            return "";
        if (tokenId > 0)
            return tokenURI(tokenId - 1);
        else 
            return tokenURI(tokenId);
    }   

    function idCounter() public view returns (uint256) {
        return productIdCounter.current();
    }   

    
    // The following functions is an override required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl, ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    function setApprovalForAll(address operator, bool approved) public virtual override(ERC721, IERC721) {
        _setApprovalForAll(_msgSender(), operator, approved);
    }

}

