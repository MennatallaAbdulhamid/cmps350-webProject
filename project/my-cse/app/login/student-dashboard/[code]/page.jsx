import NavBar from '@/app/components/NavBar'


export default async function CourseRegistrationPage({ searchParams }) {


  return (
    <main>
      <NavBar />
      <h1>{searchParams.code} is working</h1>
    </main>
  )
}
