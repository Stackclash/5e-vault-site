import { Progress } from '5e-vault-site'
import { Frame } from './_frame'

export function QuestProgress() {
  const quests = [
    { label: 'Phylactery Fragments', value: 40 },
    { label: 'Ironhold Infiltration', value: 65 },
    { label: 'Campaign Completion', value: 78 },
  ]
  return (
    <Frame>
      <div className="grid w-80 gap-5">
        {quests.map((q) => (
          <div key={q.label} className="grid gap-2">
            <div className="text-muted-foreground flex justify-between text-xs uppercase tracking-wide">
              <span>{q.label}</span>
              <span>{q.value}%</span>
            </div>
            <Progress value={q.value} />
          </div>
        ))}
      </div>
    </Frame>
  )
}
