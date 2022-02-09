
class StringService {

    insertHttpsIfNeeded = (link) => {
        return !link.startsWith('http') ?
            [link.slice(0, 0), 'https://', link.slice(0)].join('') : link;
    };

};


module.exports = StringService;