import fs from "fs";

class Level {
    public title: string = "";
    private _subtitle: string = "";
    private _artist: string = "";
    private _title_translit: string = "";
    private _subtitle_translit: string = "";
    private _artist_translit: string = "";
    private _genre: string = "";
    private _credit: string = "";
    public music_uri: string = "";
    private _banner_uri: string = "";
    private _background_uri: string = "";
    private _jacket_uri: string = "";
    private _cdtitle_uri: string = "";
    public preview_uri: string = "";
    private _preview_length: string = "";
    private _selectable: string = "";
    private _offset: string = "";
    public bpm_low: string = "";
    private _bpm_high: string = "";
    private _stops: string = "";
    private _bgchanges: string = "";
    private _fgchanges: string = "";

    private _difficulties: Difficulty[] = [];

    // setters
    set subtitle(value: string) { this._subtitle = value; }
    set artist(value: string) { this._artist = value; }
    set title_translit(value: string) { this._title_translit = value; }
    set subtitle_translit(value: string) { this._subtitle_translit = value; }
    set artist_translit(value: string) { this._artist_translit = value; }
    set genre(value: string) { this._genre = value; }
    set credit(value: string) { this._credit = value; }
    set banner_uri(value: string) { this._banner_uri = value; }
    set background_uri(value: string) { this._background_uri = value; }
    set jacket_uri(value: string) { this._jacket_uri = value; }
    set cdtitle_uri(value: string) { this._cdtitle_uri = value; }
    set preview_length(value: string) { this._preview_length = value; }
    set selectable(value: string) { this._selectable = value; }
    set offset(value: string) { this._offset = value; }
    set bpm_high(value: string) { this._bpm_high = value; }
    set stops(value: string) { this._stops = value; }
    set bgchanges(value: string) { this._bgchanges = value; }
    set fgchanges(value: string) { this._fgchanges = value; }
    set difficulties(value: Difficulty[]) { this._difficulties = value; }

    toString(): string {
        return `Level:
  Title: ${this.title}
  Subtitle: ${this._subtitle}
  Artist: ${this._artist}
  Title (Translit): ${this._title_translit}
  Subtitle (Translit): ${this._subtitle_translit}
  Artist (Translit): ${this._artist_translit}
  Genre: ${this._genre}
  Credit: ${this._credit}
  Music URI: ${this.music_uri}
  Banner URI: ${this._banner_uri}
  Background URI: ${this._background_uri}
  Jacket URI: ${this._jacket_uri}
  CDTitle URI: ${this._cdtitle_uri}
  Preview URI: ${this.preview_uri}
  Preview Length: ${this._preview_length}
  Selectable: ${this._selectable}
  BPM Low: ${this.bpm_low}
  BPM High: ${this._bpm_high}
  Offset: ${this._offset}
  Stops: ${this._stops}
  BGChanges: ${this._bgchanges}
  FGChanges: ${this._fgchanges}
  Difficulties:
${this._difficulties.map(d => "    " + d.toString()).join("\n")}`;
    }
}

class Difficulty {
    public type: string;
    public difficulty: number;
    public difficulty_type: string;
    public step_artist: string;
    public steps: string;

    public constructor(
        type: string,
        difficulty: number,
        difficulty_type: string,
        step_artist: string,
        steps: string
    ) {
        this.type = type;
        this.difficulty = difficulty;
        this.difficulty_type = difficulty_type;
        this.step_artist = step_artist;
        this.steps = steps;
    }

    toString(): string {
        return `Difficulty(${this.type}, ${this.difficulty_type}, ${this.difficulty}) by ${this.step_artist}`;
    }
}

export function saveSM(file: Express.Multer.File) {
    const data = fs.readFileSync(file.path, "utf-8");
    const headers = parseSMheaders(data);

    const level = new Level();

    // assign every known attribute
    if (headers["TITLE"]) level.title = headers["TITLE"];
    if (headers["SUBTITLE"]) level.subtitle = headers["SUBTITLE"];
    if (headers["ARTIST"]) level.artist = headers["ARTIST"];
    if (headers["TITLETRANSLIT"]) level.title_translit = headers["TITLETRANSLIT"];
    if (headers["SUBTITLETRANSLIT"]) level.subtitle_translit = headers["SUBTITLETRANSLIT"];
    if (headers["ARTISTTRANSLIT"]) level.artist_translit = headers["ARTISTTRANSLIT"];
    if (headers["GENRE"]) level.genre = headers["GENRE"];
    if (headers["CREDIT"]) level.credit = headers["CREDIT"];
    if (headers["MUSIC"]) level.music_uri = headers["MUSIC"];
    if (headers["BANNER"]) level.banner_uri = headers["BANNER"];
    if (headers["BACKGROUND"]) level.background_uri = headers["BACKGROUND"];
    if (headers["JACKET"]) level.jacket_uri = headers["JACKET"];
    if (headers["CDTITLE"]) level.cdtitle_uri = headers["CDTITLE"];
    if (headers["SAMPLESTART"]) level.preview_uri = headers["SAMPLESTART"];
    if (headers["SAMPLELENGTH"]) level.preview_length = headers["SAMPLELENGTH"];
    if (headers["SELECTABLE"]) level.selectable = headers["SELECTABLE"];
    if (headers["OFFSET"]) level.offset = headers["OFFSET"];
    if (headers["BPMS"]) {
        const parts = headers["BPMS"].split("=");
        level.bpm_low = parts[0] ?? "";
        level.bpm_high = parts[1] ?? "";
    }
    if (headers["STOPS"]) level.stops = headers["STOPS"];
    if (headers["BGCHANGES"]) level.bgchanges = headers["BGCHANGES"];
    if (headers["FGCHANGES"]) level.fgchanges = headers["FGCHANGES"];

    // difficulties
    const difficulties: Difficulty[] = [];
    const unparsed: string[][] = parseDifficultyHeaders(data);
    const stepsArr = parseSteps(data);

    let i = 0;
    for (const row of unparsed) {
        const type = row[0] ?? "";
        const step_artist = row[1] ?? "";
        const difficulty_type = row[2] ?? "";
        const difficulty = parseInt(row[3] ?? "0", 10);

        const steps = stepsArr[i++] ?? "";

        difficulties.push(
            new Difficulty(type, difficulty, difficulty_type, step_artist, steps)
        );
    }

    level.difficulties = difficulties;

    console.log(level.toString());
    return level;
}

function parseSMheaders(content: string): Record<string, string> {
    const regex = /#([A-Z]*):(.+);/gm;
    const result: Record<string, string> = {};

    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
        if (match[1] === undefined || match[2] === undefined) continue;
        result[match[1].trim()] = match[2].trim();
    }

    return result;
}

function parseDifficultyHeaders(content: string): string[][] {
    const regex = /#NOTES:\s*(.*):\s*(.*):\s*(.*):\s*(.*):/gm;
    const result: string[][] = [];

    let match: RegExpExecArray | null;
    first: while ((match = regex.exec(content)) !== null) {
        const temp: string[] = [];
        for (let i = 1; i < 5; i++) {
            const value = match[i];
            if (value == null) continue first;
            temp.push(value);
        }
        result.push(temp);
    }
    return result;
}

function parseSteps(content: string): string[] {
    const regex = /#NOTES:\s*.*\s*.*\s*.*\s*.*\s*.*\s*([^;]*;)/gm;
    const result: string[] = [];

    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
        if (match[1] == null) continue;
        result.push(match[1]);
    }
    return result;
}
