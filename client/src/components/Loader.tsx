interface Props {}

const Loader = (props: Props) => {
  return (
    <div className='flex justify-center items-center py-3'>
      <div className='animate-spin rounded-full w-32 aspect-square border-b-2 border-red-700' />
    </div>
  )
}

export default Loader
