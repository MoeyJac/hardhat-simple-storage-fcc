const { ethers, run, network } = require("hardhat")

async function main() {
    console.log("Deploying contract...")
    const simpleStorage = await ethers.deployContract("SimpleStorage")

    await simpleStorage.waitForDeployment()
    const contractAddress = await simpleStorage.getAddress()
    console.log(`Deployed contract to: ${contractAddress}`)

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for txes...")
        await simpleStorage.deploymentTransaction().wait(6)
        await verify(contractAddress, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is: ${updatedValue}`)
}

async function verify(contractAdress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAdress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
