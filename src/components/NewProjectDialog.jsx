// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {Form, ModalDialog, TextField, useEffect, useState} from "@forge/ui";
import {ProjectTable} from "./ProjectTable";
import {ErrorSection} from "./ErrorSection";


export const NewProjectDialog = (props) => {
    const {bridge, existingProjects, onClose, onProjectAdd} = props;

    const [filterBy, setFilterBy] = useState("");
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    const onFilterUpdate = (data) => setFilterBy(data["search"]);

    useEffect(
        async () => {
            try {
                const filteredProjects = await bridge.searchProjects(filterBy, existingProjects);
                setProjects(filteredProjects);
                setError(null);
            }
            catch (error) {
                setError(error.message);
            }
        },
        [filterBy]
    );

    return (
        <ModalDialog
            header="Connect a New Gitlab Project"
            onClose={onClose}
        >
            {error && <ErrorSection title="Connection Error" message={error}/>}

            <Form
                submitButtonText="Search"
                onSubmit={onFilterUpdate}
            >
                <TextField
                    label="Search"
                    name="search"
                    defaultValue={filterBy}
                />
            </Form>

            <ProjectTable
                projects={projects}
                onSubmit={onProjectAdd}
            />
        </ModalDialog>
    );
};
