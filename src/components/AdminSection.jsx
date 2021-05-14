// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {Form, TextField, useState} from "@forge/ui";


export const AdminSection = (props) => {
    const {gitlabUrl, accessToken, onUpdate} = props;

    const [url, setUrl] = useState(gitlabUrl);
    const [token, setToken] = useState(accessToken);

    const onSubmit = async (data) => {
        // API calls may not to get through with trailing slash.
        if (data.url.endsWith("/")) {
            data.url = data.url.slice(0, -1);
        }

        await onUpdate(data.url, data.token);
        setUrl(data.url);
        setToken(data.token);
    };

    return (
        <Form
            submitButtonText="Update"
            onSubmit={onSubmit}
        >
            <TextField
                name="url"
                label="Gitlab Url"
                placeholder="https://gitlab.yourdomain.com"
                isRequired
                defaultValue={url}
            />
            <TextField
                name="token"
                label="Personal Access Token"
                isRequired
                defaultValue={token}
            />
        </Form>
    );
};
