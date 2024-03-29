const timeStringDisplay = (date: string) => timeDisplay(new Date(date));
const dateStringDisplay = (date: string) => dateDisplay(new Date(date));

const dateStringSort = (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime()

const timeDisplay = (date = new Date()) => {
  if (!date) {
    return "-";
  }
  try {
    return new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(date);
  } catch (err) {
    console.error(err);
    console.error("date ", date);
  }
};

const dateDisplay = (date = new Date()) => {
  if (!date) {
    return "-";
  }
  try {
    return new Intl.DateTimeFormat("default", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(date);
  } catch (err) {
    console.error(err);
    console.error("date ", date);
  }
};

export { timeDisplay, timeStringDisplay, dateDisplay, dateStringDisplay, dateStringSort };
