import NewPostForm from '@/components/new-post-form'

export default async function Write() {
  return (
    <section className='pb-24 pt-32 sm:pt-40'>
      <div className='container max-w-3xl'>
        <h1 className='mb-10 text-center font-serif text-5xl font-medium'>
          New Post
        </h1>

        <NewPostForm />
      </div>
    </section>
  )
}
