// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CrossChain/ContractBase.sol";
import '@openzeppelin/contracts/utils/Counters.sol';

contract Swap is ContractBase {
    using Counters for Counters.Counter;

    // Destination contract info
    struct DestnContract {
        string contractAddress; // destination contract address
        string funcName; // destination contract action name
        bool used;
    }

    struct Order {
        uint256 orderId;
        address sender;
        address tokenContract;
        address toTokenContract;
        uint256 amount;
        uint256 toAmount;
        bytes32 hashlock;
        uint256 createTime;
        string fromChainId;
        string toChainId;
        string status;
        address payee;
    }

    struct OrderFill {
        uint256 orderId;
        string fromChainId;
        address sender;
        address tokenContract;
        uint256 amount;
        bytes32 hashlock;
        uint256 createTime;
        uint256 timelock; // locked UNTIL this time.
        address payee;
        string status;
        bool transfer;
    }

    // Cross-chain destination contract map
    mapping(string => mapping(string => DestnContract)) public destnContractMap;

    // Cross-chain permitted contract map
    mapping(string => mapping(string => string)) public permittedContractMap;

    mapping(uint256 => Order) public idToOrder;
    Counters.Counter _orderIds;

    mapping(uint256 => OrderFill) public idToFillOrder;
    Counters.Counter _fillOrderIds;

    constructor() public {}

    function create_order(
        string memory chain_from,
        address asset_from,
        uint256 amount_from,
        string memory chain_to,
        address asset_to,
        uint256 amount_to
    ) public returns (bool) {
        require(IERC20(asset_from).transferFrom(msg.sender,
            address(this),
            amount_from
        ), "transfer to swap failed");
        uint256 orderId = _orderIds.current();
        idToOrder[orderId] = Order(
            orderId,
            msg.sender,
            asset_from,
            asset_to,
            amount_from,
            amount_to,
            bytes32(0),
            block.timestamp,
            chain_from,
            chain_to,
            "Open",
            address(0)
        );
        _orderIds.increment();
        return true;
    }

    function query_order(uint256 order_id) public {}

    function query_all_orders() public view returns (Order[] memory) {
        uint256 orderCount = _orderIds.current();
        Order[] memory orders = new Order[](orderCount);
        for (uint256 i = 0; i < orderCount; i++) {
            Order storage order = idToOrder[i];
            orders[i] = order;
        }
        return orders;
    }

    function match_order(
        string calldata chain_id, // source chain id
        uint256 order_id,
        address asset,
        uint256 amount, 
        address payee,
        string calldata hashkey
    ) public {
        require(IERC20(asset).transferFrom(msg.sender, address(this), amount), "transfer to swap failed");
        uint256 _fillOrderId = _fillOrderIds.current();
        idToFillOrder[_fillOrderId] = OrderFill(
            order_id,
            chain_id,
            msg.sender,
            asset,
            amount,
            sha256(abi.encodePacked(hashkey)),
            block.timestamp,
            block.timestamp + 3600,
            payee,
            "created",
            false
        );
        _fillOrderIds.increment();

        mapping(string => DestnContract) storage map = destnContractMap[
            chain_id
        ];
        DestnContract storage destnContract = map["receive_match_order"];
        require(destnContract.used, "action not registered");

        bytes memory data = abi.encode(order_id, msg.sender, asset, msg.sender, 1, sha256(abi.encodePacked(hashkey)));
        SQOS memory sqos = SQOS(0);
        crossChainContract.sendMessage(
            chain_id,
            destnContract.contractAddress,
            destnContract.funcName,
            sqos,
            data
        );
    }

    function receive_match_order(
        uint256 order_id,
        address payee_address,
        address from_chain_payee,
        address from_chain_asset,
        uint256 amount,
        bytes32 hash
    ) public {
        require(
            msg.sender == address(crossChainContract),
            "Locker: caller is not CrossChain"
        );

        // `context` used for verify the operation authority
        SimplifiedMessage memory context = getContext();
        // verify sqos
        // require(context.sqos.reveal == 1, "SQoS invalid!");

        // verify the sender from the registered chain
        mapping(string => string)
            storage permittedContract = permittedContractMap[context.fromChain];

        require(
            keccak256(bytes(permittedContract[context.action])) ==
                keccak256(bytes(context.sender)),
            "message sender is not registered!"
        );

        Order storage order = idToOrder[order_id];
        order.status = "Locked";
        order.hashlock = hash;
        order.payee = payee_address;
    }

    function unlock_asset(
        string calldata chain_id, // unused
        uint256 order_id, 
        string calldata hashkey,
        address payee_address // unused
     ) public {
        bytes32 hash = sha256(abi.encodePacked(hashkey));
        Order storage order = idToOrder[order_id];
        require(order.hashlock == hash);
        require(order.payee == msg.sender);
        order.status = "Done";

        bool ret = IERC20(order.tokenContract).transfer(
            msg.sender,
            order.amount
        );

        mapping(string => DestnContract) storage map = destnContractMap[
            order.toChainId
        ];
        DestnContract storage destnContract = map["recv_unlock_asset"];
        require(destnContract.used, "action not registered");

        bytes memory data = abi.encode(order_id, hashkey, order.sender);
        SQOS memory sqos = SQOS(0);
        crossChainContract.sendMessage(
            order.toChainId,
            destnContract.contractAddress,
            destnContract.funcName,
            sqos,
            data
        );
    }

    function recv_unlock_asset(uint256 order_id, string calldata hashkey, address payee_address) public {
        uint256 orderCount = _fillOrderIds.current();
        for (uint256 i = 0; i < orderCount; i++) {
            OrderFill storage order = idToFillOrder[i];
            if (order.orderId == order_id){
                bool ret = IERC20(order.tokenContract).transfer(payee_address, order.amount);
                order.status = "Done";
                order.transfer = ret;
            }
        }
    }

    function receive_transfer_asset(uint256 order_id, bytes32 hash) public {
        // uint256 orderCount = _fillOrderIds.current();
        // for (uint256 i = 0; i < orderCount; i++) {
        //     OrderFill storage order = idToFillOrder[i];
        //     if (order.orderId == order_id){
        //         bool ret = IERC20(order.tokenContract).transfer(order.payee, order.amount);
        //         order.status = "Done";
        //         order.transfer = ret;
        //     }
        // }
    }

    function registerDestnContract(
        string calldata _funcName,
        string calldata _toChain,
        string calldata _contractAddress,
        string calldata _contractFuncName
    ) external onlyOwner {
        mapping(string => DestnContract) storage map = destnContractMap[
            _toChain
        ];
        DestnContract storage destnContract = map[_funcName];
        destnContract.contractAddress = _contractAddress;
        destnContract.funcName = _contractFuncName;
        destnContract.used = true;
    }

    function registerPermittedContract(
        string calldata _chainName,
        string calldata _sender,
        string calldata _funcName
    ) external onlyOwner {
        mapping(string => string) storage map = permittedContractMap[
            _chainName
        ];
        map[_funcName] = _sender;
    }

    function verify(
        string calldata _chainName,
        string calldata _funcName,
        string calldata _sender
    ) public view virtual returns (bool) {
        return true;
    }
}