// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {StatusLozenge, Cell, Head, Row, Table, Text} from "@forge/ui";


export const MergeRequestTable = (props) => {
    const {mergeRequests} = props;

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
            </Head>
            {
                mergeRequests.map((mergeRequest) => (
                    <Row>
                        <Cell>
                            <Text>{mergeRequest.name}</Text>
                        </Cell>
                        <Cell>
                            <Text>Open</Text>
                        </Cell>
                    </Row>
                ))
            }
        </Table>
    )
}
