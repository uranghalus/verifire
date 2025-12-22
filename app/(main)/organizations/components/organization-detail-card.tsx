import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

type OrganizationDetail = {
    id: string
    name: string
    slug: string
    logo: string | null
    createdAt: string
    metadata: any
    members: {
        id: string
        role: string
        user: {
            name: string
            email: string
            image: string | null
        }
    }[]
    teams: {
        id: string
        name: string
        createdAt: string
    }[]
}

export function OrganizationDetailCard({
    data,
}: {
    data: OrganizationDetail
}) {
    return (
        <div className="space-y-6">
            {/* HEADER */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={data.logo ?? undefined} />
                        <AvatarFallback>
                            {data.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <CardTitle>{data.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {data.slug}
                        </p>
                    </div>
                </CardHeader>
            </Card>

            {/* INFO */}
            <Card>
                <CardHeader>
                    <CardTitle>Organization Info</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">ID</span>
                        <span className="font-mono">{data.id}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Created At</span>
                        <span>
                            {new Date(data.createdAt).toLocaleString()}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* MEMBERS */}
            <Card>
                <CardHeader>
                    <CardTitle>Members</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={member.user.image ?? undefined} />
                                    <AvatarFallback>
                                        {member.user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <p className="text-sm font-medium">
                                        {member.user.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {member.user.email}
                                    </p>
                                </div>
                            </div>

                            <Badge variant="secondary">
                                {member.role}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* TEAMS */}
            <Card>
                <CardHeader>
                    <CardTitle>Teams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {data.teams.map((team) => (
                        <div
                            key={team.id}
                            className="flex justify-between text-sm"
                        >
                            <span>{team.name}</span>
                            <span className="text-muted-foreground">
                                {new Date(team.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
