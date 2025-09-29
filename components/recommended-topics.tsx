import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Link from 'next/link'

const tags = [
  'JavaScript',
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'GraphQL',
  'Prisma',
  'PostgreSQL',
  'Docker'
]

export default function RecommendedTopics() {
  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle>Recommended Topics</CardTitle>
      </CardHeader>

      <CardContent>
        <div className='flex flex-wrap gap-2'>
          {tags.map(tag => (
            <Badge key={tag} variant='secondary' className='font-light'>
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Link href='/' className='text-sm font-light text-emerald-600'>
          See more topics
        </Link>
      </CardFooter>
    </Card>
  )
}
