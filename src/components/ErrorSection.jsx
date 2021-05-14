// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {SectionMessage, Text} from "@forge/ui";


export const ErrorSection = (props) => {
    const {title, message} = props;

    return (
        <SectionMessage title={title} appearance="error">
            <Text>{message}</Text>
        </SectionMessage>
    );
};
