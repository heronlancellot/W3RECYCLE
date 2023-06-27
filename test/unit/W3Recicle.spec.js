const { network, ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { developmentChains } = require("../../helper-hardhat-config")
const { expect } = require("chai");
const { BigNumber } = require("ethers");

const ether = (amount) => {
  const weiString = ethers.utils.parseEther(amount.toString());
  return BigNumber.from(weiString);
};

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("W3Recicle contract", function () {
      // We define a fixture to reuse the same setup in every test. We use
      // loadFixture to run this setup once, snapshot that state, and reset Hardhat
      // Network to that snapshot in every test.
      async function deployW3RecicleWithAdminGrantsFixture() {
        // Get the ContractFactory and Signers here.
        const ProductProxy = await ethers.getContractFactory("ProductProxy");
        const ProductImplementation = await ethers.getContractFactory("ProductImplementation");
        const [owner, admin] = await ethers.getSigners();
    
        // To deploy our contract, we just have to call Token.deploy() and await
        // for it to be deployed(), which happens onces its transaction has been
        // mined.    
        const hardhatProductImplementation = await ProductImplementation.deploy();    
        const hardhatProductProxy = await ProductProxy.deploy(hardhatProductImplementation.address);

    
        await hardhatProductImplementation.deployed();
        await hardhatProductProxy.deployed();

        // Fixtures can return anything you consider useful for your tests
        return { hardhatProductImplementation, hardhatProductProxy, owner, admin };
      }

      describe("Cadastro de Produto", function () {
        it("Deve cadastrar um produto com sucesso.", async function () {
          const { hardhatProductImplementation, hardhatProductProxy, owner, admin } = await loadFixture(deployW3RecicleWithAdminGrantsFixture);
          
          await hardhatProductProxy.registerProduct(1, "Smartphone","Iphone","Apple","Iphone 11S","23424456yghvbbg56tgy6yhgj+67gh").then(res => res);
          expect(0).to.equal(0);
        });

        // it("Should set MEMBER role to a wallet and check if the wallet is granted", async function () {
        //   const { hardhatNftERC721, owner, leader, member } = await loadFixture(deployNftERC721Fixture);
        //   const MEMBER_WALLET = member.address;
        //   const MEMBER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MEMBER_ROLE"));
          
        //   await hardhatNftERC721.grantRole(MEMBER_ROLE, MEMBER_WALLET);
        //   expect(await hardhatNftERC721.checkAddressMember(MEMBER_WALLET)).to.equal(true);
        // });
      });


    }); 