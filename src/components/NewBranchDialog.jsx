// noinspection ES6UnusedImports
import ForgeUI, {useState} from "@forge/ui";
import {ModalDialog, Link, Strong, Text} from "@forge/ui";
import {TextField, Form, Select, Option} from "@forge/ui";


export const NewBranchDialog = (props) => {
    const {defaultName, allBranches, project, onClose, onBranchAdd} = props;

    const [name, setName] = useState(defaultName);
    const [error, setError] = useState(null);

    const onCreate = async (data) => {
        const _name = data["branch-name"];
        setName(_name);

        const sourceBranch = data["source-branch"];

        const names = project.branches.map((branch) => branch.name);
        if (names.includes(_name)) {
            setError("Branch name already exists, Please choose a different name.")
        }
        else {
            return await onBranchAdd(_name, sourceBranch);
        }
    }

    return (
        <ModalDialog
            header="Create New Branch"
            onClose={onClose}
        >
            <Form
                submitButtonText="Create Branch"
                onSubmit={onCreate}
            >
                <Text>
                    {"Target: "}
                    <Strong>
                        <Link href={project.web_url}>{project.name}</Link>
                    </Strong>
                </Text>

                <Select
                    label="Source Branch"
                    name="source-branch"
                    isRequired
                >
                    {
                        allBranches.map((branch) => (
                            <Option
                                label={branch.name}
                                value={branch.name}
                                defaultSelected={
                                    ["master", "main"].includes(branch.name)
                                }
                            />
                        ))
                    }
                </Select>
                <TextField
                    label="Branch Name"
                    name="branch-name"
                    defaultValue={name}
                    isRequired
                />

                {error && <Text>{error}</Text>}
            </Form>
        </ModalDialog>
    )
}
