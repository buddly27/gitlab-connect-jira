// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {ModalDialog, Link, Strong, Text, TextField, Form, useState} from "@forge/ui";


export const NewBranchDialog = (props) => {
    const {defaultName, project, onClose, onBranchAdd} = props;

    const [name, setName] = useState(defaultName);
    const [error, setError] = useState(null);

    const onCreate = async (data) => {
        const _name = data["branch-name"];
        setName(_name);

        if (_name.search(/[^a-zA-Z0-9_-]/) !== -1) {
            setError("The name of the branch is incorrect.");
            return;
        }

        const names = project.branches.map((branch) => branch.name);
        if (names.includes(_name)) {
            setError("Branch name already exists, Please choose a different name.");
            return;
        }

        return await onBranchAdd(_name);
    };

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

                <TextField
                    label="Branch Name"
                    name="branch-name"
                    defaultValue={name}
                    isRequired
                />

                {error && <Text>{error}</Text>}
            </Form>
        </ModalDialog>
    );
};
