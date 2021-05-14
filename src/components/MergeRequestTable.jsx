// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {StatusLozenge, Cell, Head, Row, Table, Text, Button, Link} from "@forge/ui";


export const MergeRequestTable = (props) => {
    const {editable, mergeRequests, onRemove} = props;

    const computeAppearance = (state) => {
        switch (state) {
            case "opened":
                return "inprogress";
            case "closed":
            case "locked":
                return "removed";
            case "merged":
                return "success";
            default:
                return "default";
        }
    };

    return (
        <Table>
            <Head>
                <Cell>
                    <Text>
                        <StatusLozenge
                            text={mergeRequests.length}
                            appearance={
                                (mergeRequests.length > 0) ? "success" : "removed"
                            }
                        />
                        {"  Merge Requests"}
                    </Text>
                </Cell>
                <Cell/>
                {editable && <Cell/>}
            </Head>
            {
                mergeRequests.map((mergeRequest) => (
                    <Row>
                        <Cell>
                            <Text>
                                <Link href={mergeRequest.web_url}>
                                    {`${mergeRequest.title} (!${mergeRequest.id})`}
                                </Link>
                            </Text>
                        </Cell>
                        <Cell>
                            <Text>
                                <StatusLozenge
                                    text={mergeRequest.state}
                                    appearance={computeAppearance(mergeRequest.state)}
                                />
                            </Text>
                        </Cell>
                        {
                            editable &&
                            <Cell>
                                <Button
                                    text="Delete"
                                    appearance="subtle-link"
                                    icon="editor-remove"
                                    onClick={() => onRemove(mergeRequest)}
                                />
                            </Cell>
                        }
                    </Row>
                ))
            }
        </Table>
    );
};
