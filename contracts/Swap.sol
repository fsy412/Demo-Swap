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
        uint256 orderId;
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
        bool filled;
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
        bool withdrawn;
        bool refunded;
    }

    // greeting
    struct Greeting {
        string fromChain;
        string title;
        string content;
        string date;
    }
    Greeting[] public greetings;

    // Cross-chain destination contract map
    mapping(string => mapping(string => DestnContract)) public destnContractMap;

    // Cross-chain permitted contract map
    mapping(string => mapping(string => string)) public permittedContractMap;

    mapping(uint256 => Order) public idToOrder;
    uint256 _orderIds;

    mapping(uint256 => OrderFill) public idToFillOrder;
    uint256 _fillOrderIds;

    constructor() public {}

    function create_order(
        string memory chain_from,
        address asset_from,
        uint256 amount_from,
        string memory chain_to,
        address asset_to,
        uint256 amount_to
    ) public returns (bool) {
        bool ret = IERC20(asset_from).transferFrom(
            msg.sender,
            address(this),
            amount_from
        );
        require(ret, "transfer to swap failed");
        idToOrder[_orderIds] = Order(
            _orderIds,
            msg.sender,
            asset_from,
            amount_from,
            sha256(abi.encodePacked(uint256(0))),
            block.timestamp,
            block.timestamp + 3600,
            false,
            false,
            chain_from,
            chain_to,
            false
        );
        _orderIds = _orderIds + 1;
        return true;
    }

    function query_order(uint256 order_id) public {}

    function query_all_orders() public view returns (Order[] memory) {
        uint256 orderCount = _orderIds;
        Order[] memory orders = new Order[](orderCount);
        for (uint256 i = 0; i < orderCount; i++) {
            Order storage order = idToOrder[i];
            orders[i] = order;
        }
        return orders;
    }

    function match_order(
        string calldata chain_id,
        uint256 order_id,
        address asset,
        uint256 amount
    ) public {
        // bool ret = IERC20(asset).transferFrom(msg.sender, address(this), amount);
        // require(ret, "transfer to swap failed");
        idToFillOrder[_fillOrderIds] = OrderFill(
            order_id,
            chain_id,
            msg.sender,
            asset,
            amount,
            sha256(abi.encodePacked(uint256(0))),
            block.timestamp,
            block.timestamp + 3600,
            false,
            false
        );
        _fillOrderIds = _fillOrderIds + 1;

        mapping(string => DestnContract) storage map = destnContractMap[
            chain_id
        ];
        // DestnContract storage destnContract = map["receive_match_order"];
        // require(destnContract.used, "action not registered");

        // bytes memory data = abi.encode(order_id, msg.sender, asset, msg.sender, amount, sha256(abi.encodePacked(uint(0))));
        // SQOS memory sqos = SQOS(1);
        // crossChainContract.sendMessage(
        //     chain_id,
        //     destnContract.contractAddress,
        //     destnContract.funcName,
        //     sqos,
        //     data
        // );

        DestnContract storage destnContract = map["receiveGreeting"];
        require(destnContract.used, "action not registered");

        bytes memory data = abi.encode(chain_id, "_title", "_content", "_date");
        SQOS memory sqos = SQOS(1);
        crossChainContract.sendMessage(
            chain_id,
            destnContract.contractAddress,
            destnContract.funcName,
            sqos,
            data
        );
    }

    /**
     * Receive greeting info from other chains
     * @param _fromChain - from chain name
     * @param _title - greeting title
     * @param _content - greeting content
     * @param _date - date
     */
    function receiveGreeting(
        string calldata _fromChain,
        string calldata _title,
        string calldata _content,
        string calldata _date
    ) public {
        require(
            msg.sender == address(crossChainContract),
            "Locker: caller is not CrossChain"
        );

        // `context` used for verify the operation authority
        SimplifiedMessage memory context = getContext();
        // verify sqos
        require(context.sqos.reveal == 1, "SQoS invalid!");

        // verify the sender from the registered chain
        mapping(string => string)
            storage permittedContract = permittedContractMap[context.fromChain];

        require(
            keccak256(bytes(permittedContract[context.action])) ==
                keccak256(bytes(context.sender)),
            "message sender is not registered!"
        );

        Greeting storage g = greetings.push();
        g.fromChain = _fromChain;
        g.title = _title;
        g.content = _content;
        g.date = _date;
    }

    function receive_match_order(
        uint256 order_id,
        address payee_address,
        address from_chain_payee,
        address from_chain_asset,
        uint256 amount,
        bytes32 hash
    ) public {
        Order storage order = idToOrder[order_id];
        order.filled = true;
        bool ret = IERC20(order.tokenContract).transfer(
            payee_address,
            order.amount
        );
        // require(ret, "transfer payee failed");
    }

    function unlock_asset(uint256 order_id, string memory key) public {}

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
}
