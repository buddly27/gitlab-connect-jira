import {properties, storage} from "@forge/api";


const URL_KEY = "gitlab-connect-url";
const TOKEN_KEY = "gitlab-connect-token";
const PROJECTS_KEY = "gitlab-connect-projects";

export const getGitlabUrl = () => storage.get(URL_KEY);

export const getAccessToken = () => storage.get(TOKEN_KEY);

export const saveAdminSettings = async (gitlabUrl, accessToken) => {
    await storage.set(URL_KEY, gitlabUrl);
    await storage.set(TOKEN_KEY, accessToken);
};

export const getGitlabProjects = async (issueKey) => {
    return await properties.onJiraIssue(issueKey).get(PROJECTS_KEY) || [];
};

export const addGitlabProject = async (issueKey, project) => {
    const projects = await getGitlabProjects(issueKey);
    const updatedProjects = [...projects, project];
    await properties.onJiraIssue(issueKey).set(PROJECTS_KEY, updatedProjects);
    return updatedProjects;
};

export const updateGitlabProject = async (issueKey, project) => {
    const projects = await getGitlabProjects(issueKey);
    const index = projects.findIndex((p) => project.id === p.id);
    if (index === -1) {
        throw Error("Impossible to find index of Gitlab project to update");
    }

    projects[index] = project;
    await properties.onJiraIssue(issueKey).set(PROJECTS_KEY, projects);
    return projects;
};

export const removeGitlabProject = async (issueKey, project) => {
    const projects = await getGitlabProjects(issueKey);
    const index = projects.findIndex((p) => project.id === p.id);
    if (index === -1) {
        throw Error("Impossible to find index of Gitlab project to remove");
    }

    projects.splice(index, 1);
    await properties.onJiraIssue(issueKey).set(PROJECTS_KEY, projects);
    return projects;
};
