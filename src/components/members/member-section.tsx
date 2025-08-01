import { SectionErrorBoundary } from "@/components/ui/error-boundary"
import { MemberCard } from "./member-card"
import { Separator } from "@/components/ui/separator"
import type { Media, Member, Position } from "../../payload-types"

// Extend Member to include populated relations
interface MemberWithRelations extends Member {
  position: Position
  mentor?: MemberWithRelations
  photo?: Media
}

interface MentorGroup {
  mentor?: MemberWithRelations
  members: MemberWithRelations[]
}

interface PositionWithMembers {
  position: Position
  memberGroups: MentorGroup[]
}

interface MemberSectionProps {
  positionGroup: PositionWithMembers
  isLast: boolean
}

export function MemberSection({ positionGroup, isLast }: MemberSectionProps) {
  return (
    <SectionErrorBoundary sectionName={positionGroup.position.title}>
      <div>
        <section 
          id={positionGroup.position.slug} 
          className="scroll-mt-6 space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {positionGroup.position.title}
            </h2>
            
            {positionGroup.position.description && (
              <p className="text-muted-foreground mb-6">
                {positionGroup.position.description}
              </p>
            )}
          </div>

          <div className="space-y-8">
            {positionGroup.memberGroups.map((mentorGroup, groupIndex) => (
              <div key={groupIndex}>
                {mentorGroup.mentor && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      Mentor: {mentorGroup.mentor.name}
                    </h3>
                  </div>
                )}
                
                <div className={`grid gap-6 ${
                  positionGroup.position.showMentorGrouping 
                    ? 'md:grid-cols-2 lg:grid-cols-3' // Smaller cards for students
                    : 'md:grid-cols-1 lg:grid-cols-2' // Larger cards for faculty
                }`}>
                  {mentorGroup.members.map((member) => (
                    <MemberCard 
                      key={member.id} 
                      member={member}
                      variant={positionGroup.position.showMentorGrouping ? 'compact' : 'detailed'}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {!isLast && (
          <div className="pt-8">
            <Separator />
          </div>
        )}
      </div>
    </SectionErrorBoundary>
  )
}