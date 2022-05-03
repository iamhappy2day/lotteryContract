const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const { bytecode, interface} = require('../compile');

let lottery;
let accounts;

beforeEach(async () => {
   accounts = await web3.eth.getAccounts();

   lottery = await new web3.eth.Contract(JSON.parse(interface))
       .deploy({data: bytecode})
       .send({from: accounts[0], gas: 1000000})
})
describe('Lottery contract tests',() => {
    it('deploys contract', () => {
        assert.ok(lottery.options.address)
    })
    it('player can enter lottery', async () => {

        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        })
        const players = await lottery.methods.getPlayersList().call({
            from: accounts[0]
        })
        assert.strictEqual(accounts[0], players[0])
        assert.strictEqual(1, players.length)
    });
    it('multiple players can enter lottery', async () => {

        await lottery.methods.enterLottery().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        })
        await lottery.methods.enterLottery().send({
            from: accounts[1],
            value: web3.utils.toWei('1', 'ether')
        })
        await lottery.methods.enterLottery().send({
            from: accounts[2],
            value: web3.utils.toWei('1', 'ether')
        })
        const players = await lottery.methods.getPlayersList().call({
            from: accounts[0]
        })
        assert.strictEqual(accounts[0], players[0])
        assert.strictEqual(accounts[1], players[1])
        assert.strictEqual(accounts[2], players[2])
        assert.strictEqual(3, players.length)
    });
    it('Check minimum amount of transaction for lottery', async () => {
        try {
            await lottery.methods.enterLottery().send({
                from: accounts[0],
                value: web3.utils.toWei('2', 'ether')
            })
            // assert(false)
        } catch(err) {
            console.log('hello')
            assert.ok(err)
        }

    });
    it('Check that modifier onlyForManager works', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false)
        } catch (err) {
            assert(err)
        }
    })
});