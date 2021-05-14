// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {IssueGlance, Fragment, Button, render, useProductContext, useState} from "@forge/ui";
import {ErrorSection, NewProjectDialog, ProjectSection} from "./components";
import * as utility from "./utility";
import * as store from "./store";


const App = () => {
    const context = useProductContext();
    const {issueKey} = context.platformContext;

    const [url] = useState(store.getGitlabUrl());
    const [token] = useState(store.getAccessToken());
    const [defaultNames] = useState(utility.computeDefaultNames(issueKey));
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [projects, setProjects] = useState(store.getGitlabProjects(issueKey));
    const [editable, setEditable] = useState(false);

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

    const bridge = new utility.GitlabBridge(url, token);

    return (
        <Fragment>
            {
                projects.map((project) => (
                    <ProjectSection
                        project={project}
                        bridge={bridge}
                        defaultNames={defaultNames}
                        editable={editable}
                        onUpdate={
                            (project) => {
                                const _projects = store.updateGitlabProject(issueKey, project);
                                setProjects(_projects);
                            }
                        }
                        onRemove={
                            () => {
                                const _projects = store.removeGitlabProject(issueKey, project);
                                setProjects(_projects);
                            }
                        }
                    />
                ))
            }
            <Button
                text="Connect a New Project"
                onClick={() => setDialogOpen(true)}
                icon="add-circle"
            />
            <Button
                text={editable ? "Set Non Editable" : "Set Editable"}
                onClick={() => setEditable(!editable)}
                icon="edit"
            />
            {
                isDialogOpen &&
                <NewProjectDialog
                    bridge={bridge}
                    existingProjects={projects}
                    onClose={() => setDialogOpen(false)}
                    onProjectAdd={
                        (project) => {
                            const _projects = store.addGitlabProject(issueKey, project);
                            setProjects(_projects);
                            setDialogOpen(false);
                        }
                    }
                />
            }
        </Fragment>
    );
};

// noinspection JSUnusedGlobalSymbols
export const run = render(
    <IssueGlance>
        <App/>
    </IssueGlance>
);

