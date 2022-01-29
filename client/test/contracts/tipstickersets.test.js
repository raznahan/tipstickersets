const TipStickerSets = artifacts.require('./TipStickerSets.sol');


require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('TipStickerSets', ([deployer, owner, tipper]) => {

    let tipStickerSets;
    let tips = web3.utils.toWei('1', 'Ether');

    before(async () => {
        tipStickerSets = await TipStickerSets.deployed();

    });

    describe('deployment', () => {

        it('deployes successfully', async () => {
            const address = await tipStickerSets.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, undefined);
            assert.notEqual(address, null);
        });

        it('has a name', async () => {
            const name = await tipStickerSets.name();
            assert.equal(name, 'TipStickerSets');

        });


    });

    describe('TipStickerSetOwner', () => {

        let stickerSetName = '';
        let result;
        beforeEach(() => {
            stickerSetName = 'some_name';
        });
        
        it('should reject if stickerset name is invalid', async () => {
            stickerSetName = '';
            await tipStickerSets.TipStickerSetOwner(stickerSetName, owner,
                 { from: tipper, value: tips })
                 .should.be.rejected;

        });
        it('should tip the stickerset owner', async () => {
            let ownerBalanceBefore;
            ownerBalanceBefore = await web3.eth.getBalance(owner);
            ownerBalanceBefore = new web3.utils.BN(ownerBalanceBefore);

            result = await tipStickerSets.TipStickerSetOwner(stickerSetName, owner, { from: tipper, value: tips });

            const event = result.logs[0].args;

            assert.equal(event.name, stickerSetName, 'stickerset name is correct');
            assert.equal(event.tips.toString(), tips, 'tip amount is correct');
            assert.equal(event.owner, owner, 'owner is correct');

            let ownerBalanceAfter;
            ownerBalanceAfter = await web3.eth.getBalance(owner);
            ownerBalanceAfter = new web3.utils.BN(ownerBalanceAfter);
            let tipsBN = new web3.utils.BN(tips);
            let ownerFinalBalance = ownerBalanceBefore.add(tipsBN);

            assert.equal(ownerFinalBalance.toString(), ownerBalanceAfter.toString(), 'balance is correct');


        });
        it('should reject if tip amount is less than 0.01eth.', async () => {
            stickerSetName = 'some_name';

            await tipStickerSets.TipStickerSetOwner(stickerSetName, owner,
                { from: tipper, value: web3.utils.toWei('0.009', 'Ether') })
                .should.be.rejected;
        });

    })


});