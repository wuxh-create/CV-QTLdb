import lodash from 'lodash'

const isValidRange = (s: string | null) => {
    if (s === '' || s === null) {
        return true
    } else if (!s.match(/^(chr)?\d+:\d+-\d+$/)) {
        return false
    } else {
        const match = s.match(/^chr(\d+):(\d+)-(\d+)$/)
        if (!match) {
            return false
        }
        const [chr, start, end] = match.slice(1, 4).map((v) => Number(v))
        const valid = chr in lodash.range(1, 23) &&
            start > 0 &&
            end > 0 &&
            end > start
        return valid ? valid : 'Invalid genimic range'
    }
}

export default isValidRange
