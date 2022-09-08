export const markerToColor = (marker) => {
    if (marker === 'green') return { backgroundColor: '#4caf50', borderColor: '#4caf50' } // Letter is in the right spot
    else if (marker === 'yellow') return { backgroundColor: '#ffc107', borderColor: '#ffc107' } // Letter is included in the word
    else return { backgroundColor: '#505050' }; // Letter is not in the word
}
