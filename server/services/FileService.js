const fs = require('fs');
const Axios = require('axios');
const path = require('path');
const winston = require('winston');

class FileService {

    async downloadImage(url, filepath) {
        const response = await Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });
        return new Promise((resolve, reject) => {
            const dirName = path.dirname(filepath);
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName, { recursive: true });
            }
            response.data.pipe(fs.createWriteStream(filepath))
                .on('error', reject)
                .once('close', () => resolve(filepath));
        });
    };

    async uploadToIPFS(filePath){

    };
};

module.exports = FileService;
