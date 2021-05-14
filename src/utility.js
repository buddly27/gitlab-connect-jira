import api from "@forge/api";


export const computeDefaultNames = async (issueId) => {
    const res = await api
        .asApp()
        .requestJira(`/rest/api/3/issue/${issueId}?fields=summary`);

    const data = await res.json();
    const {fields} = data;
    const {summary} = fields;

    const summarySlug = summary.toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .slice(0, 250);

    return {
        branch: `${data.key}-${summarySlug}`,
        mergeRequest: `${data.key} ${summary}`
    };
};


export class GitlabBridge {

    constructor(gitlabUrl, accessToken) {
        this._url = `${gitlabUrl}/api/v4`;
        this._headers = {Authorization: `Bearer ${accessToken}`};
    }

    async searchProjects(filterBy, existingProjects = []) {
        if (filterBy.length === 0) {
            return [];
        }

        const path = `${this._url}/projects` +
            `?search=${encodeURI(filterBy)}` +
            "&min_access_level=30" +
            "&simple=true";

        const identifiers = existingProjects.map((project) => project.id);

        const result = await api.fetch(path, {method: "GET", headers: this._headers});
        if (!result.ok) {
            throw Error("The projects could not be fetched.");
        }

        const projects = await result.json();

        return projects.map((project) => ({
            id: project.id,
            name: project["name_with_namespace"],
            web_url: project.web_url,
            existing: identifiers.includes(project.id),
            defaultBranch: project["default_branch"],
            branches: [],
            mergeRequests: [],
        }));
    }

    async fetchBranches(project) {
        const path = `${this._url}/projects/${project.id}/repository/branches`;

        const result = await api.fetch(path, {method: "GET", headers: this._headers});
        if (!result.ok) {
            throw Error("The branches could not be fetched.");
        }

        const branches = await result.json();

        return branches.map((branch) => ({
            name: branch.name,
            merged: branch.merged,
            web_url: branch.web_url,
        }));
    }

    async fetchBranch(name, project) {
        const path = `${this._url}/projects/${project.id}/repository/branches/${name}`;

        const result = await api.fetch(path, {method: "GET", headers: this._headers});

        const data = await result.json();
        if (!data.name) {
            throw Error(`The branch could not be fetched: ${data.message}`);
        }

        return {
            name: data.name,
            merged: data.merged,
            web_url: data.web_url,
        };
    }

    async deleteBranch(name, project) {
        const path = `${this._url}/projects/${project.id}/repository/branches/${name}`;

        await api.fetch(path, {method: "DELETE", headers: this._headers});
    }

    async createBranch(name, project) {
        const path = `${this._url}/projects/${project.id}/repository/branches`;

        const result = await api.fetch(path, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                branch: name,
                ref: project.defaultBranch,
            })
        });

        const data = await result.json();
        if (!data.name) {
            throw Error(`The branch could not be created: ${data.message}`);
        }

        return {
            name: data.name,
            merged: data.merged,
            web_url: data.web_url,
        };
    }

    async fetchMergeRequests(project) {
        const path = `${this._url}/projects/${project.id}/merge_requests`;

        const result = await api.fetch(path, {method: "GET", headers: this._headers});
        if (!result.ok) {
            throw Error("The merge requests could not be fetched.");
        }

        const mergeRequests = await result.json();

        return mergeRequests.map((mergeRequest) => ({
            id: mergeRequest["iid"],
            title: mergeRequest.title,
            state: mergeRequest.state,
            web_url: mergeRequest.web_url,
        }));
    }

    async fetchMergeRequestFromTitle(title, project) {
        const path = `${this._url}/projects/${project.id}/merge_requests` +
            `?search=${encodeURI(title)}&in=title`;

        const result = await api.fetch(path, {method: "GET", headers: this._headers});

        const data = await result.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw Error(`The merge request could not be fetched.`);
        }

        return {
            id: data[0]["iid"],
            title: data[0].title,
            state: data[0].state,
            web_url: data[0].web_url,
        };
    }

    async deleteMergeRequest(id, project) {
        const path = `${this._url}/projects/${project.id}/merge_requests/${id}`;

        await api.fetch(path, {method: "DELETE", headers: this._headers});
    }

    async createMergeRequest(title, branch, project) {
        const path = `${this._url}/projects/${project.id}/merge_requests`;

        const result = await api.fetch(path, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({
                title: title,
                source_branch: branch.name,
                target_branch: project.defaultBranch,
            })
        });

        const data = await result.json();
        if (!data.id) {
            throw Error(`The merge request could not be created: ${data.message}`);
        }

        return {
            id: data["iid"],
            title: data.title,
            state: data.state,
            web_url: data.web_url,
        };
    }
}
