'use client';

import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell ,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,LineChart, Line
} from 'recharts';

export default function StatisticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/statistics')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <p className="p-6">Loading statistics...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Student and Course Analytics Dashboard</h1>
      <ul className="mb-8 space-y-2 ">
        <li>Total Students: {data.totalStudents}</li>
        <li>Total Courses: {data.totalCourses}</li>
      </ul>
      <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Students per Year</h2>
          <PieChart width={500} height={300}>
            <Pie
              data={data.studentsPerYear.map((item) => ({
                year: `Year ${item.yearOfStudy}`,
                count: item._count.yearOfStudy,
              }))}
              dataKey="count"
              nameKey="year"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#0088FE"
              label
            >
              {data.studentsPerYear.map((item, idx) => (
                <Cell key={`cell-${idx}`} fill={['#dac7ff', '#ac8bee', '#7151a9', '#46325d'][idx % 4]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Top 3 Most Taken Courses</h2>
        <BarChart width={500} height={300} data={data.topCourses}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#a266c7" />
        </BarChart>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">CS Courses with Highest Student Count</h2>
        <BarChart width={700} height={300} data={data.csStudentsCourseData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="course" angle={-30} textAnchor="end" interval={0} height={100} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="students" fill="#ffc243" />
      </BarChart>
      </div>
      <div className="mt-8">

  <h2 className="text-xl font-semibold mb-2">CE Courses with Highest Student Count</h2>
  <BarChart width={500} height={300} data={data.ceStudentsCourseData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="course" angle={-30} textAnchor="end" interval={0} height={100} />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="students" fill="#fa8b01" />
  </BarChart>
</div>

<div className="mt-8">
  <h2 className="text-xl font-semibold mb-2">Top Courses Taken per Academic Year for CS and CE Students</h2>
  <BarChart width={500} height={300} data={data.mostTakenCoursesByYear || []}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="year" tickFormatter={y => `Year ${y}`} />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="count" fill="#72369d" name="Registrations" />
  </BarChart>
  <ul className="mt-4">
  {(data.mostTakenCoursesByYear || []).map(item => (
    <li key={item.year}>
      <strong>Year {item.year}:</strong> {item.course} ({item.count} registrations)
    </li>
  ))}
</ul>
</div>

<div className="mt-8">
  <h2 className="text-xl font-semibold mb-2">Failure Rate per Course Category</h2>
    <BarChart width={500} height={300} data={data.failureRateCategoryData}>
      <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="failureRate" fill="#cc444b" />
        </BarChart>
      </div>

<div className="mt-8">
  <h2 className="text-xl font-semibold mb-2">Most Failed Course in Each Category</h2>
  <BarChart width={700} height={300} data={data.mostFailedCourseByCategory || []}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="course" tick={false} /> 
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="failures" fill="#cc444b" />
</BarChart>
  <ul className="mt-4">
    {(data.mostFailedCourseByCategory || []).map(item => (
      <li key={item.category}>
        <strong>{item.category}:</strong> {item.course} ({item.failures} failures)
      </li>
    ))}
  </ul>
</div>

<div className="mt-8">
  <h2 className="text-xl font-semibold mb-2">Pass Rate per CS Course</h2>
  <BarChart width={700} height={300} data={data.csCePassRateData.filter(d => d.category === 'CS')}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="course" angle={-30} textAnchor="end" interval={0} height={100} />
    <YAxis domain={[0, 100]} />
    <Tooltip />
    <Legend />
    <Bar dataKey="passRate" fill="#35d475" />
  </BarChart>
</div>

<div className="mt-8">
  <h2 className="text-xl font-semibold mb-2">Pass Rate per CE Course</h2>
  <BarChart width={700} height={300} data={data.csCePassRateData.filter(d => d.category === 'Engineering')}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="course" angle={-30} textAnchor="end" interval={0} height={100} />
    <YAxis domain={[0, 100]} />
    <Tooltip />
    <Legend />
    <Bar dataKey="passRate" fill="#35ac7a" />
  </BarChart>
</div>

  <div className="mt-8">
  <h2 className="text-xl font-semibold mb-2">
    First-Year CS & CE Students: Grade Distribution
  </h2>
  <LineChart width={500} height={300} data={data.firstYearGradeDistribution || []}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="grade" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="count" stroke="#7400b8" />
</LineChart>
</div>

    </div>
  );
}

// 'use client';

// import { useEffect, useState } from 'react';
// import {
//   PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
// } from 'recharts';
// import { getStatisticsData } from '@/app/actions/statistics-actions';

// export default function StatisticsPage() {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const statsData = await getStatisticsData();
//         setData(statsData);
//       } catch (err) {
//         console.error('Error fetching statistics:', err);
//         setError(err.message);
//       }
//     }
    
//     fetchData();
//   }, []);

//   if (error) {
//     return <p className="p-6 text-red-500">Error: {error}</p>;
//   }

//   if (!data) {
//     return <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
//         <p className="mt-3 text-lg font-medium text-gray-700">Loading statistics...</p>
//       </div>
//     </div>;
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen pb-12">
//       {/* Header */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <h1 className="text-3xl font-bold text-purple-900">Student & Course Analytics Dashboard</h1>
//           <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
//             <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//               <div className="px-4 py-5 sm:p-6">
//                 <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
//                 <dd className="mt-1 text-3xl font-semibold text-purple-700">{data.totalStudents}</dd>
//               </div>
//             </div>
//             <div className="bg-white overflow-hidden shadow-sm rounded-lg">
//               <div className="px-4 py-5 sm:p-6">
//                 <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
//                 <dd className="mt-1 text-3xl font-semibold text-purple-700">{data.totalCourses}</dd>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
//         <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
//           {/* Students per Year */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Students per Year</h2>
//             <div className="flex justify-center">
//               <PieChart width={350} height={300}>
//                 <Pie
//                   data={data.studentsPerYear.map((item) => ({
//                     year: `Year ${item.yearOfStudy}`,
//                     count: item._count.yearOfStudy,
//                   }))}
//                   dataKey="count"
//                   nameKey="year"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={110}
//                   fill="#8884d8"
//                   label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {data.studentsPerYear.map((item, idx) => (
//                     <Cell key={`cell-${idx}`} fill={['#dac7ff', '#ac8bee', '#7151a9', '#46325d'][idx % 4]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value) => [`${value} students`, 'Count']} />
//                 <Legend />
//               </PieChart>
//             </div>
//           </div>

//           {/* Top Courses */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Top 3 Most Taken Courses</h2>
//             <BarChart width={350} height={300} data={data.topCourses} layout="vertical">
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis type="number" />
//               <YAxis dataKey="name" type="category" width={120} />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" name="Students" fill="#a266c7" radius={[0, 4, 4, 0]} />
//             </BarChart>
//           </div>

//           {/* CS Courses */}
//           <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">CS Courses with Highest Student Count</h2>
//             <BarChart width={750} height={300} data={data.csStudentsCourseData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="course" angle={-30} textAnchor="end" interval={0} height={100} />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="students" name="Students" fill="#ffc243" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </div>

//           {/* CE Courses */}
//           <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">CE Courses with Highest Student Count</h2>
//             <BarChart width={750} height={300} data={data.ceStudentsCourseData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="course" angle={-30} textAnchor="end" interval={0} height={100} />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="students" name="Students" fill="#fa8b01" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </div>

//           {/* Courses by Year */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Courses Taken per Academic Year</h2>
//             <BarChart width={350} height={300} data={data.mostTakenCoursesByYear || []}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="year" tickFormatter={y => `Year ${y}`} />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" name="Registrations" fill="#72369d" radius={[4, 4, 0, 0]} />
//             </BarChart>
//             <div className="mt-4 border-t pt-4">
//               <h3 className="font-medium text-gray-700 mb-2">Details:</h3>
//               <ul className="space-y-1 text-sm text-gray-600">
//                 {(data.mostTakenCoursesByYear || []).map(item => (
//                   <li key={item.year} className="flex items-start">
//                     <span className="inline-block w-16 font-semibold">Year {item.year}:</span> 
//                     <span>{item.course} <span className="text-gray-500">({item.count} registrations)</span></span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Failure Rate */}
//           <div className="bg-white rounded-lg shadow-md p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Failure Rate per Course Category</h2>
//             <BarChart width={350} height={300} data={data.failureRateCategoryData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="category" />
//               <YAxis />
//               <Tooltip formatter={(value) => [`${value}%`, 'Failure Rate']} />
//               <Legend />
//               <Bar dataKey="failureRate" name="Failure Rate (%)" fill="#cc444b" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </div>

//           {/* Most Failed Course */}
//           <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Most Failed Course in Each Category</h2>
//             <BarChart width={750} height={300} data={data.mostFailedCourseByCategory || []}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="course" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="failures" name="Number of Failures" fill="#cc444b" radius={[4, 4, 0, 0]} />
//             </BarChart>
//             <div className="mt-4 border-t pt-4">
//               <h3 className="font-medium text-gray-700 mb-2">Details by Category:</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {(data.mostFailedCourseByCategory || []).map(item => (
//                   <div key={item.category} className="bg-red-50 p-3 rounded-lg">
//                     <h4 className="font-semibold text-red-800">{item.category}</h4>
//                     <p className="text-red-700">{item.course}</p>
//                     <p className="text-sm text-red-600">{item.failures} failures</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Pass Rate CS */}
//           <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Pass Rate per CS Course</h2>
//             <BarChart width={750} height={300} data={data.csCePassRateData.filter(d => d.category === 'CS')}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="course" angle={-30} textAnchor="end" interval={0} height={100} />
//               <YAxis domain={[0, 100]} />
//               <Tooltip formatter={(value) => [`${value}%`, 'Pass Rate']} />
//               <Legend />
//               <Bar dataKey="passRate" name="Pass Rate (%)" fill="#35d475" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </div>

//           {/* Pass Rate CE */}
//           <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Pass Rate per CE Course</h2>
//             <BarChart width={750} height={300} data={data.csCePassRateData.filter(d => d.category === 'Engineering')}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="course" angle={-30} textAnchor="end" interval={0} height={100} />
//               <YAxis domain={[0, 100]} />
//               <Tooltip formatter={(value) => [`${value}%`, 'Pass Rate']} />
//               <Legend />
//               <Bar dataKey="passRate" name="Pass Rate (%)" fill="#35ac7a" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </div>

//           {/* Grade Distribution */}
//           <div className="bg-white rounded-lg shadow-md p-6 col-span-1 md:col-span-2">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">First-Year CS & CE Students: Grade Distribution</h2>
//             <LineChart width={750} height={300} data={data.firstYearGradeDistribution || []}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="grade" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line 
//                 type="monotone" 
//                 dataKey="count" 
//                 name="Number of Students" 
//                 stroke="#7400b8" 
//                 strokeWidth={2}
//                 dot={{ fill: '#7400b8', r: 5 }}
//                 activeDot={{ r: 8 }}
//               />
//             </LineChart>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center text-sm text-gray-500">
//         © 2022 MYCSE Portal Computer Science and Engineering Department | Contact: support@qu.edu.qa
//       </div>
//     </div>
//   );
// }