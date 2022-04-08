// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CrossChain/ContractBase.sol";

 contract Swap is ContractBase {
    // Destination contract info
    struct DestnContract {
        string contractAddress; // destination contract address
        string funcName; // destination contract action name
        bool used;
    }

    struct Order {
        address sender;
        address tokenContract;
        uint256 amount;
        bytes32 hashlock;
        uint256 createTime;
        uint256 timelock; // locked UNTIL this time.
        bool withdrawn;
        bool refunded;
        string fromChainId;
        string toChainId;
    }

    struct OrderFill {
        address sender;
        address tokenContract;
        uint256 amount;
        bytes32 hashlock;
        uint256 createTime;
        uint256 timelock; // locked UNTIL this time.
        bool withdrawn;
        bool refunded;
    }

    // Cross-chain destination contract map
    mapping(string => mapping(string => DestnContract)) public destnContractMap;

    // Cross-chain permitted contract map
    mapping(string => mapping(string => string)) public permittedContractMap;

    mapping(uint256 => Order) private idToOrder;
    uint256 _orderIds;

    mapping(uint256 => OrderFill) private idToFillOrder;
    uint256 _fillOrderIds;

    constructor() public{
        
    }

    function create_order(string memory chain_from, address asset_from, uint256 amount_from, string memory chain_to, address asset_to, uint amount_to) public returns (bool) {
        bool ret =  IERC20(asset_from).transferFrom(msg.sender, address(this), amount_from);
        require(ret, "transfer to swap failed");
        idToOrder[_orderIds] = Order(msg.sender, asset_from, amount_from, sha256(abi.encodePacked(uint(0))), block.timestamp, block.timestamp+ 3600, false, false, chain_from, chain_to);
        _orderIds = _orderIds + 1;
        return true;
    }

    function query_order(uint order_id) public{

    }
     
    function query_all_orders() public view returns(Order[] memory){
        uint256 orderCount = _orderIds;
        Order[] memory orders = new Order[](orderCount);
        for (uint256 i = 0;i < orderCount; i++){
            Order storage order = idToOrder[i];
            orders[i] = order;
        }
        return orders;
    }

    function match_order(string calldata chain_id, uint256 order_id, address payee_address, address asset, uint amount) public{
        bool ret = IERC20(asset).transferFrom(msg.sender, address(this), amount);
        require(ret, "transfer to swap failed");
        idToFillOrder[_orderIds] = OrderFill(msg.sender, asset, amount,  sha256(abi.encodePacked(uint(0))), block.timestamp, block.timestamp+ 3600, false, false);
        _fillOrderIds = _fillOrderIds + 1;

       
        // mapping(string => DestnContract) storage map = destnContractMap[chain_id];
        // DestnContract storage destnContract = map["receive_match_order"];
        // require(destnContract.used, "action not registered");

        // bytes memory data = abi.encode(chain_id, order_id);
        // SQOS memory sqos = SQOS(1);
        // crossChainContract.sendMessage(
        //     chain_id,
        //     destnContract.contractAddress,
        //     destnContract.funcName,
        //     sqos,
        //     data
        // );
    }

    function receive_match_order(uint order_id, address payee_address, address from_chain_payee, address from_chain_asset, uint amount, bytes32 hash) public {
    }

    function unlock_asset(uint order_id, string memory key) public{
    }
}