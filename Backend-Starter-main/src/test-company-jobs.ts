import axios from 'axios';

const API_URL = 'http://localhost:5000';

const companyJobs = [
    {
        title: 'DevOps Lead',
        company: 'Special Corp',
        companyEmail: 'jobs@special.com',
        companyPassword: 'specialPass',
        requiredSkills: ['AWS', 'Docker'],
        minExperience: 5,
        location: 'Remote',
        salary: 140000,
        jobType: 'Full-time',
        description: 'Lead role.'
    },
    {
        title: 'Backend Dev',
        company: 'Special Corp',
        companyEmail: 'jobs@special.com',
        companyPassword: 'specialPass',
        requiredSkills: ['Node.js'],
        minExperience: 2,
        location: 'Remote',
        salary: 90000,
        jobType: 'Full-time',
        description: 'Backend role.'
    }
];

async function runTests() {
    try {
        console.log('--- Testing Company Jobs Feature ---');

        console.log('1. Creating Company Jobs...');
        for (const job of companyJobs) {
            try {
                // Remove the explicit jobId if present in the object locally, though interface doesn't enforce it?
                // Actually the array has jobId but we should just let mongo create it.
                // We will destructure it out to avoid sending it if the model rejects it or if we just want to be clean.
                const res = await axios.post(`${API_URL}/jobs/add`, job);
                console.log(`✅ Job created, ID: ${res.data._id}`);
            } catch (e: any) {
                console.log(`⚠️ Job creation failed:`, e.response?.data?.message || e.message);
            }
        }

        console.log('2. Fetching jobs by Company Email (jobs@special.com)...');
        const emailRes = await axios.get(`${API_URL}/jobs/company?query=jobs@special.com`);
        const emailJobs = emailRes.data.jobs;
        if (emailJobs.length >= 2) {
            console.log(`✅ Found ${emailJobs.length} jobs for email`);
        } else {
            console.log(`❌ Expected at least 2 jobs, found ${emailJobs.length}`);
        }

        console.log('3. Fetching jobs by Company Name (Special Corp)...');
        const nameRes = await axios.get(`${API_URL}/jobs/company?query=Special Corp`);
        const nameJobs = nameRes.data.jobs;
        if (nameJobs.length >= 2) {
            console.log(`✅ Found ${nameJobs.length} jobs for name`);
        } else {
            console.log(`❌ Expected at least 2 jobs, found ${nameJobs.length}`);
        }

        console.log('4. Fetching jobs by unknown company...');
        const unknownRes = await axios.get(`${API_URL}/jobs/company?query=Unknown`);
        const unknownJobs = unknownRes.data.jobs;
        if (unknownJobs.length === 0) {
            console.log(`✅ Found 0 jobs for unknown company`);
        } else {
            console.log(`❌ Expected 0 jobs, found ${unknownJobs.length}`);
        }

        console.log('--- Company Jobs Tests Completed ---');

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
