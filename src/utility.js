import api from "@forge/api";


export const removeProject = (project, projects) => {
    return projects.filter((p) => p.id !== project.id);
}


export const appendProject = (project, projects = []) => {
    return [...projects, project];
}


export const updateProject = (project, projects) => {
    return projects.map((p) => {
        if (p.id === project.id) {
            return project;
        }
        return p;
    })
}



export const computeBranchName = async (issueId) => {
    const res = await api
        .asApp()
        .requestJira(`/rest/api/3/issue/${issueId}?fields=summary`);

    const data = await res.json();
    const {fields} = data;

    const summary = fields.summary.toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-zA-Z ]/g, "-")
        .slice(0, 250);

    return `${data.key}-${summary}`;
}


export const fetchProjects = async (projects, filterBy, gitlabUrl, accessToken) => {
    if (!filterBy.length) {
        return [];
    }

    const path = `${gitlabUrl}/api/v4/projects?search=${encodeURI(filterBy)}&membership=true`;
    const identifiers = projects.map((project) => project.id);
    const headers = {Authorization: `Bearer ${accessToken}`};
    return await api.fetch(path, {headers})
        .then((response) => response.json())
        .then((projects) => projects.map((project) => ({
            id: project.id,
            name: project["name_with_namespace"],
            web_url: project.web_url,
            existing: identifiers.includes(project.id),
            branches: []
        })))
}


export const fetchBranches = async (project, gitlabUrl, accessToken) => {
    const path = `${gitlabUrl}/api/v4/projects/${project.id}/repository/branches`;

    const headers = {Authorization: `Bearer ${accessToken}`};
    return await api.fetch(path, {headers})
        .then((response) => response.json())
        .then((branches) => branches.map((branch) => ({
            name: branch.name,
            merged: branch.merged,
            web_url: branch.web_url,
            mergeRequests: []
        })))
}


export const fetchMergeRequests = async (project, gitlabUrl, accessToken) => {
    const path = `${gitlabUrl}/api/v4/projects/${project.id}/merge_requests`;

    const identifiers = project.branches
        .map((branch) => {
            const mergeRequests = branch.mergeRequests || [];
            return mergeRequests.map((mergeRequest) => mergeRequest.id)
        })
        .flat()

    const headers = {Authorization: `Bearer ${accessToken}`};
    return await api.fetch(path, {headers})
        .then((response) => response.json())
        .then((mergeRequests) => mergeRequests.filter((mergeRequest) =>
            identifiers.includes(mergeRequest.id)
        ))
        .then((mergeRequests) => mergeRequests.map((mergeRequest) => ({
            id: mergeRequest.id,
            title: mergeRequest.title,
            state: mergeRequest.state,
            source_branch: mergeRequest.source_branch,
        })));
}


export const createBranch = async (name, source, project, gitlabUrl, accessToken) => {
    const path = `${gitlabUrl}/api/v4/projects/${project.id}/repository/branches`;

    const headers = {Authorization: `Bearer ${accessToken}`};
    const body = JSON.stringify({branch: name, ref: source})
    return await api.fetch(path, {method: "POST", headers, body})
        .then((response) => response.json())
        .then((branch) => ({
            name: branch.name,
            merged: branch.merged,
            web_url: branch.web_url,
            mergeRequests: []
        }));
}


export const deleteBranch = async (name, project, gitlabUrl, accessToken) => {
    const path = `${gitlabUrl}/api/v4/projects/${project.id}/repository/branches/${name}`;

    const headers = {Authorization: `Bearer ${accessToken}`};
    return await api.fetch(path, {method: "DELETE", headers})
}
