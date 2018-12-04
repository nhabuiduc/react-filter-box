import * as React from 'react';
import * as _ from "lodash";

import "fixed-data-table/dist/fixed-data-table.min.css";

import "../ReactFilterBox.less";
import "./app.less";
import Demo1 from "./demo1";
import Demo2 from "./demo2";
import Demo3 from "./demo3";

import { hot } from 'react-hot-loader'


class App extends React.Component<any, any> {
    render() {
        return (
            <div>
                <h2 style={{ textAlign: "center" }}>React Filter Box</h2>
                <Demo1 />
                <Demo2 />
                <Demo3 />
            </div>
        )
    }
}

export default hot(module)(App)