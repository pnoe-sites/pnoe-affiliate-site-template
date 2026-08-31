import { getImageUrl } from '@/lib/api'
import type { TeamMember } from '@shared/schemas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface TeamMemberCardProps {
  member: TeamMember
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const fallbackPhoto = getImageUrl('/images/defaults/person.png')

  const resolvedPhoto = (() => {
    if (member.photo) {
      return member.photo.startsWith('http') ? member.photo : getImageUrl(member.photo)
    }
    return fallbackPhoto
  })()

  return (
    <Card className="group h-full overflow-hidden border-white/10 bg-gradient-to-b from-deep-forest/95 via-pine-green/80 to-charcoal/90 text-white/90 shadow-[0_25px_80px_rgba(4,10,8,0.55)] transition-transform duration-300 hover:-translate-y-1">
      <CardHeader className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <div className="aspect-[4/5] w-full">
            <img
              src={resolvedPhoto}
              alt={member.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep-forest/90 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
            Team
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl text-white">{member.name}</CardTitle>
          <CardDescription className="text-lime-glow/80 text-sm">
            {member.title}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-white/70">
          {member.bio}
        </p>
      </CardContent>
    </Card>
  )
}
