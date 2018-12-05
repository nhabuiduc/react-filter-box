import React from 'react';
import _ from "lodash";
import { hot } from 'react-hot-loader'

import "fixed-data-table/dist/fixed-data-table.min.css";

import "react-filter-box/lib/react-filter-box.css";
import "./app.less";
import Demo1 from "./Demo1";
import Demo2 from "./Demo2";
import Demo3 from "./Demo3";
import Demo4 from "./Demo4";

class App extends React.Component {
    render() {
        return (
            <div>
                <h2 style={{ textAlign: "center" }}>React Filter Box</h2>
                <Demo1 />
                <Demo2 />
                <Demo3 />
                <Demo4 />
            </div>
        )
    }
}

export default hot(module)(App);