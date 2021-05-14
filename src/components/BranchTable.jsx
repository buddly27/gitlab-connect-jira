// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {Button, StatusLozenge, Text, Link} from "@forge/ui";
import {Cell, Head, Row, Table} from "@forge/ui";


export const BranchTable = (props) => {
    const {editable, branches, onCreate, onRemove, onMergeRequestCreate} = props;

    return (
        <Table>
            <Head>
                <Cell>
                    <Text>
                        <StatusLozenge
                            text={branches.length}
                            appearance={
                                (branches.length > 0) ? "success" : "removed"
                            }
                        />
                        {"  Branches"}
                    </Text>
                </Cell>
                <Cell/>
                {editable && <Cell/>}
            </Head>
            {
                branches.map((branch) => (
                    <Row>
                        <Cell>
                            <Text>
                                <Link href={branch.web_url}>{branch.name}</Link>
                            </Text>
                        </Cell>
                        <Cell>
                            {
                                (branch.mergeRequest) ? (
                                    <Text>
                                        <Link href={branch.mergeRequest.web_url}>
                                            {`(!${branch.mergeRequest.id})`}
                                        </Link>
                                    </Text>
                                ) : (
                                    <Button
                                        text="Create MR"
                                        appearance="subtle-link"
                                        icon="bitbucket-pullrequests"
                                        onClick={() => onMergeRequestCreate(branch)}
                                    />
                                )
                            }
                        </Cell>
                        {
                            editable &&
                            <Cell>
                                <Button
                                    text="Delete"
                                    appearance="subtle-link"
                                    icon="editor-remove"
                                    onClick={() => onRemove(branch)}
                                />
                            </Cell>
                        }
                    </Row>
                ))
            }
            <Row>
                <Cell>
                    <Button
                        text="Create Branch"
                        appearance="subtle-link"
                        icon="bitbucket-branches"
                        onClick={onCreate}
                    />
                </Cell>
                <Cell/>
                {editable && <Cell/>}
            </Row>
        </Table>
    );
};


