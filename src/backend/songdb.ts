import fs from "fs"
import * as assert from "node:assert";

class Level {
    public title: string;
    private _subtitle: string;
    private _artist: string;
    private _genre: string;
    private _credit: string;
    public music_uri: string;
    private _banner_uri: string;
    private _background_uri: string;
    private _cdtitle_uri: string;
    public preview_uri: string;
    private _offset: string;
    public bpm_low: string;
    private _bpm_high: string;

    private _difficulties: Difficulty[];

    public constructor(title: string, music_uri: string, preview_uri: string, bpm_low: string) {
        this.title = title;
        this.music_uri = music_uri;
        this.preview_uri = preview_uri;
        this.bpm_low = bpm_low;

        this._subtitle = "";
        this._artist = "";
        this._genre = "";
        this._credit = "";
        this._banner_uri = "";
        this._background_uri = "";
        this._cdtitle_uri = "";
        this._offset = "";
        this._bpm_high = "";

        this._difficulties = []
    }


    set subtitle(value: string) {
        this._subtitle = value;
    }

    set artist(value: string) {
        this._artist = value;
    }

    set genre(value: string) {
        this._genre = value;
    }

    set credit(value: string) {
        this._credit = value;
    }

    set banner_uri(value: string) {
        this._banner_uri = value;
    }

    set background_uri(value: string) {
        this._background_uri = value;
    }

    set cdtitle_uri(value: string) {
        this._cdtitle_uri = value;
    }

    set offset(value: string) {
        this._offset = value;
    }

    set bpm_high(value: string) {
        this._bpm_high = value;
    }

    set difficulties(value: Difficulty[]) {
        this._difficulties = value;
    }
}

class Difficulty {
    public type: string; //dance-single
    public difficulty: number; //19
    public difficulty_type: string; //Challenge, Edit o simile
    public step_artist: string; //ChasePines 29*/18*/2/2
    public steps: string; //0001...

    public constructor(type: string, difficulty: number, difficulty_type: string, step_artist: string, steps: string) {
        this.type = type;
        this.difficulty = difficulty;
        this.difficulty_type = difficulty_type;
        this.step_artist = step_artist;
        this.steps = steps;
    }



}


export function saveSM(file: Express.Multer.File) {
    const data = fs.readFileSync(file.path).toString();
    const headers = parseSMheaders(data);
    const title = headers["TITLE"];
    const music_uri = headers["MUSIC"]; // TODO persistent storage solution
    const preview_uri = headers["SAMPLESTART"]; // TODO cut and save music to play preview without loadind the whole song
    const bpms = headers["BPMS"];
    const bpm_low = bpms.split("=")[0];
    const bpm_high = bpms.split("=")[1];

    const level: Level = new Level(title, music_uri, preview_uri, bpm_low);

    //--------------------------------------------------------------------------------------------

    const difficulties: Difficulty[] = [];

    const unparsed: string[][] = parseDifficultyHeaders(data);

    for (let i = 0; i < unparsed.length; i++) {
        const type = unparsed[i][0];
        const difficulty = unparsed[i][1];
        const difficulty_type = unparsed[i][2];
        const step_artist = unparsed[i][3];

        const steps = parseSteps(data)[i];

























    }


}

function parseSMheaders(content: string): Record<string, string> {
    const regex = /#([A-Z]*):(.+);/gm;
    const result: Record<string, string> = {};

    let match;
    while ((match = regex.exec(content)) !== null) {
        if(match[1] == undefined || match[2] == undefined)
            continue;
        console.log("MATCH! - " + match[1] + ": " + match[2]);
        result[match[1].trim()] = match[2].trim();
    }

    return result;
}
function parseDifficultyHeaders(content: string): string[][] {
    const regex = /#NOTES:\s*(.*):\s*(.*):\s*(.*):\s*(.*):/gm;
    const result: string[][] = [];

    let match;
    first: while((match = regex.exec(content)) !== null) {
        const temp: string[] = []
        for(let i = 1; i < 5; i++) {
            if(match[i] == null)
                continue first;
            temp.push(match[i]);
        }
        result.push(temp);
    }
    return result;
}

function parseSteps(content: string): string[] {
    const regex = /#NOTES:\s*.*\s*.*\s*.*\s*.*\s*.*\s*([^;]*;)/gm;
    const result: string[] = [];

    let match;
    first: while((match = regex.exec(content)) !== null) {
        const temp: string[] = []
        for(let i = 1; i < 5; i++) {
            if(match[i] == null)
                continue first;
            temp.push(match[i]);
        }
        result.push(temp);
    }
    return result;
}