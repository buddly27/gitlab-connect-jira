// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {Form, ModalDialog, TextField, useEffect, useState} from "@forge/ui";
import {ProjectTable} from "./ProjectTable";


export const NewProjectDialog = (props) => {
    const {bridge, existingProjects, onClose, onProjectAdd} = props;

    const [filterBy, setFilterBy] = useState("");
    const [projects, setProjects] = useState([]);

    const onFilterUpdate = (data) => setFilterBy(data["search"]);

    useEffect(
        async () => {
            const filteredProjects = await bridge.searchProjects(filterBy, existingProjects);
            setProjects(filteredProjects);
        },
        [filterBy]
    );

    return (
        <ModalDialog
            header="Connect a New Gitlab Project"
            onClose={onClose}
        >
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
