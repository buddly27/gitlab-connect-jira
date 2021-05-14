// noinspection ES6UnusedImports
import ForgeUI from "@forge/ui";
import {AdminPage, render} from "@forge/ui";
import {AdminSection} from "./components";
import * as store from "./store";


const App = () => (
    <AdminSection
        gitlabUrl={store.getGitlabUrl()}
        accessToken={store.getAccessToken()}
        onUpdate={(url, token) => store.saveAdminSettings(url, token)}
    />
);

// noinspection JSUnusedGlobalSymbols
export const run = render(
    <AdminPage>
        <App/>
    </AdminPage>
);
