import * as vscode from 'vscode';
const path = require("path");
import { TreeItemLabel,TreeItemCollapsibleState,Command,ThemeIcon,Uri } from 'vscode';
class ItemLucky extends vscode.TreeItem {
    constructor(
        label: string | TreeItemLabel, 
        collapsibleState: TreeItemCollapsibleState, 
        command: any, 
        iconPath:string | Uri | { light: string | Uri; dark: string | Uri } | ThemeIcon
    ) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.contextValue = "";
        this.iconPath = iconPath;
    }
}

class TreeProvider {
    public data: any;
    public keyArr: any[];
    public workspaceRoot: any;
    public context: any;
    public constructor(workspace:any, data:any, context:any) {
        this.data = data;
        this.keyArr = Object.keys(data);
        this.workspaceRoot = workspace;
        this.context = context;
    }

    getTreeItem(item:any) {
        return item;
    }

    getChildren() {
        return this.keyArr.map((item:any) => {
            return this.newLuckyItem(this.data[item]);
        });
    }
    
    newLuckyItem(item: any) {
        const {
            label,
            extension,
            icon,
        } = item;

        let darkIcon = path.join(__dirname, "..", "img", icon);
        let lightIcon = path.join(__dirname, "..", "img", icon);

        return new ItemLucky(label, vscode.TreeItemCollapsibleState.None, {
            title:label,
            command:extension,
        } as Command, {
            dark: darkIcon,
            light: lightIcon
        });
    }
};

export default TreeProvider;