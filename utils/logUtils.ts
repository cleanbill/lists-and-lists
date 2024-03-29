import { timeDisplay } from "./dateUtils";

const log = (message: string, data: {} | unknown = {}) =>
  console.log(timeDisplay(), message, data);

export { log };
