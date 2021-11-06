export const findDiff = (destination: string, current: string) => {
    // console.log('findDiff:', destination, current, destination.length)
    let diff: string = "";
    destination.split('').forEach((val, i) => {
        if (val !== current.charAt(i) || i >= current.length) {
            // console.log('found diff', val)
            diff += val;
        }
    });
    // console.log('diff:', diff)
    return diff;
}

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};