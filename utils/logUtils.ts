const timeStringDisplay = (date: string) => timeDisplay(new Date(date));

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

const log = (message: string, data: {} | unknown = {}) =>
  console.log(timeDisplay(), message, data);

export { log, timeDisplay, timeStringDisplay };
