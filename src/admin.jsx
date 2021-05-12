import {storage} from "@forge/api";
// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {AdminPage, Form, TextField, render, useState} from "@forge/ui";
import {URL_KEY, TOKEN_KEY} from "./symbol";

const App = () => {
    const [url, setUrl] = useState(storage.get(URL_KEY));
    const [token, setToken] = useState(storage.get(TOKEN_KEY));

    const onUpdate = async (data) => {
        if (data[URL_KEY].endsWith("/")) {
            data[URL_KEY] = data[URL_KEY].slice(0, -1)
        }

        await storage.set(URL_KEY, data[URL_KEY])
        setUrl(data[URL_KEY])

        await storage.set(TOKEN_KEY, data[TOKEN_KEY])
        setToken(data[TOKEN_KEY])
    }

    return (
        <Form
            submitButtonText="Update"
            onSubmit={onUpdate}
        >
            <TextField
                name={URL_KEY}
                label="Gitlab Url"
                placeholder="https://gitlab.yourdomain.com"
                isRequired
                defaultValue={url}
            />
            <TextField
                name={TOKEN_KEY}
                label="Personal Access Token"
                isRequired
                defaultValue={token}
            />
        </Form>
    );
};

export const run = render(
    <AdminPage>
        <App/>
    </AdminPage>
);
