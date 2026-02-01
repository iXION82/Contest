import axios from 'axios';

const API_URL = 'http://localhost:5000';
const testUser = {
    name: 'Debug User',
    email: `debug${Math.floor(Math.random() * 10000)}@example.com`,
    password: 'password123',
    age: 30,
    experience: 5,
    skills: ['Debug'],
    totalProjects: 1,
    projectLinks: [],
    preferredRoles: ['Debugger'],
    preferredLocations: ['Remote'],
    expectedSalary: 100000,
    preferredJobTypes: ['Full-time'],
    appliedJobs: []
};

async function run() {
    try {
        console.log('Sending Create User Request...');
        const res = await axios.post(`${API_URL}/user/create`, testUser);
        console.log('Response Status:', res.status);
        console.log('Response Body:', JSON.stringify(res.data, null, 2));
        console.log('Extracted _id:', res.data._id);

        if (typeof res.data._id === 'string' && res.data._id.length > 10) {
            console.log('✅ ID looks valid');

            
            console.log('Fetching profile with ID:', res.data._id);
            const prof = await axios.get(`${API_URL}/user/profile/${res.data._id}`);
            console.log('Profile:', JSON.stringify(prof.data, null, 2));

            
            try {
                console.log('Fetching profile with Name (expect fail):');
                await axios.get(`${API_URL}/user/profile/${testUser.name}`);
            } catch (e: any) {
                console.log('✅ Expected error:', e.response?.data?.message || e.message);
                if (e.response && e.response.data) console.log('Error Data:', JSON.stringify(e.response.data));
            }

        } else {
            console.log('❌ ID invalid');
        }

    } catch (e: any) {
        console.error('❌ Request failed:', e.message);
        if (e.response) console.error('Response:', e.response.data);
    }
}

run();
