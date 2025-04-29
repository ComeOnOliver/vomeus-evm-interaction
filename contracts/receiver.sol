// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract VomeusReceiver is Pausable, Ownable, ReentrancyGuard {
    IERC20 public usdcToken;

    address public USDCAddr = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    uint256 public NFTPriceInUSDC = 5_000000;
    uint256 public totalMint;

    mapping(address => uint256) public BuyerNFTCounter;
    mapping(address => uint256) public RedeemedNumber;
    mapping(address => mapping (uint256 => address)) redeemedRecord;

    event PaymentReceived(address indexed payer, uint256 buyTimes, uint256 timestamp);
    event Withdrawal(address indexed receiver, uint256 amount);
    event redeemEvent(address indexed user, uint256 buyNumber, address moveAddress);

    using SafeERC20 for IERC20;

    constructor() Ownable(msg.sender) {
        usdcToken = IERC20(USDCAddr);
        totalMint = 0;
    }   

    function pay(uint256 buyTimes) external nonReentrant whenNotPaused{
        require(buyTimes > 0, "Amount must be greater than zero");

        // Transfer USDC safely
        usdcToken.safeTransferFrom(msg.sender, address(this), NFTPriceInUSDC * buyTimes);
        BuyerNFTCounter[msg.sender] += buyTimes;
        totalMint += buyTimes;

        // Emit event
        emit PaymentReceived(msg.sender, buyTimes, block.timestamp);
    }

    function withdraw(address to, uint256 amount) external onlyOwner nonReentrant {
        require(to != address(0), "Invalid receiver address");

        usdcToken.safeTransfer(to, amount);
        emit Withdrawal(to, amount);
    }

    function editPaymentAmount(uint256 newAmount) public onlyOwner {
        NFTPriceInUSDC = newAmount;
    }

    function ifCanRedeem()public view returns (bool) {
        
        uint256 redeemedCount = RedeemedNumber[msg.sender];
        require(redeemedCount < BuyerNFTCounter[msg.sender], "Already Redeemed All");
        
        return true;

    }

    function redeem(address movementAddress) external whenNotPaused {
        require(BuyerNFTCounter[msg.sender] > 0, "Not Available to Redeem");
        require(ifCanRedeem() == true, "Cannot Redeem");

        uint256 redeemCount = RedeemedNumber[msg.sender];
        RedeemedNumber[msg.sender] = RedeemedNumber[msg.sender]+1;

        redeemedRecord[msg.sender][redeemCount] = movementAddress;
        emit redeemEvent(msg.sender, redeemCount, movementAddress);
    }

    function getPaymentCount(address user) external view returns (uint256) {
        return BuyerNFTCounter[user];
    }

    function setAllowance(uint256 buyTimes) external onlyOwner {
        usdcToken.approve(address(this), NFTPriceInUSDC * buyTimes);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
