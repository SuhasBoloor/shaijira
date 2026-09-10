jest.mock('../../src/repository/projectRepository');
jest.mock('../../src/repository/projectMemberRepository');

const projectRepository = require('../../src/repository/projectRepository');
const projectMemberRepository = require('../../src/repository/projectMemberRepository');
const projectService = require('../../src/service/projectService');

describe("Project Service Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createProject", () => {
        it("should throw an error if project name already exists in the organization", async () => {
            projectRepository.findProjectByNameAndOrg.mockResolvedValue({ id: "p1", name: "Jira Clone" });

            await expect(projectService.createProject("Jira Clone", "org-1"))
                .rejects
                .toThrow("Project name already exists");

            expect(projectRepository.createProject).not.toHaveBeenCalled();
        });

        it("should create project and automatically add creator as project member", async () => {
            projectRepository.findProjectByNameAndOrg.mockResolvedValue(null);
            projectRepository.createProject.mockResolvedValue({ id: "p1", name: "Jira Clone", organizationId: "org-1" });
            projectMemberRepository.addMember.mockResolvedValue({ projectId: "p1", userId: "u1" });

            const result = await projectService.createProject("Jira Clone", "org-1", "Description", "u1");

            expect(result.id).toBe("p1");
            expect(projectRepository.createProject).toHaveBeenCalledWith("Jira Clone", "org-1", "Description");
            expect(projectMemberRepository.addMember).toHaveBeenCalledWith("p1", "u1");
        });
    });

    describe("getProjectsByOrg (Resource Scoping)", () => {
        const mockProjects = [
            { id: "p1", name: "Project Alpha" },
            { id: "p2", name: "Project Beta" },
            { id: "p3", name: "Project Gamma" }
        ];

        it("should return all projects when user is SuperAdmin", async () => {
            projectRepository.findProjectsByOrg.mockResolvedValue(mockProjects);

            const result = await projectService.getProjectsByOrg("org-1", "user-admin", true);

            expect(result).toHaveLength(3);
            expect(projectMemberRepository.findProjectsByUser).not.toHaveBeenCalled();
        });

        it("should filter and return ONLY projects assigned to regular user", async () => {
            projectRepository.findProjectsByOrg.mockResolvedValue(mockProjects);
            // User is only member of p1 and p3
            projectMemberRepository.findProjectsByUser.mockResolvedValue(["p1", "p3"]);

            const result = await projectService.getProjectsByOrg("org-1", "user-bob", false);

            expect(result).toHaveLength(2);
            expect(result.map(p => p.id)).toEqual(["p1", "p3"]);
        });
    });

    describe("getProjectsById (Access Control)", () => {
        it("should throw if user is not a member and not superadmin", async () => {
            projectRepository.findProjectById.mockResolvedValue({ id: "p1", name: "Secret Project" });
            projectMemberRepository.isMember.mockResolvedValue(false);

            await expect(projectService.getProjectsById("p1", "user-intruder", false))
                .rejects
                .toThrow("Access denied: Not a member of this project");
        });

        it("should return project if user is a member", async () => {
            projectRepository.findProjectById.mockResolvedValue({ id: "p1", name: "Secret Project" });
            projectMemberRepository.isMember.mockResolvedValue(true);

            const result = await projectService.getProjectsById("p1", "user-member", false);
            expect(result.name).toBe("Secret Project");
        });
    });
});
