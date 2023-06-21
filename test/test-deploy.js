const { ethers } = require("hardhat")
const { expect, assert } = require("chai")
describe("SimpleStorage", function () {
    let simpleStorage
    beforeEach(async function () {
        simpleStorage = await ethers.deployContract("SimpleStorage")
        await simpleStorage.waitForDeployment()
    })

    it("Should start with a favorite number of 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should update when we call store", async function () {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)

        const currentValue = await simpleStorage.retrieve()

        assert.equal(currentValue.toString(), expectedValue)
    })

    it("Should start with empty list of people", async function () {
        const expectedLength = 0
        const currentPeopleSize = await simpleStorage.getPeopleLength()

        assert.equal(currentPeopleSize, expectedLength)
    })

    it("Should contain one person when adding to people", async function () {
        const expectedLength = 1
        const transactionResponse = await simpleStorage.addPerson("Joe", "14")
        await transactionResponse.wait(1)

        const currentPeopleSize = await simpleStorage.getPeopleLength()

        assert.equal(currentPeopleSize, expectedLength)
    })

    it("Should return favorite number from person mapping", async function () {
        const expectedNumber = "14"
        const personsName = "Joe"
        const transactionResponse = await simpleStorage.addPerson(
            personsName,
            expectedNumber
        )
        await transactionResponse.wait(1)

        const personsFavoriteNumber = await simpleStorage.nameToFavoriteNumber(
            personsName
        )

        assert.equal(personsFavoriteNumber, expectedNumber)
    })
})
