const steg = require('../resources/steganography.min');


class StegService {
    constructor() {
    }

    encode(text, img) {
        return steg.encode(text, img);
    };

    decode(img) {
        return steg.decode(img);
    };

}

module.exports = StegService;
