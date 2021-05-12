import {properties, storage} from "@forge/api";
// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {IssueGlance, Fragment, Button} from "@forge/ui";
import {render, useProductContext, useState} from "@forge/ui";
import {PROJECTS_KEY, TOKEN_KEY, URL_KEY} from "./symbol";
import {ErrorSection, NewProjectDialog, ProjectSection} from "./components"
import * as utility from "./utility";


const App = () => {
    const context = useProductContext();
    const {issueKey} = context.platformContext;

    const [url] = useState(storage.get(URL_KEY));
    const [token] = useState(storage.get(TOKEN_KEY));
    const [defaultBranchName] = useState(utility.computeBranchName(issueKey))
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [projects, setProjects] = useState(
        properties.onJiraIssue(issueKey).get(PROJECTS_KEY)
    );

    if (!url || !token) {
        return (
            <ErrorSection
                title="Configuration Error"
                message={
                    "The Gitlab Connect application must be configured with a " +
                    "Gitlab URL and a Personal Access Token."
                }
            />
        );
    }

    const onProjectsDiscover = (filterBy) =>
        utility.fetchProjects(projects, filterBy, url, token);

    const onProjectAdd = (project) => {
        const _projects = utility.appendProject(project, projects);
        properties.onJiraIssue(issueKey).set(PROJECTS_KEY, _projects);
        setProjects(_projects);
    };
    const onProjectUpdate = (project) => {
        const _projects = utility.updateProject(project, projects);
        properties.onJiraIssue(issueKey).set(PROJECTS_KEY, _projects);
        setProjects(_projects);
    };
    const onProjectRemove = (project) => {
        const _projects = utility.removeProject(project, projects);
        properties.onJiraIssue(issueKey).set(PROJECTS_KEY, _projects);
        setProjects(_projects);
    };


    const onBranchCreate = (project, name, sourceBranch) =>
        utility.createBranch(name, sourceBranch, project, url, token);
    const onBranchDelete = (project, name) =>
        utility.deleteBranch(name, project, url, token);
    const onBranchesDiscover = (project) =>
        utility.fetchBranches(project, url, token);
    const onMergeRequestsDiscover = (project) =>
        utility.fetchMergeRequests(project, url, token);

    return (
        <Fragment>
            {
                projects && projects.map((project) => (
                    <ProjectSection
                        project={project}
                        defaultBranchName={defaultBranchName}
                        onUpdate={onProjectUpdate}
                        onRemove={onProjectRemove}
                        onBranchCreate={onBranchCreate}
                        onBranchDelete={onBranchDelete}
                        onBranchesDiscover={onBranchesDiscover}
                        onMergeRequestsDiscover={onMergeRequestsDiscover}
                    />
                ))
            }
            <Button
                text="Connect a New Project"
                onClick={() => setDialogOpen(true)}
                icon="add-circle"
            />
            {
                isDialogOpen &&
                <NewProjectDialog
                    onClose={() => setDialogOpen(false)}
                    onProjectsDiscover={onProjectsDiscover}
                    onProjectAdd={
                        (project) => {
                            onProjectAdd(project);
                            setDialogOpen(false);
                        }
                    }
                />
            }
        </Fragment>
    );
};


export const run = render(
    <IssueGlance>
        <App/>
    </IssueGlance>
);

