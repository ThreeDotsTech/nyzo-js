//@ts-ignore
import { SHA256, enc } from "crypto-js"
import Convert from "./util/convert"

export class NyzoStringPrivateSeed {

    seed: Uint8Array

    constructor(seed: Uint8Array) {
        this.seed = seed
    }

    getSeed() {
        return this.seed
    }
}

export class NyzoStringPublicIdentifier {

    identifier: Uint8Array

    constructor(identifier: Uint8Array) {
        this.identifier = identifier
    }

    getIdentifier() {
        return this.identifier
    }
}

export class NyzoStringPrefilledData {

    receiverIdentifier: Uint8Array
    senderData: Uint8Array

    constructor(receiverIdentifier: Uint8Array, senderData: Uint8Array) {
        this.receiverIdentifier = receiverIdentifier;
        this.senderData = senderData;
    }

    getReceiverIdentifier() {
        return this.receiverIdentifier;
    }

    getSenderData() {
        return this.senderData;
    }
}

export default class NyzoString {

    private characterLookup = ('0123456789' +
        'abcdefghijkmnopqrstuvwxyz' +
        'ABCDEFGHIJKLMNPQRSTUVWXYZ' +
        '-.~_').split('');

    private characterToValueMap: Map<string, number>

    constructor() {
        this.characterToValueMap = new Map<string, number>();
        for (var i = 0; i < this.characterLookup.length; i++) {
            this.characterToValueMap.set(this.characterLookup[i], i)
        }
    }

    private arraysAreEqual(array1: Uint8Array, array2: Uint8Array): boolean {
        var arraysAreEqual
        if (array1 == null || array2 == null) {
            arraysAreEqual = array1 == null && array2 == null
        } else {
            arraysAreEqual = array1.length == array2.length
            for (var i = 0; i < array1.length && arraysAreEqual; i++) {
                if (array1[i] != array2[i]) {
                    arraysAreEqual = false
                }
            }
        }

        return arraysAreEqual;
    }

    private byteArrayForEncodedString(encodedString: string): Uint8Array {

        var arrayLength = (encodedString.length * 6 + 7) / 8
        var array = new Uint8Array(arrayLength)
        for (var i = 0; i < arrayLength; i++) {

            var leftCharacter = encodedString.charAt(i * 8 / 6)
            var rightCharacter = encodedString.charAt(i * 8 / 6 + 1)

            var leftValue = this.characterToValueMap.get(leftCharacter)
            var rightValue = this.characterToValueMap.get(rightCharacter)

            var bitOffset = (i * 2) % 6
            array[i] = ((((leftValue << 6) + rightValue) >> 4 - bitOffset) & 0xff)
        }

        return array;
    }

    private encodedStringForByteArray(array: Uint8Array): string {

        var index = 0
        var bitOffset = 0
        var encodedString = ""
        while (index < array.length) {


            var leftByte = array[index] & 0xff
            var rightByte = index < array.length - 1 ? array[index + 1] & 0xff : 0


            var lookupIndex = (((leftByte << 8) + rightByte) >> (10 - bitOffset)) & 0x3f
            encodedString += this.characterLookup[lookupIndex]


            if (bitOffset == 0) {
                bitOffset = 6
            } else {
                index++
                bitOffset -= 2
            }
        }

        return encodedString
    }

    decodeNyzoString(encodedString: string): NyzoStringPublicIdentifier | NyzoStringPrefilledData | NyzoStringPrivateSeed {

        var result = null
        var prefix = encodedString.substring(0, 4)
        var expandedArray = this.byteArrayForEncodedString(encodedString)
        var contentLength = expandedArray[3] & 0xff
        var checksumLength = expandedArray.length - contentLength - 4

        if (checksumLength >= 4 && checksumLength <= 6) {
            var headerLength = 4
            var calculatedChecksum = this.doubleSHA256(expandedArray.subarray(0, headerLength +
                contentLength)).subarray(0, checksumLength)
            var providedChecksum = expandedArray.subarray(expandedArray.length - checksumLength, expandedArray.length)

            if (this.arraysAreEqual(calculatedChecksum, providedChecksum)) {
                var contentBytes = expandedArray.subarray(headerLength, expandedArray.length - checksumLength)


                if (prefix == 'key_') {
                    result = new NyzoStringPrivateSeed(contentBytes)
                } else if (prefix == 'id__') {
                    result = new NyzoStringPublicIdentifier(contentBytes)
                } else if (prefix == 'pre_') {
                    result = new NyzoStringPrefilledData(contentBytes.subarray(0, 32),
                        contentBytes.subarray(33, contentBytes.length))
                }
            }
        }

        return result;
    }

    encodeNyzoString(prefix: string, contentBytes: Uint8Array): string {

        var prefixBytes = this.byteArrayForEncodedString(prefix)
        var checksumLength = 4 + (3 - (contentBytes.length + 2) % 3) % 3;
        var expandedLength = 4 + contentBytes.length + checksumLength;

        var expandedArray = new Uint8Array(expandedLength);
        for (var i = 0; i < prefixBytes.length; i++) {
            expandedArray[i] = prefixBytes[i];
        }
        expandedArray[3] = contentBytes.length;
        for (var i = 0; i < contentBytes.length; i++) {
            expandedArray[i + 4] = contentBytes[i];
        }


        var checksum = this.doubleSHA256(expandedArray.subarray(0, 4 + contentBytes.length));
        for (var i = 0; i < checksumLength; i++) {
            expandedArray[expandedArray.length - checksumLength + i] = checksum[i];
        }


        return this.encodedStringForByteArray(expandedArray);
    }

    nyzoStringFromPrivateKey(byteArray: Uint8Array): string {
        return this.encodeNyzoString('key_', byteArray);
    }

    nyzoStringFromPublicIdentifier(byteArray: Uint8Array): string {
        return this.encodeNyzoString('id__', byteArray);
    }

    private doubleSHA256(byteArray: Uint8Array) {
        return Convert.hex2ab(SHA256(SHA256(enc.Hex.parse(Convert.ab2hex(byteArray)))).toString())
    }

}


