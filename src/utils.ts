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