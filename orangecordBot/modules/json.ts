
import {
    readFileSync,
    writeFileSync
} from 'fs'

export async function read(file: string) {
    return JSON.parse(readFileSync(file).toString())
}

export async function write(file: string, data: any) {
    writeFileSync(file, JSON.stringify(data, null, 4))
}