import { DynamicMainLayout } from "@/components/layout"
import { Separator } from "@/components/ui/separator"
import type { Member, Position, Media } from "../../../payload-types"
import config from "@payload-config"
import { getPayload } from "payload"
import { MemberCard } from "@/components/members"

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

async function getMembersData(): Promise<{
  positionGroups: PositionWithMembers[]
  sidebarItems: Array<{ title: string; anchor: string; active?: boolean }>
}> {
  try {
    const payload = await getPayload({ config })
    
    // Fetch all visible positions
    const positionsResult = await payload.find({
      collection: 'positions',
      where: {
        isVisible: {
          equals: true,
        },
      },
      sort: 'displayOrder',
      limit: 100,
    })

    // Fetch all active members with populated relations
    const membersResult = await payload.find({
      collection: 'members',
      where: {
        isActive: {
          equals: true,
        },
      },
      sort: 'displayOrder',
      limit: 1000,
      depth: 2, // Populate position, mentor, and photo relations
    })

    // Group members by position and then by mentor
    const positionGroups: PositionWithMembers[] = positionsResult.docs.map((position: Position) => {
      // Filter members for this position
      const positionMembers = membersResult.docs.filter((member: Member) => {
        const memberPosition = typeof member.position === 'object' ? member.position : null
        return memberPosition?.id === position.id
      }) as MemberWithRelations[]

      let memberGroups: MentorGroup[]

      if (position.showMentorGrouping) {
        // Group by mentor
        const mentorMap = new Map<number | null, MemberWithRelations[]>()
        
        positionMembers.forEach(member => {
          const mentorId = typeof member.mentor === 'object' && member.mentor ? member.mentor.id : null
          if (!mentorMap.has(mentorId)) {
            mentorMap.set(mentorId, [])
          }
          mentorMap.get(mentorId)!.push(member)
        })

        memberGroups = Array.from(mentorMap.entries()).map(([mentorId, members]) => ({
          mentor: mentorId ? members[0].mentor : undefined,
          members: members.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        }))
      } else {
        // No mentor grouping, just list all members
        memberGroups = [{
          members: positionMembers.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
        }]
      }

      return {
        position,
        memberGroups
      }
    })

    // Generate sidebar items
    const sidebarItems = positionsResult.docs.map((position: Position, index: number) => ({
      title: position.title,
      anchor: position.slug,
      active: index === 0, // First item active by default
    }))

    return { positionGroups, sidebarItems }
  } catch (error) {
    console.error('Error fetching members data:', error)
    return { 
      positionGroups: [], 
      sidebarItems: [
        { title: "Members in BCMI", anchor: "members", active: true },
        { title: "Faculty Members", anchor: "faculty" },
        { title: "PhD Students", anchor: "phd" },
        { title: "Graduate Students", anchor: "graduate" },
        { title: "Alumni", anchor: "alumni" }
      ]
    }
  }
}

export default async function Members() {
  const { positionGroups, sidebarItems } = await getMembersData()

  const dynamicSidebarConfig = {
    title: "MEMBER CATEGORIES",
    items: sidebarItems,
  }

  return (
    <DynamicMainLayout dynamicSidebar={dynamicSidebarConfig}>
      <div className="space-y-12">
        {positionGroups.length > 0 ? (
          positionGroups.map((positionGroup, positionIndex) => (
            <div key={positionGroup.position.id}>
              <section 
                id={positionGroup.position.slug} 
                className="scroll-mt-8 space-y-6"
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
              
              {positionIndex < positionGroups.length - 1 && (
                <div className="pt-8">
                  <Separator />
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-4">No Members Found</h2>
            <p className="text-muted-foreground">
              Members will appear here once they are added through the admin panel.
            </p>
          </div>
        )}
      </div>
    </DynamicMainLayout>
  )
}