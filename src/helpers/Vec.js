function Vec(x, y, z) {
    const args = [...arguments];
    if (args.length === 2) {
        return {
            x: args[0],
            y: args[1]
        };
    } else if (args.length === 3) {
        return {
            x: args[0],
            y: args[1],
            z: args[2]
        };
    } else {
        console.error("Error: Vec called with unexpected number of arguments", args);
        return;
    }
}

export default Vec;