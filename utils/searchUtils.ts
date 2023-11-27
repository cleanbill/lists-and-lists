import { Matcher, ListData } from "../app/model";

export const matchSetup = (needle: string): Matcher => {
  if (!needle) {
    return (s: string) => false;
  }
  return (haystack: string): boolean => {
    if (!haystack) {
      return false;
    }
    return (haystack + "").toLowerCase().indexOf(needle.toLowerCase()) > -1;
  };
};

export type SearchResults = {
  listIndex: number;
  sessionIndex: number;
};

export const search = (
  text: string,
  lists: Array<ListData>
): SearchResults | null => {
  const match = matchSetup(text);
  let found = null;
  let listIndex: number = 0;
  while (found == null && listIndex < lists.length) {
    const list: ListData = lists[listIndex];
    if (match(list.listTitle)) {
      found = { listIndex, sessionIndex: (list.sessions.length-1) };
    } else {
      listIndex = listIndex + 1;
    }
  }
  return found;
};
