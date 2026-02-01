import Job, { type IJob } from "../models/job.model.js";
import { type IUser } from "../models/user.model.js";


interface JobWithScore extends IJob {
    score: number;
}

export const findMatches = async (user: IUser): Promise<IJob[]> => {
    const allJobs = await Job.find({}).lean();

    const scoredJobs = allJobs.map((job) => {
        let score = 0;

        const userSkills = user.skills || [];
        const skillOverlap = job.requiredSkills.filter((skill) =>
            userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        ).length;

        const skillMatchRatio = job.requiredSkills.length > 0 ? skillOverlap / job.requiredSkills.length : 0;
        score += skillMatchRatio * 30;

        if ((user.experience || 0) >= job.minExperience) {
            score += 20;
        }

        const roleMatch = user.preferredRoles.some((role) =>
            job.title.toLowerCase().includes(role.toLowerCase())
        );
        if (roleMatch) {
            score += 15;
        }

        const locationMatch = user.preferredLocations.some((loc) =>
            job.location.toLowerCase().includes(loc.toLowerCase())
        );
        if (locationMatch) {
            score += 10;
        }

        if (job.salary >= user.expectedSalary) {
            score += 15;
        }

        const typeMatch = user.preferredJobTypes.some((type) =>
            job.jobType.toLowerCase() === type.toLowerCase()
        );
        if (typeMatch) {
            score += 10;
        }


        return { ...job, score };
    });

    const notAppliedJobs = scoredJobs.filter(
        (job) => !user.appliedJobs.includes(job._id.toString())
    );

    notAppliedJobs.sort((a, b) => b.score - a.score);
    return notAppliedJobs.slice(0, 10) as unknown as IJob[];
};
