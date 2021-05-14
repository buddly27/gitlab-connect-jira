// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {Button, Fragment, Link, Strong, Text, useState, useEffect} from "@forge/ui";
import {BranchTable} from "./BranchTable";
import {MergeRequestTable} from "./MergeRequestTable";
import {NewBranchDialog} from "./NewBranchDialog";


export const ProjectSection = (props) => {
    const {project, bridge, defaultNames, editable, onUpdate, onRemove} = props;

    const [isDialogOpen, setDialogOpen] = useState(false);
    const [branches, setBranches] = useState([]);
    const [mergeRequests, setMergeRequests] = useState([]);

    useEffect(
        async () => {
            const allBranches = await bridge.fetchBranches(project);
            setBranches(
                allBranches.filter((data) => project.branches.includes(data.name))
            );

            const allMergeRequests = await bridge.fetchMergeRequests(project);
            setMergeRequests(
                allMergeRequests.filter((data) => project.mergeRequests.includes(data.id))
            );
        },
        [project]
    );

    const onBranchAdd = async (name) => {
        let branch;

        try {
            branch = await bridge.createBranch(name, project);
        }
        catch (error) {
            branch = await bridge.fetchBranch(name, project);
        }

        project.branches.push(branch.name);
        await onUpdate(project);
        setDialogOpen(false);
    };

    const onBranchRemove = async (branch) => {
        await bridge.deleteBranch(branch.name, project);
        project.branches = project.branches
            .filter((branchName) => branchName !== branch.name);

        await onUpdate(project);
    };

    const onMergeRequestAdd = async (branch) => {
        let mergeRequest;

        // TODO: Add UI to change the MR title.
        const title = defaultNames.mergeRequest;

        try {
            mergeRequest = await bridge.createMergeRequest(title, branch, project);
        }
        catch (error) {
            mergeRequest = await bridge.fetchMergeRequestFromTitle(title, project);
        }
        project.mergeRequests.push(mergeRequest.id);
        await onUpdate(project);
    };

    const onMergeRequestRemove = async (mergeRequest) => {
        await bridge.deleteMergeRequest(mergeRequest.id, project);
        project.mergeRequests = project.mergeRequests
            .filter((mergeRequestID) => mergeRequestID !== mergeRequest.id);

        await onUpdate(project);
    };

    return (
        <Fragment>
            <Text>
                <Strong>
                    <Link href={project.web_url}>{project.name}</Link>
                </Strong>
            </Text>
            {
                editable &&
                <Button
                    text="Remove Project"
                    appearance="subtle-link"
                    icon="editor-remove"
                    onClick={() => onRemove(project)}
                />
            }
            <BranchTable
                editable={editable}
                branches={branches}
                onCreate={() => setDialogOpen(true)}
                onRemove={onBranchRemove}
                onMergeRequestCreate={onMergeRequestAdd}
            />
            <MergeRequestTable
                editable={editable}
                mergeRequests={mergeRequests}
                onRemove={onMergeRequestRemove}
            />
            {
                isDialogOpen &&
                <NewBranchDialog
                    defaultName={defaultNames.branch}
                    project={project}
                    onClose={() => setDialogOpen(false)}
                    onBranchAdd={onBranchAdd}
                />
            }
        </Fragment>
    );
};
