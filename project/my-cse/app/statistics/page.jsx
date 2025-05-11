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
