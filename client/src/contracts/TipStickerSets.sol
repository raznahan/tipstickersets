pragma solidity >=0.4.22 <0.9.0;

contract TipStickerSets {
    string public name = "TipStickerSets";
    uint256 public setsCount;
    mapping(string => StickerSet) public stickerSets;

    struct StickerSet {
        uint256 tips;
        address payable owner;
        bool isValue;
    }
    event StickerSetTipped(
        string name,
        uint256 tips,
        address payable owner
    );
    modifier hasMinimumTip() {
        require(msg.value >= 0.01 ether);
        _;
    }

    function TipStickerSetOwner(string memory _name, address payable _owner)
        public
        payable
        hasMinimumTip
    {
        require(bytes(_name).length != 0);
        require(msg.sender.balance >= 0.01 ether);
        require(msg.sender != _owner); // owners are not allowed to tip themselves.

        StickerSet memory _stickerSet = stickerSets[_name];
        if (_stickerSet.isValue) {
            _stickerSet = stickerSets[_name];
        } else {
            _stickerSet = StickerSet(0, _owner, true);
        }
        _owner.transfer(msg.value);
        _stickerSet.tips = _stickerSet.tips + msg.value;
        stickerSets[_name] = _stickerSet;

        emit StickerSetTipped(_name, msg.value, _stickerSet.owner);
    }
}
