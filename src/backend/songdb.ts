import fs from "fs";

class Level {
    public title: string = "";
    public subtitle: string = "";
    public artist: string = "";
    public title_translit: string = "";
    public subtitle_translit: string = "";
    public artist_translit: string = "";
    public genre: string = "";
    public credit: string = "";
    public music_uri: string = "";
    public banner_uri: string = "";
    public background_uri: string = "";
    public jacket_uri: string = "";
    public cdtitle_uri: string = "";
    public preview_uri: string = "";
    public preview_length: string = "";
    public selectable: string = "";
    public offset: string = "";
    public bpm_low: string = "";
    public bpm_high: string = "";
    public stops: string = "";
    public bgchanges: string = "";
    public fgchanges: string = "";

    public difficulties: Difficulty[] = [];


    toString(): string {
        return `Level:
  Title: ${this.title}
  Subtitle: ${this.subtitle}
  Artist: ${this.artist}
  Title (Translit): ${this.title_translit}
  Subtitle (Translit): ${this.subtitle_translit}
  Artist (Translit): ${this.artist_translit}
  Genre: ${this.genre}
  Credit: ${this.credit}
  Music URI: ${this.music_uri}
  Banner URI: ${this.banner_uri}
  Background URI: ${this.background_uri}
  Jacket URI: ${this.jacket_uri}
  CDTitle URI: ${this.cdtitle_uri}
  Preview URI: ${this.preview_uri}
  Preview Length: ${this.preview_length}
  Selectable: ${this.selectable}
  BPM Low: ${this.bpm_low}
  BPM High: ${this.bpm_high}
  Offset: ${this.offset}
  Stops: ${this.stops}
  BGChanges: ${this.bgchanges}
  FGChanges: ${this.fgchanges}
  Difficulties:
${this.difficulties.map(d => "    " + d.toString()).join("\n")}`;
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
