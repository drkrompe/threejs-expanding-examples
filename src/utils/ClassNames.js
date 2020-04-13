const ClassNames = function () {
    const argumentArray = Object.values(arguments);
    if (argumentArray.length === 0) {
        return '';
    };
    const filteredArguments = argumentArray
        .filter(className => !(!className || className === ''));
    if (filteredArguments.length === 0) {
        return ''
    };
    return filteredArguments
        .reduce((acc, className) => acc + ' ' + className);
}

export default ClassNames;