'use client'

import Link from 'next/link'

import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { combineName } from '@/lib/utils'

import { Spinner } from '@/components/ui/spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from './ui/button'

export default function WhoToFollow() {
  const users = useQuery(api.users.getRecentUsers)

  if (users === null) {
    return null
  }

  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle>Who to follow</CardTitle>
      </CardHeader>

      <CardContent>
        {!users && <Spinner />}

        <ul className='flex flex-col gap-3'>
          {users?.map(user => (
            <li key={user._id} className='flex items-center justify-between'>
              <div className='inline-flex items-center gap-2'>
                <Avatar className='size-5'>
                  <AvatarImage src={user?.imageUrl} alt={combineName(user)} />
                  <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>

                <h2 className='text-xs font-medium'>{combineName(user)}</h2>
              </div>

              <Button
                size='sm'
                variant='outline'
                className='rounded-full font-light'
              >
                Follow
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Link href='/' className='text-sm font-light text-emerald-600'>
          See more suggestions
        </Link>
      </CardFooter>
    </Card>
  )
}
