//@ts-ignore
import { SHA256, enc } from "crypto-js"
import { sign } from "tweetnacl";
import ByteBuffer from "./byteBuffer"
import Convert from "./util/convert";
export default class Transaction {


    timestamp: number
    amount: number
    recipientIdentifier: Uint8Array
    previousHashHeight: number
    previousBlockHash: Uint8Array
    senderIdentifier: Uint8Array
    senderData: Uint8Array
    signature: Uint8Array

    constructor() {
        this.timestamp = Date.now()
        this.amount = 0
        this.recipientIdentifier = new Uint8Array(32)
        this.previousHashHeight = 0
        this.previousBlockHash = new Uint8Array(32)
        this.senderIdentifier = new Uint8Array(32)
        this.senderData = new Uint8Array(0)
        this.signature = new Uint8Array(64)
    }

    setTimestamp(timestamp: number) {
        this.timestamp = timestamp
    }

    setAmount(amount: number) {
        this.amount = amount
    }

    setRecipientIdentifier(recipientIdentifier: Uint8Array) {
        for (var i = 0; i < 32; i++) {
            this.recipientIdentifier[i] = recipientIdentifier[i]
        }
    }

    setPreviousHashHeight(previousHashHeight: number) {
        this.previousHashHeight = previousHashHeight
    }

    setPreviousBlockHash(previousBlockHash: Uint8Array) {
        for (var i = 0; i < 32; i++) {
            this.previousBlockHash[i] = previousBlockHash[i]
        }
    }

    setSenderData(senderData: Uint8Array) {
        this.senderData = new Uint8Array(Math.min(senderData.length, 32))
        for (var i = 0; i < this.senderData.length; i++) {
            this.senderData[i] = senderData[i]
        }
    }

    sign(seedBytes: Uint8Array) {
        var keyPair = sign.keyPair.fromSeed(seedBytes)
        for (var i = 0; i < 32; i++) {
            this.senderIdentifier[i] = keyPair.publicKey[i]
        }
        var signature = sign.detached(this.getBytes(false), seedBytes)
        for (var i = 0; i < 64; i++) {
            this.signature[i] = signature[i]
        }
    }

    getBytes(includeSignature: boolean) {

        var forSigning = !includeSignature

        var buffer = new ByteBuffer(1000)

        buffer.putByte(2);
        buffer.putLong(this.timestamp)
        buffer.putLong(this.amount)
        buffer.putBytes(this.recipientIdentifier)

        if (forSigning) {
            buffer.putBytes(this.previousBlockHash)
        } else {
            buffer.putLong(this.previousHashHeight)
        }
        buffer.putBytes(this.senderIdentifier)

        if (forSigning) {
            buffer.putBytes(this.doubleSHA256(this.senderData))
        } else {
            buffer.putByte(this.senderData.length)
            buffer.putBytes(this.senderData)
        }

        if (!forSigning) {
            buffer.putBytes(this.signature)
        }

        return buffer.toArray()
    }

    doubleSHA256(byteArray: Uint8Array) {
        return Convert.hex2ab(SHA256(SHA256(enc.Hex.parse(Convert.ab2hex(byteArray)))).toString())
    }
}