import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { BlockDTO, StarDTO } from './dto';

export class BlockService {
    data:BlockDTO
    constructor(data: BlockDTO) {
        this.data = data
    }

    validate():Promise<boolean> {
        const self = this.data;
        return new Promise((resolve, reject) => {
            // Check if body is valid hex
            const re: RegExp = /[0-9A-Fa-f]{6}/g

            if (!(re.test(self.body))) {
                reject("Invalid body");
            }

            // Save in auxiliary variable the current block hash
            const currentHash: string = self.hash;

            // Recalculate the hash of the Block
            const block: BlockDTO = {
                hash: "",
                height: self.height,
                body: self.body,
                time: self.time,
                previousBlockHash: self.previousBlockHash
            }

            const newHash: string = createHash("sha256").update(JSON.stringify(block)).digest("hex")

            // Comparing if the hashes changed
            // Returning the Block is not valid
            // Returning the Block is valid

            return resolve(currentHash === newHash);

        });
    }

    getBData(): Promise<StarDTO> {
        const self = this.data;
        return new Promise((resolve, reject) => {
            if (self.height === 0) {
                reject("Cannot retrieve data of Genesis Block.")
            }

            const hexToAscii:string = Buffer.from(self.body, "hex").toString()
            const starData:StarDTO = JSON.parse(hexToAscii)
            resolve(starData)
        });

    }
}
