"use client"
const timeDisplay = (date = new Date()) =>
  new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);

/*
* @param {string}
*/  
const log = (message) => console.log(timeDisplay(), message);


const delay = ms => new Promise(res => setTimeout(res, ms));

/*
* @param {string}
* @param {RepeatPeriod}
* @returns {Date}
*/
const addToDate = (qtyString, period, now = new Date()) => {
  const qty = parseInt(qtyString) || 0;
  if (period == RepeatPeriod.Days) {
    now.setDate(now.getDate() + qty);
  } else if (period == RepeatPeriod.Weeks) {
    now.setDate(now.getDate() + (qty * 7));
  } else if (period == RepeatPeriod.Months) {
    now.setMonth(now.getMonth() + qty);
  } else if (period == RepeatPeriod.Years) {
    now.setFullYear(now.getFullYear() + qty);
  }
  return now;
}

/**
 * Enum for repeat-period values.
 * @readonly
 * @enum {string}
 */
const RepeatPeriod = {
  None: "None",
  Days: "Days",
  Weeks: "Weeks",
  Months: "Months",
  Years: "Years"
}

/**
 * Enum for Timed-note-command values.
 * @readonly
 * @enum {string}
 */
const TimedNoteCommand = {
  Add: "Add",
  Take: "Take",
  Amend: "Amend",
  List: "List",
  Load: "Load",
  End: "End",
  Display: "Display"
}


/**
 * A number, or a string containing a number.
 * @typedef {Object} TimedNote
 * @property {number} time
 * @property {string} id
 * @property {(RepeatPeriod| null)} repeatPeriod
 * @property {number} repeatQty
 */


/**
 * A number, or a string containing a number.
 * @typedef {Object} TimedNoteAction
 * @property {TimedNoteCommand} command
 * @property {TimedNote} timedNote
 */

/**
 * @type {Array.<TimedNote>}
 */
let timeList = [];
let started = false;

const SLEEP_MINUTES = 1;
const SLEEP = (SLEEP_MINUTES * 60) * 1000; // minutes

const woken = () => {
  const now = new Date();
  const jobToDo = timeList.find(wake => new Date(wake.time).getTime() < now.getTime());
  if (!jobToDo) {
    const wakeAt = new Date();
    wakeAt.setMinutes(wakeAt.getMinutes()+SLEEP_MINUTES);
    log('No timed notes... sleeping, waking at '+timeDisplay(wakeAt));
    return;
  }
  log('Its time to ' + jobToDo.id);
  postMessage({command:TimedNoteCommand.Display,list:[jobToDo]});
  timeList = timeList.filter(wake => wake.id != jobToDo.id);
  if (jobToDo.repeatPeriod == RepeatPeriod.None || jobToDo.repeatQty == 0) {
    postMessage({command:TimedNoteCommand.List,list:timeList});
    return;
  }
  const newTime = addToDate(jobToDo.repeatQty, jobToDo.repeatPeriod, new Date(jobToDo.time));
  const timeString = newTime.toISOString().substring(0,19)+'Z'
  log(jobToDo.id+' repeater to now run at '+timeString)
  jobToDo.time = timeString;
  timeList.push(jobToDo);
  postMessage({command:TimedNoteCommand.List,list:timeList});
}

const timeLoop = async () => {
  while (started){
    woken();
    await delay(SLEEP);
  }
}

// Add for same ID will overwrite if ID already exists. 
addEventListener('message', async (event) => {
  const timedNoteAction = event.data;
  const timedNote = timedNoteAction.timedNote
  if (timedNoteAction.command == TimedNoteCommand.Load){
    timeList = timedNote;
  }
  if (timedNoteAction.command == TimedNoteCommand.Take
    || timedNoteAction.command == TimedNoteCommand.Add
    || timedNoteAction.command == TimedNoteCommand.Amend) {
    timeList = timeList.filter(timed => timed.id != timedNote.id);
  }
  if (timedNoteAction.command == TimedNoteCommand.Add
    || timedNoteAction.command == TimedNoteCommand.Amend) {
    timeList.push(timedNote);
  }
  postMessage({command:TimedNoteCommand.List,list:timeList});
  if (!started) {
    started = true;
    await timeLoop();
  }
  if (timedNoteAction.command == TimedNoteCommand.End){
    started = false;
  }
})

log('We have a web worker for timed notes');

export default {};
