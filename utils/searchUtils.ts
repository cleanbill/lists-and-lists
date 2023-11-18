import { GroupData, Matcher, TitleData } from "../app/model";

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
  groupDataIndex: number;
  titleIndex: number;
  sessionIndex: number;
};

export const search = (
  text: string,
  groups: Array<GroupData>,
): SearchResults | null => {
  const match = matchSetup(text);
  let found = null;
  let groupDataIndex: number = 0;
  while (found == null && groupDataIndex < groups.length) {
    const gd: GroupData = groups[groupDataIndex];
    let titleIndex: number = 0;
    while (found == null && titleIndex < gd.titles.length) {
      const td: TitleData = gd.titles[titleIndex];
      if (match(td.titleName)) {
        found = { groupDataIndex, titleIndex, sessionIndex:td.sessions.length };
      } else {
        titleIndex = titleIndex + 1;
      }
    }
    groupDataIndex = groupDataIndex + 1;
  }
  return found;
};
