import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = "http://localhost:5000";

const testAuth = async () => {
    try {
        console.log("🚀 Starting Auth Tests...\n");

        
        const userEmail = `testuser${Math.floor(Math.random() * 1000)}@example.com`;
        const userPassword = "password123";

        
        console.log("Trying User Signup...");
        const userSignupRes = await axios.post(`${API_URL}/user/create`, {
            name: "Test User",
            email: userEmail,
            password: userPassword,
            age: 25,
            experience: 2,
            skills: ["React", "Node.js"],
            expectedSalary: 50000
        });
        console.log("✅ User Signup Successful:", userSignupRes.data._id);

        
        console.log("Trying User Login...");
        const userLoginRes = await axios.post(`${API_URL}/user/login`, {
            email: userEmail,
            password: userPassword
        });
        console.log("✅ User Login Successful:", userLoginRes.data.message);


        
        const companyEmail = `company${Math.floor(Math.random() * 1000)}@example.com`;
        const companyPassword = "securepass";

        
        console.log("\nTrying Company Signup...");
        const companySignupRes = await axios.post(`${API_URL}/company/register`, {
            name: "Tech Corp",
            email: companyEmail,
            password: companyPassword
        });
        console.log("✅ Company Signup Successful:", companySignupRes.data._id);

        
        console.log("Trying Company Login...");
        const companyLoginRes = await axios.post(`${API_URL}/company/login`, {
            email: companyEmail,
            password: companyPassword
        });
        console.log("✅ Company Login Successful:", companyLoginRes.data.message);

        console.log("\n🎉 All Auth Tests Passed!");

    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            console.error(`❌ Connection Refused! Is the server running on ${API_URL}?`);
        } else if (error.response) {
            console.error(`❌ API Error: ${error.response.status} ${error.response.statusText}`);
            console.error("Response Data:", error.response.data);
        } else {
            console.error("❌ Auth Test Failed:", error.message);
        }
    }
};

testAuth();
