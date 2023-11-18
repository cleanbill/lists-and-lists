export type TimedNote = {
    time: string,
    id: string,
    repeatPeriod: RepeatPeriod,
    repeatQty: number
}

export enum RepeatPeriod {
    None = "None",
    Days = "Days",
    Weeks = "Weeks",
    Months = "Months",
    Years = "Years"
}

export enum TimedNoteCommand {
    Add = "Add",
    Take = "Take",
    Amend = "Amend",
    List =  "List",
    Display = "Display",
    End = "End"
}

export type TimedNoteAction = {
    command: TimedNoteCommand,
    timedNote: TimedNote;
}

export type TimedNoteEvent = {
    command: TimedNoteCommand,
    list: Array<TimedNote>;
}


