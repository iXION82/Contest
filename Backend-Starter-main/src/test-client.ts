import axios from 'axios';

const API_URL = 'http://localhost:5000';

const testUser = {
    name: 'Test User',
    email: `test${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'password123',
    age: 25,
    experience: 3,
    skills: ['Node.js', 'TypeScript', 'MongoDB'],
    totalProjects: 2,
    projectLinks: ['http://github.com/test/p1'],
    preferredRoles: ['Backend Developer'],
    preferredLocations: ['Remote', 'New York'],
    expectedSalary: 80000,
    preferredJobTypes: ['Full-time', 'Remote'],
    appliedJobs: []
};

const testJobs = [
    {
        title: 'Senior Backend Developer',
        company: 'Tech Corp',
        companyEmail: 'tech@corp.com',
        companyPassword: 'corpPassword1',
        requiredSkills: ['Node.js', 'TypeScript', 'AWS'],
        minExperience: 5,
        location: 'Remote',
        salary: 120000,
        jobType: 'Full-time',
        description: 'We need a senior dev.'
    },
    {
        title: 'Junior Backend Developer',
        company: 'Startup Inc',
        companyEmail: 'jobs@startup.inc',
        companyPassword: 'startupPass',
        requiredSkills: ['Node.js', 'MongoDB'],
        minExperience: 1,
        location: 'New York',
        salary: 60000,
        jobType: 'Full-time',
        description: 'Entry level backend role.'
    },
    {
        title: 'Frontend Developer',
        company: 'Web Studio',
        companyEmail: 'careers@webstudio.com',
        companyPassword: 'designPass',
        requiredSkills: ['React', 'CSS'],
        minExperience: 2,
        location: 'Remote',
        salary: 90000,
        jobType: 'Contract',
        description: 'Frontend role.'
    },
    {
        title: 'DevOps Engineer',
        company: 'Cloud Systems',
        companyEmail: 'hr@cloudsystems.io',
        companyPassword: 'cloudSecure',
        requiredSkills: ['AWS', 'Docker', 'Kubernetes'],
        minExperience: 4,
        location: 'San Francisco',
        salary: 130000,
        jobType: 'Full-time',
        description: 'Infrastructure role.'
    },
    {
        title: 'Backend Intern',
        company: 'Tech Corp',
        companyEmail: 'tech@corp.com',
        companyPassword: 'corpPassword1',
        requiredSkills: ['Node.js', 'JavaScript'],
        minExperience: 0,
        location: 'Remote',
        salary: 30000,
        jobType: 'Internship',
        description: 'Internship role.'
    }
];


async function runTests() {
    try {
        console.log('--- Testing Backend ---');

        let userId = '';
        console.log('1. Creating User...');
        try {
            const res = await axios.post(`${API_URL}/user/create`, testUser);
            console.log('Res Data:', JSON.stringify(res.data));
            userId = res.data._id;
            console.log('✅ User created, ID:', userId);
        } catch (e: any) {
            console.log('⚠️ User creation failed:', e.response?.data?.message || e.message);
        }

        console.log('2. Creating Jobs...');
        const jobIds: string[] = [];
        for (const job of testJobs) {
            try {
                const res = await axios.post(`${API_URL}/jobs/add`, job);
                console.log(`✅ Job created, ID: ${res.data._id}`);
                jobIds.push(res.data._id);
            } catch (e: any) {
                console.log(`⚠️ Job creation failed:`);
            }
        }

        console.log('3. Getting Recommendations...');
        if (userId) {
            const recRes = await axios.get(`${API_URL}/jobs/recommend/${userId}`);
            const recommendations = recRes.data.recommendations;
            console.log(`✅ Got ${recommendations.length} recommendations`);
            recommendations.forEach((job: any) => {
                console.log(`   - ${job.title} (${job.company}) Score: ${job.score}`);
            });

            console.log('4. Applying to Top Job...');
            if (recommendations.length > 0) {
                const topJob = recommendations[0];
                await axios.post(`${API_URL}/jobs/apply`, {
                    userId: userId,
                    jobId: topJob._id
                });
                console.log(`✅ Applied to ${topJob.title}`);

                console.log('5. Verifying Application...');
                const recRes2 = await axios.get(`${API_URL}/jobs/recommend/${userId}`);
                const recommendations2 = recRes2.data.recommendations;
                const found = recommendations2.find((j: any) => j._id === topJob._id);
                if (!found) {
                    console.log(`✅ Verified: Job ${topJob._id} is no longer in recommendations`);
                } else {
                    console.log(`❌ Error: Job ${topJob._id} is still in recommendations`);
                }

                console.log('6. Verifying Applicants Endpoint...');
                const appRes = await axios.get(`${API_URL}/jobs/${topJob._id}/applicants`);
                const applicants = appRes.data.applicants;
                const applicantFound = applicants.find((u: any) => u._id === userId);
                if (applicantFound) {
                    console.log(`✅ Verified: User ${userId} is in applicants list for ${topJob._id}`);
                } else {
                    console.log(`❌ Error: User ${userId} not found in applicants list`);
                }
            }

            console.log('7. Verifying Get All Jobs Endpoint...');
            const allJobsRes = await axios.get(`${API_URL}/jobs`);
            const allJobs = allJobsRes.data.jobs;
            console.log(`✅ Fetched ${allJobs.length} total jobs`);

            console.log('8. Verifying User Applications Endpoint...');
            const appsRes = await axios.get(`${API_URL}/user/${userId}/applications`);
            const applications = appsRes.data.applications;
            console.log(`✅ Fetched ${applications.length} applications for user`);
            if (applications.length > 0) {
                console.log(`   - First application: ${applications[0].title}`);
            }
        }



        console.log('--- Tests Completed ---');
    } catch (error: any) {
        if (error.response) {
            console.error(`❌ Test failed: ${error.response.status} ${error.response.statusText}`);
            console.error('Response data:', JSON.stringify(error.response.data));
        } else {
            console.error('❌ Test failed:', error.message);
        }
    }
}
setTimeout(runTests, 2000);
