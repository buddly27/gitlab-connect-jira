// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {Button, Cell, Head, Row, Table, Text} from "@forge/ui";


export const ProjectTable = (props) => {
    const {projects, onSubmit} = props;

    return (
        <Table>
            <Head>
                <Cell>
                    <Text>ID</Text>
                </Cell>
                <Cell>
                    <Text>Name</Text>
                </Cell>
                <Cell />
            </Head>
            {projects.map(project => (
                <Row>
                    <Cell>
                        <Text>{project.id}</Text>
                    </Cell>
                    <Cell>
                        <Text>{project.name}</Text>
                    </Cell>
                    <Cell>
                        {
                            (project.existing) ?
                                <Text>Already Connected</Text>
                                : <Button text="Add" onClick={() => onSubmit(project)}/>
                        }
                    </Cell>
                </Row>
            ))}
        </Table>
    )
}
