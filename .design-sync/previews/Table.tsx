import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  Badge,
} from '5e-vault-site'
import { Frame } from './_frame'

export function PartyRoster() {
  const party = [
    { name: 'Kaelen Duskbane', cls: 'Warlock', level: 7, hp: '54/54', status: 'Healthy' },
    { name: 'Brynn Ironfoot', cls: 'Fighter', level: 7, hp: '68/72', status: 'Wounded' },
    { name: 'Sister Ondine', cls: 'Cleric', level: 6, hp: '48/48', status: 'Healthy' },
    { name: 'Vesper Nightsong', cls: 'Rogue', level: 7, hp: '0/45', status: 'Downed' },
    { name: 'Thornwick', cls: 'Druid', level: 6, hp: '39/50', status: 'Wounded' },
  ]
  return (
    <Frame>
      <div className="w-full max-w-2xl">
        <Table>
          <TableCaption>Active adventuring party · The Vaeltharis Campaign</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Character</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Level</TableHead>
              <TableHead className="text-right">HP</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {party.map((m) => (
              <TableRow key={m.name}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>{m.cls}</TableCell>
                <TableCell className="text-right">{m.level}</TableCell>
                <TableCell className="text-right">{m.hp}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      m.status === 'Downed'
                        ? 'destructive'
                        : m.status === 'Wounded'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {m.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Frame>
  )
}
