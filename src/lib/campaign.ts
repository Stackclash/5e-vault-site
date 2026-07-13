export interface QuestParty {
  active?: boolean | null;
  completed?: boolean | null;
}

export interface QuestWithParties {
  name: string;
  slug: string;
  parties?: (QuestParty | null)[] | null;
}

/** A quest is active if any party has it active and not yet completed. */
export function isQuestActive(quest: QuestWithParties): boolean {
  return (quest.parties ?? []).some((p) => !!p?.active && !p?.completed);
}

/** A quest is completed if at least one party completed it and none still have it active. */
export function isQuestCompleted(quest: QuestWithParties): boolean {
  const parties = quest.parties ?? [];
  if (parties.length === 0) return false;
  return parties.some((p) => !!p?.completed) && !parties.some((p) => !!p?.active && !p?.completed);
}

export function selectActiveQuests(quests: QuestWithParties[]): QuestWithParties[] {
  return quests.filter(isQuestActive);
}
