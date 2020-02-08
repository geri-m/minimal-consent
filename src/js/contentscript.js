"use strict";

import Detector from "./Detector";

// Select the node that will be observed for mutations
const targetNode = document.getRootNode();

const detector = new Detector(targetNode);

