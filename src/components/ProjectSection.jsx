// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {Button, Fragment, Link, Strong, Text, useState, useEffect} from "@forge/ui";
import {BranchTable} from "./BranchTable";
import {MergeRequestTable} from "./MergeRequestTable";
import {NewBranchDialog} from "./NewBranchDialog";


export const ProjectSection = (props) => {
    const {
        project,
        defaultBranchName,
        onUpdate,
        onRemove,
        onBranchCreate,
        onBranchDelete,
        onBranchesDiscover,
        onMergeRequestsDiscover,
    } = props;

    const [isBranchDialogOpen, setBranchDialogOpen] = useState(false);
    const [allBranches, setAllBranches] = useState([]);
    const [branches, setBranches] = useState([]);
    const [mergeRequests, setMergeRequests] = useState([]);

    useEffect(
        async () => {
            const _allBranches = await onBranchesDiscover(project);
            setAllBranches(_allBranches)

            const names = project.branches.map((branch) => branch.name);
            const _branches = _allBranches.filter((branch) => {
                return names.includes(branch.name)
            });
            setBranches(_branches)

            const _mergeRequests = await onMergeRequestsDiscover(project);
            setMergeRequests(_mergeRequests)

            if (names.length !== _branches.length) {
                project.branches = _branches;
                await onUpdate(project);
            }
        },
        [project]
    );

    const onBranchAdd = async (name, sourceBranch) => {
        const branch = await onBranchCreate(project, name, sourceBranch);
        project.branches.push(branch);

        await onUpdate(project);
        setBranchDialogOpen(false);
    }

    const onBranchRemove = async (name) => {
        await onBranchDelete(project, name);
        project.branches = project.branches.filter((branch) => branch.name !== name);

        await onUpdate(project);
    }

    return (
        <Fragment>
            <Text>
                <Strong>
                    <Link href={project.web_url}>{project.name}</Link>
                </Strong>
            </Text>
            <Button
                text="Remove Project"
                appearance="subtle-link"
                icon="editor-remove"
                onClick={() => onRemove(project)}
            />
            <BranchTable
                branches={branches}
                onCreate={() => setBranchDialogOpen(true)}
                onRemove={onBranchRemove}
                onMergeRequestCreate={}
            />
            <MergeRequestTable
                mergeRequests={mergeRequests}
            />
            {
                isBranchDialogOpen &&
                <NewBranchDialog
                    defaultName={defaultBranchName}
                    allBranches={allBranches}
                    project={project}
                    onClose={() => setBranchDialogOpen(false)}
                    onBranchAdd={onBranchAdd}
                />
            }
        </Fragment>
    );
}
